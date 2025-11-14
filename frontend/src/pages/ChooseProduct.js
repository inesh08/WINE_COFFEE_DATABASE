import React from 'react';
import '../styles/ChooseProduct.css';

const ChooseProduct = ({ onSelectWine, onSelectCoffee, onBack }) => {
  return (
    <div className="choose-product-page">
      <h1 className="page-title gold-accent">SELECT CATEGORY</h1>
      
      <div className="product-cards">
        <div className="product-card wine-card" onClick={onSelectWine}>
          <div className="card-icon">🍷</div>
          <h2 className="gold-accent">WINE</h2>
          <p>Premium wines from renowned vineyards</p>
          <button className="luxury-button" onClick={onSelectWine}>
            EXPLORE WINES
          </button>
        </div>

        <div className="product-card coffee-card" onClick={onSelectCoffee}>
          <div className="card-icon">☕</div>
          <h2 className="gold-accent">COFFEE</h2>
          <p>Artisanal coffees from exotic origins</p>
          <button className="luxury-button" onClick={onSelectCoffee}>
            EXPLORE COFFEES
          </button>
        </div>
      </div>

      <button className="luxury-button-secondary" onClick={onBack}>
        ← BACK
      </button>
    </div>
  );
};

export default ChooseProduct;

