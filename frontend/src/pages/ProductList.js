import React from 'react';
import '../styles/ProductList.css';

const ProductList = ({ products, category, onProductClick, onBack }) => {
  const handleProductClick = (product) => {
    onProductClick(product);
  };

  return (
    <div className="product-list-page">
      <h1 className="page-title gold-accent">
        {category === 'wine' ? '🍷 WINE RESULTS' : '☕ COFFEE RESULTS'}
      </h1>

      <div className="products-grid">
        {products.map(product => (
          <div 
            key={product.id} 
            className="product-item luxury-card"
            onClick={() => handleProductClick(product)}
          >
            <h3 className="gold-accent">{product.name}</h3>
            
            {category === 'wine' && (
              <>
                <p className="product-info">Type: {product.type}</p>
                <p className="product-info">Region: {product.region}</p>
                <p className="product-info">Country: {product.country}</p>
                {product.vintage && <p className="product-info">Vintage: {product.vintage}</p>}
                {product.alcohol_content && <p className="product-info">Alcohol: {product.alcohol_content}%</p>}
                {product.acidity_level && <p className="product-info">Acidity: {product.acidity_level}</p>}
                {product.sweetness_level && <p className="product-info">Sweetness: {product.sweetness_level}</p>}
              </>
            )}
            
            {category === 'coffee' && (
              <>
                <p className="product-info">Type: {product.type}</p>
                <p className="product-info">Origin: {product.origin}</p>
                <p className="product-info">Country: {product.country}</p>
                {product.roast_level && <p className="product-info">Roast: {product.roast_level}</p>}
                {product.acidity_level && <p className="product-info">Acidity: {product.acidity_level}</p>}
              </>
            )}
            
            <p className="product-price gold-accent">₹{parseFloat(product.price).toLocaleString('en-IN')}</p>
            
            <button className="luxury-button" onClick={() => handleProductClick(product)}>
              VIEW DETAILS
            </button>
          </div>
        ))}
      </div>

      <button className="luxury-button-secondary" onClick={onBack}>
        ← BACK
      </button>
    </div>
  );
};

export default ProductList;

