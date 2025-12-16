import './ProductCard.css';

export default function ProductCard({ product, isRecommended, recommendationReason }) {
    return (
        <div className={`product-card ${isRecommended ? 'recommended' : ''}`}>
            {isRecommended && (
                <div className="recommendation-badge">
                    <span>AI Recommended</span>
                </div>
            )}

            <div className="product-image-container">
                <img
                    src={product.image}
                    alt={product.name}
                    className="product-image"
                    loading="lazy"
                />
                <div className="product-category-badge">{product.category}</div>
            </div>

            <div className="product-content">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-description">{product.description}</p>

                {product.specs && (
                    <div className="product-specs">
                        {product.specs.slice(0, 3).map((spec, index) => (
                            <span key={index} className="spec-tag">{spec}</span>
                        ))}
                    </div>
                )}

                {isRecommended && recommendationReason && (
                    <div className="recommendation-reason">
                        <strong>Why recommended:</strong> {recommendationReason}
                    </div>
                )}

                <div className="product-footer">
                    <div className="product-price">${product.price}</div>
                </div>
            </div>
        </div>
    );
}
