import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

if (!API_KEY || API_KEY === 'your_api_key_here') {
  console.warn('⚠️ AI service not configured. Running in limited mode.');
}

const genAI = API_KEY && API_KEY !== 'your_api_key_here' 
  ? new GoogleGenerativeAI(API_KEY)
  : null;

export async function getProductRecommendations(userQuery, products) {
  if (!genAI) {
    throw new Error('Our AI recommendation service is currently unavailable. Please try browsing our products manually or check back soon!');
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
    console.error('Error getting recommendations:', error);
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    
    if (error.message?.includes('API key') || error.message?.includes('API_KEY') || error.message?.includes('API_KEY_INVALID')) {
      throw new Error('We are experiencing technical difficulties. Please try again later or contact support if the issue persists.');
    }
    
    if (error.message?.includes('model') || error.message?.includes('not found') || error.message?.includes('models/') || error.message?.includes('404')) {
      throw new Error('Our recommendation service is temporarily unavailable. We apologize for the inconvenience. Please try again in a few moments.');
    }
    
    if (error.message?.includes('quota') || error.message?.includes('RESOURCE_EXHAUSTED') || error.message?.includes('rate limit')) {
      throw new Error('We are experiencing high traffic at the moment. Please try again in a few minutes. Thank you for your patience!');
    }
    
    if (error.message?.includes('JSON') || error.message?.includes('parse')) {
      throw new Error('We encountered an issue processing your request. Please try rephrasing your search or try again later.');
    }
    
    throw new Error('Something went wrong on our end. We are working to fix this. Please try again shortly.');
  }
}
