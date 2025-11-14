import React from 'react';
import './WelcomePage.css';

const WelcomePage = ({ onNext }) => {
  return (
    <div className="welcome-page">
      <div className="welcome-header">
        <div className="decorative-bird-top"></div>
        <h1 className="welcome-title">Velsthe Wilicalre Decellll Crin</h1>
        <h2 className="welcome-subtitle">CHUYE Seaner boner Goods</h2>
        <div className="decorative-bird-bottom"></div>
      </div>
      
      <div className="welcome-content">
        <p className="welcome-description">
          Discover the finest selection of premium wines and artisanal coffees from around the world. 
          Our curated collection represents the pinnacle of taste and excellence.
        </p>
        
        <div className="welcome-features">
          <div className="feature-item">
            <div className="feature-icon">🍷</div>
            <h3>Premium Wines</h3>
            <p>From Bordeaux to Napa Valley</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">☕</div>
            <h3>Artisanal Coffee</h3>
            <p>Sourced from world's finest regions</p>
          </div>
          <div className="feature-item">
            <div className="feature-icon">✨</div>
            <h3>Luxury Experience</h3>
            <p>Excellence in every detail</p>
          </div>
        </div>

        <button className="welcome-button" onClick={onNext}>
          ENTER
        </button>
      </div>

      <div className="welcome-footer">
        <div className="footer-line"></div>
        <div className="footer-ornament"></div>
      </div>
    </div>
  );
};

export default WelcomePage;

