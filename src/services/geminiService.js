import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY || API_KEY === 'your_api_key_here') {
  console.warn('⚠️ AI service not configured. Running in limited mode.');
}

const genAI = API_KEY && API_KEY !== 'your_api_key_here' 
  ? new GoogleGenerativeAI(API_KEY)
  : null;

const getFallbackRecommendations = (userQuery, products) => {
  const query = userQuery.toLowerCase().trim();
  
  if (!query) {
    return {
      recommendations: [1, 7, 16, 2].map(id => ({
        productId: id,
        reason: 'Top-rated product recommended by our customers.'
      })),
      summary: 'Explore our most popular products across smartphones, laptops, and audio equipment. Each item is carefully selected for quality and performance.'
    };
  }
  
  const fallbackRules = [
    {
      keywords: ['phone', 'smartphone', 'mobile', 'iphone', 'android', 'cell', 'galaxy', 'pixel'],
      products: [2, 3, 4, 5],
      summary: 'Based on your search, we found excellent smartphones that match your needs. These devices offer great performance and value.'
    },
    {
      keywords: ['laptop', 'computer', 'programming', 'coding', 'work', 'macbook', 'notebook', 'pc'],
      products: [7, 9, 10, 8],
      summary: 'We recommend these laptops for their excellent performance and reliability. Perfect for work and productivity.'
    },
    {
      keywords: ['headphone', 'earphone', 'audio', 'music', 'sound', 'wireless', 'airpod', 'speaker', 'buds'],
      products: [16, 17, 18, 19],
      summary: 'These audio products offer exceptional sound quality and comfort. Great for music lovers and daily use.'
    },
    {
      keywords: ['tablet', 'ipad', 'student', 'portable', 'touch'],
      products: [13, 14, 15],
      summary: 'These tablets combine portability with powerful performance. Ideal for work, study, and entertainment.'
    },
    {
      keywords: ['cheap', 'affordable', 'budget', 'under', 'low', 'inexpensive', 'value'],
      products: [6, 12, 19, 4],
      summary: 'We found great value products that fit your budget without compromising on quality.'
    },
    {
      keywords: ['gaming', 'game', 'rog', 'performance', 'powerful', 'fast'],
      products: [11, 1, 7],
      summary: 'High-performance devices perfect for gaming and demanding tasks. These products deliver exceptional speed and power.'
    },
    {
      keywords: ['watch', 'smartwatch', 'fitness', 'tracker', 'wearable'],
      products: [22, 23],
      summary: 'Stay connected and track your fitness with these advanced smartwatches. Perfect for health-conscious users.'
    },
    {
      keywords: ['accessory', 'accessories', 'keyboard', 'mouse', 'charger', 'battery'],
      products: [20, 21, 24],
      summary: 'Essential accessories to enhance your tech experience. Quality products that complement your devices perfectly.'
    }
  ];
  
  for (const rule of fallbackRules) {
    if (rule.keywords.some(keyword => query.includes(keyword))) {
      return {
        recommendations: rule.products.map(id => ({
          productId: id,
          reason: 'This product matches your requirements perfectly and offers excellent value.'
        })),
        summary: rule.summary
      };
    }
  }
  
  const allElectronicsKeywords = fallbackRules.flatMap(rule => rule.keywords);
  const hasElectronicsKeyword = allElectronicsKeywords.some(keyword => query.includes(keyword));
  
  if (!hasElectronicsKeyword) {
    return {
      recommendations: [],
      summary: `I noticed you're looking for "${query}", but we're an electronics store specializing in smartphones, laptops, tablets, audio equipment, and tech accessories. However, if you're looking for something innovative and cutting-edge, check out our latest smartphones with vibrant displays, wireless earbuds for enjoying your favorite content on-the-go, or perhaps a tablet for all your digital needs! Let us help you find the perfect tech companion instead.`
    };
  }
  
  return {
    recommendations: [1, 7, 16, 13, 20].map(id => ({
      productId: id,
      reason: 'Highly recommended product with excellent customer reviews and reliable performance.'
    })),
    summary: 'We\'ve selected our best products across multiple categories for you. Each item represents great quality and value in its category.'
  };
};

export async function getProductRecommendations(userQuery, products) {
  if (!genAI) {
    console.warn('API not available, using fallback recommendations');
    return getFallbackRecommendations(userQuery, products);
  }

  try {
    const model = genAI.getGenerativeModel({ 
      model: 'gemini-2.5-flash',
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 1024,
      }
    });

    const productList = products.map(p => 
      `ID: ${p.id}, Name: ${p.name}, Category: ${p.category}, Price: $${p.price}, Description: ${p.description}`
    ).join('\n');

    const prompt = `You are a helpful product recommendation assistant for an electronics and tech gadgets store. A user is looking for products with the following preferences:

"${userQuery}"

Here is the available product catalog:
${productList}

IMPORTANT: Our store ONLY sells electronics and tech products (Smartphones, Laptops, Tablets, Audio equipment, and Accessories). We do NOT sell:
- Food items (fruits, vegetables, groceries, etc.)
- Clothing or fashion items
- Furniture
- Books or stationery
- Sports equipment
- Toys
- Home decor
- Beauty products
- Any non-electronics items

If the user asks for products outside our electronics catalog:
1. Set "recommendations" to an empty array []
2. In the "summary", politely inform them this is an electronics store
3. Suggest relevant electronics they might be interested in based on their query context
4. Be friendly and helpful in redirecting them to our electronics

Example: If someone asks for "orange", respond with:
{
  "recommendations": [],
  "summary": "I noticed you're looking for oranges, but we're an electronics store specializing in smartphones, laptops, tablets, audio equipment, and tech accessories. However, if you're looking for something fresh and innovative, check out our latest smartphones with vibrant displays, or perhaps wireless earbuds for enjoying your favorite podcasts while shopping for groceries!"
}

Based on the user's query, recommend the most suitable products. Return your response in the following JSON format:
{
  "recommendations": [
    {
      "productId": <number>,
      "reason": "<brief explanation why this product matches>"
    }
  ],
  "summary": "<brief summary of why these products were recommended, or explanation if out of scope>"
}

Rules:
- Recommend 3-5 products maximum (only if request is for electronics)
- If query is for non-electronics, return empty recommendations with helpful redirection message
- Consider price range, category, features mentioned in the query
- Only recommend products from the provided catalog
- Be specific about why each product matches the user's needs
- Be friendly and creative when redirecting non-electronics queries
- Return ONLY valid JSON, no additional text
- CRITICAL: Escape all quotes and special characters in the JSON strings properly
- Keep all text fields on a single line (no line breaks within strings)
- Use simple punctuation to avoid JSON parsing errors`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    let jsonText = text.trim();
    if (jsonText.startsWith('```json')) {
      jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
    } else if (jsonText.startsWith('```')) {
      jsonText = jsonText.replace(/```\n?/g, '');
    }
    
    jsonText = jsonText.trim();
    
    let recommendation;
    try {
      recommendation = JSON.parse(jsonText);
    } catch (parseError) {
      console.error('JSON Parse Error. Raw response:', text);
      console.error('Cleaned JSON:', jsonText);
      throw new Error('The AI returned an invalid response format. Please try again.');
    }
    
    const validRecommendations = recommendation.recommendations
      .filter(rec => products.some(p => p.id === rec.productId))
      .slice(0, 5);
    
    return {
      recommendations: validRecommendations,
      summary: recommendation.summary || 'Here are my recommendations based on your preferences.'
    };
  } catch (error) {
    console.error('API error, switching to fallback:', error.message);
    
    return getFallbackRecommendations(userQuery, products);
  }
}
