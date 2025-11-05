import React from 'react';

const Checkout = ({ cart, onBack, onComplete }) => {
  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="checkout-page luxury-card">
      <h1 className="page-title gold-accent">Checkout</h1>
      
      <div className="cart-items">
        <h2 className="gold-accent">Your Order</h2>
        {cart.map((item, index) => (
          <div key={index} className="cart-item">
            <h3>{item.name}</h3>
            <p>₹{item.price.toLocaleString()}</p>
          </div>
        ))}
      </div>

      <div className="checkout-total">
        <h2 className="gold-accent">Total: ₹{total.toLocaleString()}</h2>
      </div>

      <div className="checkout-actions">
        <button className="luxury-button" onClick={onComplete}>
          COMPLETE ORDER
        </button>
        <button className="luxury-button-secondary" onClick={onBack}>
          BACK
        </button>
      </div>
    </div>
  );
};

export default Checkout;

