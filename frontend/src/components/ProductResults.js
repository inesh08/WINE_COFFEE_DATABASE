import React from 'react';
import './ProductResults.css';

const ProductResults = ({ category, onProductClick, onBack }) => {
  // Sample data for demonstration
  const sampleProducts = category === 'wine' ? [
    { id: 1, name: 'Château Margaux', price: 45000, type: 'red', region: 'Margaux', country: 'France' },
    { id: 2, name: 'Dom Pérignon Champagne', price: 25000, type: 'sparkling', region: 'Champagne', country: 'France' },
    { id: 3, name: 'Barolo', price: 12000, type: 'red', region: 'Piedmont', country: 'Italy' },
  ] : [
    { id: 1, name: 'Ethiopian Yirgacheffe', price: 2800, origin: 'Yirgacheffe', country: 'Ethiopia', roast_level: 'light' },
    { id: 2, name: 'Colombian Supremo', price: 2500, origin: 'Huila', country: 'Colombia', roast_level: 'medium' },
    { id: 3, name: 'Brazilian Santos', price: 2000, origin: 'Minas Gerais', country: 'Brazil', roast_level: 'medium-dark' },
  ];

  return (
    <div className="product-results-page">
      <h1 className="page-title gold-accent">
        {category === 'wine' ? 'Premium Wines' : 'Artisanal Coffees'}
      </h1>

      <div className="products-grid">
        {sampleProducts.map(product => (
          <div 
            key={product.id} 
            className="product-card"
            onClick={() => onProductClick(product)}
          >
            <h3 className="gold-accent">{product.name}</h3>
            {product.type && (
              <p className="product-info">Type: {product.type}</p>
            )}
            {product.roast_level && (
              <p className="product-info">Roast: {product.roast_level}</p>
            )}
            <p className="product-info">{product.region || product.origin}</p>
            <p className="product-info">{product.country}</p>
            <p className="product-price">₹{product.price.toLocaleString()}</p>
          </div>
        ))}
      </div>

      <button className="luxury-button-secondary" onClick={onBack}>
        BACK
      </button>
    </div>
  );
};

export default ProductResults;

