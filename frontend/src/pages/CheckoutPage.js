import React from 'react';
import '../styles/CheckoutPage.css';

const CheckoutPage = ({ cart, onComplete, onBack }) => {
  const total = cart.reduce((sum, item) => sum + parseFloat(item.price), 0);

  return (
    <div className="checkout-page">
      <h1 className="page-title gold-accent">CHECKOUT</h1>
      
      <div className="checkout-container luxury-card">
        <h2 className="section-title gold-accent">Your Order</h2>
        
        <div className="cart-items">
          {cart.map((item, index) => (
            <div key={index} className="cart-item luxury-card">
              <h3 className="gold-accent">{item.name}</h3>
              <p>₹{parseFloat(item.price).toLocaleString('en-IN')}</p>
            </div>
          ))}
        </div>

        <div className="total-section">
          <h2 className="gold-accent">Total: ₹{total.toLocaleString('en-IN')}</h2>
        </div>

        <div className="checkout-actions">
          <button className="luxury-button" onClick={onComplete}>
            COMPLETE ORDER
          </button>
          <button className="luxury-button-secondary" onClick={onBack}>
            ← BACK
          </button>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;

