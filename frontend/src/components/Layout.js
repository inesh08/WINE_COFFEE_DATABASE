import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getCartStorageKey } from '../utils/storage';
import { getCurrentActiveUser } from '../App';
import '../styles/Layout.css';

const Layout = ({ children }) => {
  const [cartCount, setCartCount] = useState(0);
  const location = useLocation();

  useEffect(() => {
    const updateCartCount = () => {
      const activeUser = getCurrentActiveUser();
      const key = getCartStorageKey(activeUser);
      const cart = JSON.parse(localStorage.getItem(key) || '[]');
      const count = cart.reduce((total, item) => total + (item.quantity || 1), 0);
      setCartCount(count);
    };

    updateCartCount();
    const interval = setInterval(updateCartCount, 800);
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

