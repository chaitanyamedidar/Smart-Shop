import { useState } from 'react';
import SearchBar from './components/SearchBar';
import ProductList from './components/ProductList';
import RecommendationPanel from './components/RecommendationPanel';
import { products } from './data/products';
import { getProductRecommendations } from './services/geminiService';
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [summary, setSummary] = useState('');

  const handleSearch = async (query) => {
    setIsLoading(true);
    setError(null);

    try {
      const result = await getProductRecommendations(query, products);
      setRecommendations(result.recommendations);
      setSummary(result.summary);

      setTimeout(() => {
        const productList = document.querySelector('.product-list');
        if (productList) {
          productList.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } catch (err) {
      setError(err.message);
      setRecommendations([]);
      setSummary('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearRecommendations = () => {
    setRecommendations([]);
    setSummary('');
    setError(null);
  };

  const displayProducts = recommendations.length > 0 
    ? products.filter(p => recommendations.some(r => r.productId === p.id))
    : products;

  const showingRecommendations = recommendations.length > 0;
  const showingMessage = summary && recommendations.length === 0 && !isLoading && !error;

  return (
    <div className="app">
      <header className="app-header">
        <div className="container">
          <div className="header-content">
            <div className="logo-section">
              <span className="logo-icon">🛍️</span>
              <h1>Smart Shop</h1>
            </div>
            <p className="tagline">
              AI-Powered Product Recommendations • Find Your Perfect Match
            </p>
          </div>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          {!showingRecommendations && !showingMessage && (
            <section className="search-section">
              <SearchBar onSearch={handleSearch} isLoading={isLoading} />
            </section>
          )}

          {(isLoading || error || recommendations.length > 0 || showingMessage) && (
            <section className="recommendation-section">
              <RecommendationPanel
                recommendations={recommendations}
                summary={summary}
                isLoading={isLoading}
                error={error}
                onClear={handleClearRecommendations}
              />
            </section>
          )}

          {showingRecommendations && (
            <section className="products-section">
              <div className="section-header">
                <h2>Your Personalized Recommendations</h2>
                <p className="product-count">{displayProducts.length} products found</p>
              </div>
              <ProductList
                products={displayProducts}
                recommendedProducts={recommendations}
              />
            </section>
          )}

          {!showingRecommendations && !showingMessage && !isLoading && !error && (
            <section className="products-section">
              <div className="section-header">
                <h2>Browse Our Collection</h2>
                <p className="product-count">{products.length} products available</p>
              </div>
              <ProductList
                products={displayProducts}
                recommendedProducts={[]}
              />
            </section>
          )}
        </div>
      </main>

      <footer className="app-footer">
        <div className="container">
          <p>Powered by Google Gemini AI • Built with React</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
