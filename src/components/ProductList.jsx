import ProductCard from './ProductCard';
import './ProductList.css';

export default function ProductList({ products, recommendedProducts }) {
    const recommendedIds = new Set(recommendedProducts.map(r => r.productId));
    const recommendationMap = new Map(
        recommendedProducts.map(r => [r.productId, r.reason])
    );

    if (products.length === 0) {
        return (
            <div className="empty-state">
                <div className="empty-icon">📦</div>
                <h3>No products found</h3>
                <p>Try adjusting your search criteria</p>
            </div>
        );
    }

    return (
        <div className="product-list">
            {products.map(product => (
                <ProductCard
                    key={product.id}
                    product={product}
                    isRecommended={recommendedIds.has(product.id)}
                    recommendationReason={recommendationMap.get(product.id)}
                />
            ))}
        </div>
    );
}
