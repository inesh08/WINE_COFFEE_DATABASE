import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import '../styles/Layout.css';

const Layout = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCartCount(cart.length);
    
    const interval = setInterval(() => {
      const updatedCart = JSON.parse(localStorage.getItem('cart') || '[]');
      setCartCount(updatedCart.length);
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const isHomePage = location.pathname === '/';

  return (
    <div className="app">
      {!isHomePage && cartCount > 0 && (
        <Link to="/checkout" className="cart-indicator">
          🛒 Cart ({cartCount})
        </Link>
      )}
      {children}
    </div>
  );
};

export default Layout;

