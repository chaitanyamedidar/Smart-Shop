import './RecommendationPanel.css';

export default function RecommendationPanel({
    recommendations,
    summary,
    isLoading,
    error,
    onClear
}) {
    if (isLoading) {
        return (
            <div className="recommendation-panel loading">
                <div className="loading-content">
                    <div className="spinner"></div>
                    <h3>AI is analyzing your preferences...</h3>
                    <p>Finding the perfect products for you</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="recommendation-panel error">
                <div className="error-content">
                    <span className="error-icon">⚠️</span>
                    <h3>Oops! Something went wrong</h3>
                    <p>{error}</p>
                    <button onClick={onClear} className="btn-primary">
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (!recommendations || (recommendations.length === 0 && !summary)) {
        return null;
    }

    if (recommendations.length === 0 && summary) {
        return (
            <div className="recommendation-panel info fade-in">
                <div className="message-content">
                    <h2>Let's Find You Something Great!</h2>
                    <p className="summary-message">{summary}</p>
                    <button onClick={onClear} className="btn-primary btn-browse">
                        Browse Our Electronics
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="recommendation-panel success fade-in">
            <div className="panel-header-compact">
                <div className="header-top">
                    <span className="ai-badge">AI Recommendations</span>
                    <button onClick={onClear} className="btn-secondary btn-back">
                        ← Back to All Products
                    </button>
                </div>
                <h2>We Found {recommendations.length} Perfect {recommendations.length === 1 ? 'Match' : 'Matches'} For You</h2>
                <p className="summary">{summary}</p>
            </div>
        </div>
    );
}
