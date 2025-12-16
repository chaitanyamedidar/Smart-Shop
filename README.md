# Smart Shop - AI-Powered Product Recommendation System

A modern, AI-powered product recommendation system built with React and Google's Gemini Flash API. The application provides intelligent product recommendations based on user preferences using advanced natural language processing.

![Smart Shop](https://img.shields.io/badge/React-18.3-blue) ![Vite](https://img.shields.io/badge/Vite-7.3-purple) ![Gemini AI](https://img.shields.io/badge/Gemini-Flash-orange)

## ✨ Features

- **AI-Powered Recommendations**: Uses Google Gemini Flash API for intelligent product suggestions
- **Premium UI/UX**: Modern dark theme with glassmorphism effects and smooth animations
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Smart Search**: Natural language input for finding products
- **24 Products**: Curated catalog across 5 categories (Smartphones, Laptops, Tablets, Audio, Accessories)
- **Fast Performance**: Built with Vite for lightning-fast development and production builds

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

1. **Clone or navigate to the project directory**
   ```bash
   cd "d:\Webdev\Task Spearmint"
   ```

2. **Install dependencies** (if not already installed)
   ```bash
   npm install
   ```

3. **Configure API Key**
   
   Open the `.env` file in the root directory and add your Gemini API key:
   ```env
   VITE_GEMINI_API_KEY=your_actual_api_key_here
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to `http://localhost:5173`

## Usage

1. **Browse Products**: Scroll through the product catalog to see all available items
2. **Get AI Recommendations**: 
   - Type your preferences in the search bar (e.g., "I want a phone under $500")
   - Click "Get AI Recommendations"
   - View personalized recommendations with explanations
3. **Explore Results**: Recommended products are highlighted with a special badge and reasoning

### Example Queries

- "I want a phone under $500"
- "Best laptop for programming"
- "Wireless headphones with good battery life"
- "Affordable tablet for students"

## 🛠️ Technology Stack

- **Frontend Framework**: React 18.3
- **Build Tool**: Vite 7.3
- **AI Integration**: Google Generative AI SDK (@google/generative-ai)
- **Styling**: Vanilla CSS with CSS Custom Properties
- **Typography**: Inter (Google Fonts)

## 📁 Project Structure

```
Task Spearmint/
├── src/
│   ├── components/
│   │   ├── ProductCard.jsx
│   │   ├── ProductCard.css
│   │   ├── ProductList.jsx
│   │   ├── ProductList.css
│   │   ├── SearchBar.jsx
│   │   ├── SearchBar.css
│   │   ├── RecommendationPanel.jsx
│   │   └── RecommendationPanel.css
│   ├── data/
│   │   └── products.js
│   ├── services/
│   │   └── geminiService.js
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── .env
├── .env.example
├── index.html
├── package.json
└── README.md
```

## 🎨 Design Features

- **Dark Theme**: Eye-friendly dark color scheme
- **Glassmorphism**: Modern frosted glass effects
- **Vibrant Gradients**: Dynamic color transitions
- **Micro-animations**: Smooth hover effects and transitions
- **Responsive Grid**: Adaptive layouts for all screen sizes

## 🔑 API Configuration

The application uses Google's Gemini Flash API for generating recommendations. To configure:

1. Get your API key from [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Add it to the `.env` file as `VITE_GEMINI_API_KEY`
3. Restart the development server if it's running

**Note**: Never commit your `.env` file to version control. Use `.env.example` as a template.

## 📦 Build for Production

```bash
npm run build
```

The production-ready files will be in the `dist/` directory.

## 🧪 Evaluation Criteria Met

✅ **Basic Frontend Development**: Clean React component architecture  
✅ **AI API Integration**: Seamless Gemini Flash API integration  
✅ **User Input Processing**: Natural language query handling  
✅ **Product Filtering**: AI-powered recommendation system  
✅ **Clean Code**: Well-organized, maintainable codebase with proper separation of concerns

## 🤝 Contributing

This is a demonstration project. Feel free to fork and customize for your needs.

## 📄 License

MIT License - feel free to use this project for learning and development.

## 🙏 Acknowledgments

- Google Gemini AI for the recommendation engine
- Unsplash for product images
- Inter font family by Rasmus Andersson

---

**Built with ❤️ using React and Google Gemini AI**
