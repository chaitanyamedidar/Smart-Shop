import { useState } from 'react';
import './SearchBar.css';
import searchProductIcon from '../assets/search-product.png';

export default function SearchBar({ onSearch, isLoading }) {
    const [query, setQuery] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        if (query.trim()) {
            onSearch(query);
        }
    };

    const exampleQueries = [
        "I want a phone under $500",
        "Best laptop for programming",
        "Wireless headphones with good battery life",
        "Affordable tablet for students"
    ];

    const handleExampleClick = (example) => {
        setQuery(example);
    };

    return (
        <div className="search-container">
            <form onSubmit={handleSubmit} className="search-form">
                <div className="search-input-wrapper">
                    <img src={searchProductIcon} alt="Search" className="search-icon" />
                    <input
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Describe what you're looking for..."
                        className="search-input"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        className="btn-primary search-button"
                        disabled={isLoading || !query.trim()}
                    >
                        {isLoading ? (
                            <>
                                <span className="spinner-small"></span>
                                Searching...
                            </>
                        ) : (
                            <>
                                Get AI Recommendations
                            </>
                        )}
                    </button>
                </div>
            </form>

            <div className="example-queries">
                <span className="example-label">Try:</span>
                {exampleQueries.map((example, index) => (
                    <button
                        key={index}
                        onClick={() => handleExampleClick(example)}
                        className="example-chip"
                        disabled={isLoading}
                    >
                        {example}
                    </button>
                ))}
            </div>
        </div>
    );
}
