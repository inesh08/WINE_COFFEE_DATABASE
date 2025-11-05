import React from 'react';

const ProductDetails = ({ product, onAddToCart, onReserve, onBack }) => {
  return (
    <div className="product-details-page luxury-card">
      <h1 className="page-title gold-accent">{product.name}</h1>
      
      <div className="product-detail-info">
        {product.type && <p><strong>Type:</strong> {product.type}</p>}
        {product.region && <p><strong>Region:</strong> {product.region}</p>}
        {product.origin && <p><strong>Origin:</strong> {product.origin}</p>}
        {product.country && <p><strong>Country:</strong> {product.country}</p>}
        {product.roast_level && <p><strong>Roast Level:</strong> {product.roast_level}</p>}
        <p className="product-price"><strong>Price:</strong> ₹{product.price.toLocaleString()}</p>
      </div>

      <div className="product-actions">
        <button className="luxury-button" onClick={onAddToCart}>
          ADD TO CART
        </button>
        <button className="luxury-button" onClick={onReserve}>
          RESERVE
        </button>
        <button className="luxury-button-secondary" onClick={onBack}>
          BACK
        </button>
      </div>
    </div>
  );
};

export default ProductDetails;

