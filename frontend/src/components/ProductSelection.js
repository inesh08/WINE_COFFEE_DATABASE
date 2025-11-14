import React from 'react';
import './ProductSelection.css';

const ProductSelection = ({ onSelectWine, onSelectCoffee, onBack }) => {
  return (
    <div className="product-selection-page">
      <h1 className="page-title gold-accent">Select Your Preference</h1>
      
      <div className="product-options">
        <div className="product-option luxury-card" onClick={onSelectWine}>
          <div className="product-icon">🍷</div>
          <h2 className="gold-accent">WINE</h2>
          <p>Premium wines from renowned vineyards worldwide</p>
          <div className="decorative-line"></div>
          <button className="luxury-button" onClick={onSelectWine}>
            EXPLORE WINES
          </button>
        </div>

        <div className="product-option luxury-card" onClick={onSelectCoffee}>
          <div className="product-icon">☕</div>
          <h2 className="gold-accent">COFFEE</h2>
          <p>Artisanal coffees from exotic origins</p>
          <div className="decorative-line"></div>
          <button className="luxury-button" onClick={onSelectCoffee}>
            EXPLORE COFFEES
          </button>
        </div>
      </div>

      <button className="luxury-button-secondary" onClick={onBack}>
        BACK
      </button>
    </div>
  );
};

export default ProductSelection;

