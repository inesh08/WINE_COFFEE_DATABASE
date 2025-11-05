import React from 'react';
import '../styles/ProductDetail.css';

const ProductDetail = ({ product, category, onAddToCart, onReserve, onBack, onGoToCart }) => {
  return (
    <div className="product-detail-page">
      <div className="detail-container luxury-card">
        <h1 className="page-title gold-accent">{product.name}</h1>
        
        <div className="product-details">
          {category === 'wine' && (
            <div className="detail-grid">
              <div className="detail-item">
                <span className="label">Type:</span>
                <span className="value">{product.type}</span>
              </div>
              <div className="detail-item">
                <span className="label">Region:</span>
                <span className="value">{product.region}</span>
              </div>
              <div className="detail-item">
                <span className="label">Country:</span>
                <span className="value">{product.country}</span>
              </div>
              {product.vintage && (
                <div className="detail-item">
                  <span className="label">Vintage:</span>
                  <span className="value">{product.vintage}</span>
                </div>
              )}
              {product.alcohol_content && (
                <div className="detail-item">
                  <span className="label">Alcohol Content:</span>
                  <span className="value">{product.alcohol_content}%</span>
                </div>
              )}
              {product.acidity_level && (
                <div className="detail-item">
                  <span className="label">Acidity:</span>
                  <span className="value">{product.acidity_level}</span>
                </div>
              )}
              {product.sweetness_level && (
                <div className="detail-item">
                  <span className="label">Sweetness:</span>
                  <span className="value">{product.sweetness_level}</span>
                </div>
              )}
            </div>
          )}

          {category === 'coffee' && (
            <div className="detail-grid">
              <div className="detail-item">
                <span className="label">Type:</span>
                <span className="value">{product.type}</span>
              </div>
              <div className="detail-item">
                <span className="label">Origin:</span>
                <span className="value">{product.origin}</span>
              </div>
              <div className="detail-item">
                <span className="label">Country:</span>
                <span className="value">{product.country}</span>
              </div>
              {product.roast_level && (
                <div className="detail-item">
                  <span className="label">Roast Level:</span>
                  <span className="value">{product.roast_level}</span>
                </div>
              )}
              {product.acidity_level && (
                <div className="detail-item">
                  <span className="label">Acidity:</span>
                  <span className="value">{product.acidity_level}</span>
                </div>
              )}
            </div>
          )}

          <div className="price-section">
            <h2 className="gold-accent">Price: ₹{parseFloat(product.price).toLocaleString('en-IN')}</h2>
          </div>

          <div className="action-buttons">
            <button className="luxury-button" onClick={() => {
              onAddToCart(product);
              if (onGoToCart) onGoToCart();
            }}>
              ADD TO CART
            </button>
            <button className="luxury-button-secondary" onClick={() => onReserve(product)}>
              RESERVE
            </button>
            <button className="luxury-button-secondary" onClick={onBack}>
              ← BACK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;

