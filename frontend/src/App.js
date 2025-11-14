import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, Link } from 'react-router-dom';
import './App.css';
import PaymentPage from './pages/PaymentPage';
import { wineAPI, coffeeAPI, demoAPI, pairingAPI, userAPI, orderAPI } from './services/api';
import {
  getActiveUserFromStorage,
  saveActiveUserToStorage,
  clearActiveUserFromStorage,
  getCartStorageKey,
  getLastOrderStorageKey,
  saveToStorage,
  loadFromStorage,
  removeFromStorage,
} from './utils/storage';

const ACCENT_TEXT = '#ffcf4d';

let currentActiveUser = null;

export const getCurrentActiveUser = () => currentActiveUser || getActiveUserFromStorage();

const DEFAULT_CHECKOUT_FORM = {
  fullName: '',
  phone: '',
  addressLine1: '',
  addressLine2: '',
  city: '',
  state: '',
  postalCode: '',
  country: 'India',
  deliveryInstructions: '',
  saveDetails: true,
};

const mapProfileToCheckoutForm = (profile = {}) => ({
  fullName: profile.full_name || profile.fullName || '',
  phone: profile.phone || '',
  addressLine1: profile.address_line1 || profile.addressLine1 || '',
  addressLine2: profile.address_line2 || profile.addressLine2 || '',
  city: profile.city || '',
  state: profile.state || '',
  postalCode: profile.postal_code || profile.postalCode || '',
  country: profile.country || 'India',
  deliveryInstructions: profile.delivery_instructions || profile.deliveryInstructions || '',
  saveDetails: true,
});

const WineCoffeeIcon = ({ size = 32, spacing = 8 }) => (
  <span style={{ display: 'inline-flex', alignItems: 'center', gap: `${spacing}px` }}>
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="wineGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#b90e32" />
          <stop offset="100%" stopColor="#5f0212" />
        </linearGradient>
        <linearGradient id="glassGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#f9f9ff" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#d0d6e6" stopOpacity="0.8" />
        </linearGradient>
      </defs>
      <path
        d="M24 4h16v6c0 6.6-5.4 12-12 12S16 16.6 16 10V4h8z"
        fill="url(#glassGradient)"
      />
      <path
        d="M20 10c0 4.4 3.6 8 8 8s8-3.6 8-8H20z"
        fill="url(#wineGradient)"
      />
      <path d="M28 22h4v16h-4z" fill="#e4e6ef" />
      <path d="M20 42h16c1.1 0 2 .9 2 2s-.9 2-2 2h-6v10h4c1.1 0 2 .9 2 2s-.9 2-2 2h-12c-1.1 0-2-.9-2-2s.9-2 2-2h4v-10h-6c-1.1 0-2-.9-2-2s.9-2 2-2z" fill="#d0d6e6" />
    </svg>
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <linearGradient id="coffeeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#c68642" />
          <stop offset="100%" stopColor="#6f4e37" />
        </linearGradient>
        <linearGradient id="steamGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
          <stop offset="100%" stopColor="#d9e2ec" stopOpacity="0.35" />
        </linearGradient>
      </defs>
      <path
        d="M8 20h32c4.4 0 8 3.6 8 8v6c0 6.6-5.4 12-12 12H24c-6.6 0-12-5.4-12-12V20z"
        fill="url(#coffeeGradient)"
      />
      <path
        d="M48 26c4.4 0 8 3.6 8 8s-3.6 8-8 8v-4c2.2 0 4-1.8 4-4s-1.8-4-4-4v-4z"
        fill="#9d6f4b"
      />
      <path
        d="M8 44h36c-1.7 6.9-8.1 12-15.6 12h-4.8C16.1 56 9.7 50.9 8 44z"
        fill="#f7f1e3"
      />
      <path
        d="M24 12c0-4 3-6 3-9 0-1.7-1.3-3-3-3"
        stroke="url(#steamGradient)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M34 12c0-4 3-6 3-9 0-1.7-1.3-3-3-3"
        stroke="url(#steamGradient)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  </span>
);

export const NavigationBar = ({ currentUser, onLogout }) => {
  const navigate = useNavigate();
  const isAdmin = currentUser?.role === 'admin';
  const linkStyle = {
    color: '#f0ead6',
    textDecoration: 'none',
    fontWeight: 600,
    padding: '0.35rem 0.75rem',
    borderRadius: '6px',
    transition: 'background 0.2s ease, color 0.2s ease'
  };
  const renderLink = (to, label) => (
    <Link to={to} style={linkStyle}>
      {label}
    </Link>
  );

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      backdropFilter: 'blur(8px)',
      background: 'rgba(12, 12, 12, 0.85)',
      borderBottom: '1px solid rgba(212, 175, 55, 0.3)',
      padding: '0.75rem 1.5rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '1rem'
    }}>
      <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
        <WineCoffeeIcon size={30} spacing={6} />
        <div>
          <h1 style={{margin: 0, fontSize: '1.4rem'}} className="gold-accent">Wine & Coffee Studio</h1>
          <small style={{color: '#f0ead6', fontStyle: 'italic'}}>
            {isAdmin ? 'Admin Control Center' : 'Curated pairings for every moment'}
          </small>
        </div>
      </div>

      <nav style={{display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap'}}>
        {isAdmin ? (
          <>
            {renderLink('/admin', 'Dashboard')}
            {renderLink('/admin/wines', 'Manage Wines')}
            {renderLink('/admin/coffees', 'Manage Coffees')}
            {renderLink('/admin/orders', 'Orders')}
            {renderLink('/demo', 'DB Insights')}
          </>
        ) : (
          <>
            {renderLink('/experience', 'Home')}
            {renderLink('/choose', 'Explore')}
            {renderLink('/checkout', 'Cart')}
            {renderLink('/rate', 'Rate Orders')}
          </>
        )}
      </nav>

      <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap'}}>
        <div style={{textAlign: 'right'}}>
          <p style={{margin: 0, color: ACCENT_TEXT, fontWeight: 600}}>
            {currentUser?.username}
            {currentUser?.id ? ` • ID ${currentUser.id}` : ''}
          </p>
          <small style={{color: '#f0ead6', textTransform: 'capitalize'}}>
            {currentUser?.role || 'guest'}
          </small>
        </div>
        <button
          className="luxury-button-secondary"
          style={{padding: '0.4rem 1rem'}}
          onClick={() => {
            onLogout?.();
            navigate('/login', { replace: true });
          }}
        >
          Log out
        </button>
      </div>
    </header>
  );
};

const PageWrapper = ({ children }) => {
  const navigate = useNavigate();
  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const floatingButtonStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(12,12,12,0.8)',
    color: ACCENT_TEXT,
    	border: '1px solid rgba(212,175,55,0.6)',
    borderRadius: '999px',
    width: '3rem',
    height: '3rem',
    fontSize: '1.3rem',
    fontWeight: 600,
    boxShadow: '0 10px 25px rgba(0,0,0,0.35)',
    textDecoration: 'none'
  };

  return (
    <div style={{position: 'relative', minHeight: '100vh'}}>
      <button
        type="button"
        onClick={handleBack}
        style={{
          ...floatingButtonStyle,
          position: 'fixed',
          top: '1.25rem',
          left: '1.25rem',
          zIndex: 100,
          cursor: 'pointer',
          border: '1px solid rgba(212,175,55,0.6)'
        }}
        aria-label="Go back"
      >
        ←
      </button>
      <div style={{position: 'fixed', top: '1.25rem', right: '1.25rem', zIndex: 100, display: 'flex', flexDirection: 'column', gap: '0.6rem'}}>
        <Link
          to="/checkout"
          style={floatingButtonStyle}
          aria-label="Open cart"
        >
          🛒
        </Link>
        <Link
          to="/profile"
          style={floatingButtonStyle}
          aria-label="Open profile"
        >
          👤
        </Link>
      </div>
      <div style={{paddingTop: '0'}}>
        {children}
      </div>
    </div>
  );
};

const LoginPage = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await userAPI.login(formData);
      const user = data.user;
      saveActiveUserToStorage(user);
      currentActiveUser = user;
      onLogin?.(user);
      const target = user.role === 'admin' ? '/admin' : '/experience';
      navigate(target, { replace: true });
    } catch (err) {
      setError(err.message || 'Unable to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      background: 'radial-gradient(circle at top, rgba(212,175,55,0.2), #0b0b0b 65%)'
    }}>
      <div className="luxury-card" style={{width: '100%', maxWidth: '440px', padding: '2.5rem'}}>
        <h1 className="gold-accent" style={{textAlign: 'center', marginBottom: '0.5rem'}}>Welcome Back</h1>
        <p style={{color: '#f0ead6', textAlign: 'center', marginBottom: '2rem'}}>
          Sign in to continue exploring curated wines & coffees.
        </p>
        <form onSubmit={handleSubmit} style={{display: 'grid', gap: '1rem'}}>
          <div>
            <label className="gold-accent" style={{display: 'block', marginBottom: '0.5rem'}}>Username</label>
            <input
              className="luxury-input"
              value={formData.username}
              onChange={(e) => handleChange('username', e.target.value)}
              placeholder="Enter username"
              required
            />
          </div>
          <div>
            <label className="gold-accent" style={{display: 'block', marginBottom: '0.5rem'}}>Password</label>
            <input
              type="password"
              className="luxury-input"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>
          {error && (
            <div style={{backgroundColor: 'rgba(220,53,69,0.15)', border: '1px solid rgba(220,53,69,0.5)', color: '#ff6b6b', padding: '0.75rem', borderRadius: '6px'}}>
              {error}
            </div>
          )}
          <button
            type="submit"
            className="luxury-button"
            style={{padding: '0.9rem 1.5rem', fontSize: '1.1rem'}}
            disabled={loading}
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>
        <p style={{color: '#f0ead6', marginTop: '1.5rem', textAlign: 'center'}}>
          First time here?{' '}
          <button
            onClick={() => navigate('/signup')}
            style={{background: 'none', border: 'none', color: ACCENT_TEXT, cursor: 'pointer', fontWeight: 600}}
          >
            Create an account
          </button>
        </p>
        <p style={{color: '#8f8f8f', fontSize: '0.85rem', textAlign: 'center', marginTop: '0.5rem'}}>
          Admin user? <Link to="/admin-login" style={{color: ACCENT_TEXT}}>Use the admin portal</Link>
        </p>
      </div>
    </div>
  );
};

const AdminLoginPage = ({ onLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (formData.username === 'admin' && formData.password === '1234') {
        const user = { id: 'admin-local', username: 'admin', role: 'admin' };
        saveActiveUserToStorage(user);
        currentActiveUser = user;
        onLogin?.(user);
        navigate('/admin', { replace: true });
        return;
      }
      const data = await userAPI.login(formData);
      const user = data.user;
      if (user.role !== 'admin') {
        setError('This portal is for admin accounts only.');
        setLoading(false);
        return;
      }
      saveActiveUserToStorage(user);
      currentActiveUser = user;
      onLogin?.(user);
      navigate('/admin', { replace: true });
    } catch (err) {
      setError(err.message || 'Unable to login. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      background: 'radial-gradient(circle at top, rgba(169, 112, 255, 0.25), #060606 65%)'
    }}>
      <div className="luxury-card" style={{width: '100%', maxWidth: '440px', padding: '2.5rem'}}>
        <h1 className="gold-accent" style={{textAlign: 'center', marginBottom: '0.5rem'}}>Admin Access</h1>
        <p style={{color: '#f0ead6', textAlign: 'center', marginBottom: '2rem'}}>
          Sign in with administrative credentials to manage inventory and orders.
        </p>
        <form onSubmit={handleSubmit} style={{display: 'grid', gap: '1rem'}}>
          <div>
            <label className="gold-accent" style={{display: 'block', marginBottom: '0.5rem'}}>Admin Username</label>
            <input
              className="luxury-input"
              value={formData.username}
              onChange={(e) => handleChange('username', e.target.value)}
              placeholder="Enter admin username"
              required
            />
          </div>
          <div>
            <label className="gold-accent" style={{display: 'block', marginBottom: '0.5rem'}}>Password</label>
            <input
              type="password"
              className="luxury-input"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              placeholder="Enter password"
              required
            />
          </div>
          {error && (
            <div style={{backgroundColor: 'rgba(220,53,69,0.15)', border: '1px solid rgba(220,53,69,0.5)', color: '#ff6b6b', padding: '0.75rem', borderRadius: '6px'}}>
              {error}
            </div>
          )}
          <button
            type="submit"
            className="luxury-button"
            style={{padding: '0.9rem 1.5rem', fontSize: '1.1rem'}}
            disabled={loading}
          >
            {loading ? 'Authenticating…' : 'Admin Sign In'}
          </button>
        </form>
        <p style={{color: '#f0ead6', marginTop: '1.5rem', textAlign: 'center'}}>
          Not an admin?{' '}
          <button
            onClick={() => navigate('/login')}
            style={{background: 'none', border: 'none', color: ACCENT_TEXT, cursor: 'pointer', fontWeight: 600}}
          >
            Return to member login
          </button>
        </p>
      </div>
    </div>
  );
};

const SignupPage = ({ onSignup }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await userAPI.register(formData);
      const user = data.user;
      saveActiveUserToStorage(user);
      onSignup?.(user);
      navigate('/experience', { replace: true });
    } catch (err) {
      setError(err.message || 'Unable to create account. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      background: 'radial-gradient(circle at top, rgba(212,175,55,0.25), #060606 65%)'
    }}>
      <div className="luxury-card" style={{width: '100%', maxWidth: '500px', padding: '2.5rem'}}>
        <h1 className="gold-accent" style={{textAlign: 'center', marginBottom: '0.5rem'}}>Create Your Account</h1>
        <p style={{color: '#f0ead6', textAlign: 'center', marginBottom: '2rem'}}>
          Join our tasting room for personalised pairings and order tracking.
        </p>
        <form onSubmit={handleSubmit} style={{display: 'grid', gap: '1rem'}}>
          <div>
            <label className="gold-accent" style={{display: 'block', marginBottom: '0.5rem'}}>Username</label>
            <input
              className="luxury-input"
              value={formData.username}
              onChange={(e) => handleChange('username', e.target.value)}
              placeholder="Pick a username"
              required
            />
          </div>
          <div>
            <label className="gold-accent" style={{display: 'block', marginBottom: '0.5rem'}}>Email</label>
            <input
              type="email"
              className="luxury-input"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          <div>
            <label className="gold-accent" style={{display: 'block', marginBottom: '0.5rem'}}>Password</label>
            <input
              type="password"
              className="luxury-input"
              value={formData.password}
              onChange={(e) => handleChange('password', e.target.value)}
              placeholder="At least 6 characters"
              minLength={6}
              required
            />
          </div>
          {error && (
            <div style={{backgroundColor: 'rgba(220,53,69,0.15)', border: '1px solid rgba(220,53,69,0.5)', color: '#ff6b6b', padding: '0.75rem', borderRadius: '6px'}}>
              {error}
            </div>
          )}
          <button
            type="submit"
            className="luxury-button"
            style={{padding: '0.9rem 1.5rem', fontSize: '1.1rem'}}
            disabled={loading}
          >
            {loading ? 'Creating account…' : 'Sign Up'}
          </button>
        </form>
        <p style={{color: '#f0ead6', marginTop: '1.5rem', textAlign: 'center'}}>
          Already have an account?{' '}
          <button
            onClick={() => navigate('/login')}
            style={{background: 'none', border: 'none', color: ACCENT_TEXT, cursor: 'pointer', fontWeight: 600}}
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

const AuthLandingPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      background: 'radial-gradient(circle at top, rgba(212,175,55,0.2), #0b0b0b 65%)'
    }}>
      <div className="luxury-card" style={{width: '100%', maxWidth: '560px', padding: '2.5rem', textAlign: 'center'}}>
        <h1 className="gold-accent" style={{marginBottom: '0.75rem'}}>Step Into The Lounge</h1>
        <p style={{color: '#f0ead6', marginBottom: '2rem'}}>
          Choose how you would like to begin your tasting journey.
        </p>
        <div style={{display: 'grid', gap: '1rem'}}>
          <button
            className="luxury-button"
            style={{padding: '0.9rem 1.5rem', fontSize: '1.05rem'}}
            onClick={() => navigate('/login')}
          >
            Member Login
          </button>
          <button
            className="luxury-button-secondary"
            style={{padding: '0.9rem 1.5rem', fontSize: '1.05rem'}}
            onClick={() => navigate('/signup')}
          >
            Create An Account
          </button>
          <div style={{marginTop: '1.5rem'}}>
            <p style={{color: '#8f8f8f', marginBottom: '0.75rem'}}>Team member?</p>
            <button
              className="luxury-button"
              style={{padding: '0.85rem 1.5rem', fontSize: '1rem', background: 'linear-gradient(135deg, rgba(169, 112, 255, 0.5), rgba(94, 51, 160, 0.9))', border: '1px solid rgba(169,112,255,0.4)'}}
              onClick={() => navigate('/admin-login')}
            >
              Admin Portal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard = ({ currentUser }) => {
  const navigate = useNavigate();
  const isAdmin = currentUser?.role === 'admin';

  const actionCardStyle = (gradient) => ({
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem',
    padding: '1.25rem 1.5rem',
    borderRadius: '12px',
    textDecoration: 'none',
    background: gradient,
    color: '#f0ead6',
    border: '1px solid rgba(240,234,214,0.2)',
    boxShadow: '0 12px 30px rgba(0,0,0,0.35)',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease'
  });

  if (!isAdmin) {
    return (
      <div style={{padding: '2rem', maxWidth: '900px', margin: '0 auto'}}>
        <div className="luxury-card" style={{padding: '2rem', textAlign: 'center'}}>
          <h2 className="gold-accent">Access Restricted</h2>
          <p style={{color: '#f0ead6'}}>This area is reserved for administrators.</p>
          <button className="luxury-button" onClick={() => navigate('/experience')}>
            Go to customer experience
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{padding: '2rem', maxWidth: '900px', margin: '0 auto'}}>
      <h1 className="gold-accent" style={{fontSize: '2.4rem', marginBottom: '1rem'}}>Admin Hub</h1>
      <p style={{color: '#f0ead6', marginBottom: '1.5rem'}}>Choose where to work today.</p>

      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.2rem'}}>
        <Link to="/admin/wines" style={actionCardStyle('linear-gradient(135deg, rgba(146, 43, 62, 0.85), rgba(46, 12, 24, 0.95))')}>
          <span style={{fontSize: '1.5rem'}}>🍷</span>
          <span className="gold-accent" style={{fontSize: '1.1rem'}}>Wine Cellar</span>
          <small style={{color: '#fbe7c6'}}>Add, edit, restock or retire vintages.</small>
        </Link>
        <Link to="/admin/coffees" style={actionCardStyle('linear-gradient(135deg, rgba(94, 51, 16, 0.85), rgba(22, 11, 4, 0.95))')}>
          <span style={{fontSize: '1.5rem'}}>☕</span>
          <span className="gold-accent" style={{fontSize: '1.1rem'}}>Coffee Roastery</span>
          <small style={{color: '#d9f5ff'}}>Tune origins, roast levels, and availability.</small>
        </Link>
        <Link to="/admin/orders" style={actionCardStyle('linear-gradient(135deg, rgba(29, 63, 112, 0.8), rgba(12, 24, 48, 0.95))')}>
          <span style={{fontSize: '1.5rem'}}>📦</span>
          <span className="gold-accent" style={{fontSize: '1.1rem'}}>Orders & Fulfilment</span>
          <small style={{color: '#d6f0ff'}}>Review customer journeys and delivery status.</small>
        </Link>
      </div>
    </div>
  );
};

// Simple pages using inline styles
const Home = ({ currentUser }) => {
  const navigate = useNavigate();
  const activeUser = currentUser || getCurrentActiveUser();
  const isAdmin = activeUser?.role === 'admin';
  const isGuest = !activeUser;
  const primaryTarget = isAdmin ? '/admin' : isGuest ? '/auth' : '/choose';
  const primaryLabel = isAdmin ? 'Go to Admin Dashboard' : 'ENTER';
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        navigate(primaryTarget);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [navigate, primaryTarget]);
  return (
    <div style={{
      textAlign: 'center', 
      padding: '4rem',
      color: ACCENT_TEXT,
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh'
    }}>
      <h1 style={{fontSize: '3rem', marginBottom: '1rem'}}>
        {isAdmin ? 'Cellar Command Console' : 'Premium Wine & Coffee Collection'}
      </h1>
      <p style={{
        fontSize: '1.5rem',
        fontStyle: 'italic',
        color: '#f0ead6',
        marginBottom: '3rem',
        maxWidth: '800px',
        lineHeight: '1.8'
      }}>
        {isAdmin
          ? 'Review stock, curate pairings, and keep the cellar experience flawless.'
          : "\"Where every sip tells a story — from sunrise brews to moonlit pours.\""}
      </p>
      <button
        onClick={() => navigate(primaryTarget)}
        className="luxury-button"
      >
        {primaryLabel}
      </button>
    </div>
  );
};

const ProfilePage = ({ currentUser, onLogout }) => {
  const [orderHistory, setOrderHistory] = useState([]);

  useEffect(() => {
    const user = currentUser || getCurrentActiveUser();
    if (!user?.id) return;
    let isActive = true;

    const fetchOrders = async () => {
      try {
        const response = await orderAPI.getByUser(user.id);
        if (!isActive) return;
        const orders = (response.orders || []).map(order => ({
          id: order.id,
          total: order.total ?? order.total_amount ?? 0,
          total_amount: order.total_amount ?? order.total ?? 0,
          order_date: order.order_date,
          date: order.order_date, // Add 'date' alias for renderOrderCard
          items: Array.isArray(order.items) ? order.items : [],
          payment: order.payment || { method: order.payment_mode, status: order.payment_status },
          shipping: order.shipping || null,
        }));
        setOrderHistory(orders);
    } catch (error) {
        console.error('Failed to fetch order history:', error);
      }
    };

    fetchOrders();
    return () => {
      isActive = false;
    };
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div style={{padding: '2rem', maxWidth: '800px', margin: '0 auto', textAlign: 'center'}}>
        <div className="luxury-card" style={{padding: '2rem'}}>
          <h2 className="gold-accent" style={{marginBottom: '1rem'}}>Please Sign In</h2>
          <p style={{color: '#f0ead6', marginBottom: '1.5rem'}}>
            You need to log in to view your profile and order history.
          </p>
          <Link to="/login" className="luxury-button">Go to Login</Link>
        </div>
      </div>
    );
  }

  const totalOrders = orderHistory.length;
  const totalSpent = orderHistory.reduce((sum, order) => sum + (parseFloat(order.total || 0) || 0), 0);
  const totalItems = orderHistory.reduce((sum, order) => {
    const orderItems = Array.isArray(order.items) ? order.items : [];
    return sum + orderItems.reduce((inner, item) => inner + (item.quantity || 1), 0);
  }, 0);
  const wineItems = orderHistory.reduce((sum, order) => {
    const orderItems = Array.isArray(order.items) ? order.items : [];
    return sum + orderItems.reduce((inner, item) => inner + ((item.category === 'wine') ? (item.quantity || 1) : 0), 0);
  }, 0);
  const coffeeItems = totalItems - wineItems;
  const avgSpend = totalOrders ? totalSpent / totalOrders : 0;
  const lastOrder = totalOrders ? orderHistory[orderHistory.length - 1] : null;

  const favouriteCounter = {};
  orderHistory.forEach(order => {
    (order.items || []).forEach(item => {
      const key = `${item.category || 'unknown'}|${item.name || 'Unnamed'}`;
      favouriteCounter[key] = (favouriteCounter[key] || 0) + (item.quantity || 1);
    });
  });
  const favouriteList = Object.entries(favouriteCounter)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([compound, count]) => {
      const [category, name] = compound.split('|');
      return { category, name, count };
    });

  // Show latest 3 orders first (backend already returns in DESC order)
  const highlightOrders = orderHistory.slice(0, 3);

  const renderOrderCard = (order) => (
    <div key={order.id} style={{border: '1px solid rgba(212,175,55,0.25)', borderRadius: '10px', padding: '1.1rem', background: 'rgba(0,0,0,0.3)', position: 'relative', overflow: 'hidden'}}>
      <div style={{
        position: 'absolute',
        top: '-40px',
        right: '-20px',
        width: '140px',
        height: '140px',
        background: 'radial-gradient(circle, rgba(212,175,55,0.18), transparent 70%)',
        filter: 'blur(8px)'
      }} />
      <div style={{display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem', position: 'relative'}}>
        <div>
          <p className="gold-accent" style={{margin: 0}}>Order #{order.id}</p>
          <small style={{color: '#f0ead6'}}>
            {new Date(order.date).toLocaleString('en-IN', {
              dateStyle: 'medium',
              timeStyle: 'short'
            })}
          </small>
        </div>
        <div style={{textAlign: 'right'}}>
          <p style={{color: ACCENT_TEXT, margin: 0, fontWeight: 600}}>
            ₹{parseFloat(order.total || 0).toLocaleString('en-IN')}
          </p>
          <small style={{color: '#f0ead6'}}>
            {Array.isArray(order.items) ? order.items.reduce((acc, item) => acc + (item.quantity || 1), 0) : 0} item(s)
          </small>
        </div>
      </div>
      <ul style={{margin: '0.8rem 0 0', paddingLeft: '1.2rem', color: '#f0ead6', position: 'relative'}}>
        {order.items?.map((item, index) => (
          <li key={`${order.id}-${index}`}>
            <span className="gold-accent">{item.name}</span> • {item.category === 'wine' ? 'Wine' : 'Coffee'} • Qty {item.quantity || 1}
          </li>
        ))}
      </ul>
    </div>
  );

  return (
    <div style={{
      padding: '2rem',
      maxWidth: '1200px',
      margin: '0 auto',
      position: 'relative'
    }}>
      <div style={{
        position: 'absolute',
        inset: '-80px 0 auto',
        height: '320px',
        background: 'radial-gradient(circle at 20% 20%, rgba(212,175,55,0.35), transparent 55%), radial-gradient(circle at 80% 0%, rgba(169, 112, 255, 0.28), transparent 60%)',
        filter: 'blur(60px)',
        opacity: 0.7,
        pointerEvents: 'none'
      }} />

      <div className="luxury-card" style={{
        padding: '2.5rem',
        marginBottom: '2rem',
        background: 'linear-gradient(135deg, rgba(20,20,30,0.9), rgba(40,20,60,0.75))',
        boxShadow: '0 25px 60px rgba(0,0,0,0.45)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute',
          top: '-60px',
          right: '-40px',
          width: '200px',
          height: '200px',
          background: 'radial-gradient(circle, rgba(212,175,55,0.35), transparent 70%)',
          filter: 'blur(10px)'
        }} />
        <h1 className="gold-accent" style={{fontSize: '2.6rem', marginBottom: '0.75rem'}}>
          Hey {currentUser.username}, welcome back!
        </h1>
        <p style={{color: '#f0ead6', margin: 0}}>Role: {currentUser.role}</p>
        {currentUser.email && (
          <p style={{color: '#f0ead6', marginTop: '0.5rem'}}>Email: {currentUser.email}</p>
        )}
        <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap', marginTop: '1.5rem'}}>
          <Link to="/choose" className="luxury-button" style={{flexShrink: 0}}>Discover Pairings</Link>
          <Link to="/checkout" className="luxury-button-secondary" style={{flexShrink: 0}}>Go to Cart</Link>
          <Link to="/rate" className="luxury-button-secondary" style={{flexShrink: 0}}>Rate Last Order</Link>
        </div>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem'}}>
        <div className="luxury-card" style={{padding: '1.75rem', background: 'linear-gradient(160deg, rgba(212,175,55,0.22), rgba(12,12,20,0.85))', border: '1px solid rgba(212,175,55,0.35)'}}>
          <p style={{color: '#f0ead6', margin: 0}}>Orders</p>
          <h2 className="gold-accent" style={{fontSize: '2.4rem', margin: '0.4rem 0'}}>{totalOrders}</h2>
          <small style={{color: '#f0ead6'}}>Total tastings completed</small>
        </div>
        <div className="luxury-card" style={{padding: '1.75rem', background: 'linear-gradient(160deg, rgba(147,112,255,0.25), rgba(12,12,30,0.85))', border: '1px solid rgba(147,112,255,0.35)'}}>
          <p style={{color: '#f0ead6', margin: 0}}>Total Spend</p>
          <h2 className="gold-accent" style={{fontSize: '2.4rem', margin: '0.4rem 0'}}>₹{totalSpent.toLocaleString('en-IN')}</h2>
          <small style={{color: '#f0ead6'}}>Avg ₹{avgSpend.toLocaleString('en-IN', {maximumFractionDigits: 0})} per order</small>
        </div>
        <div className="luxury-card" style={{padding: '1.75rem', background: 'linear-gradient(160deg, rgba(255,99,71,0.18), rgba(12,12,30,0.85))', border: '1px solid rgba(255,99,71,0.35)'}}>
          <p style={{color: '#f0ead6', margin: 0}}>Cellar Mix</p>
          <h2 className="gold-accent" style={{fontSize: '2rem', margin: '0.4rem 0'}}>
            🍷 {wineItems} / ☕ {coffeeItems}
          </h2>
          <small style={{color: '#f0ead6'}}>Total items sampled</small>
        </div>
        <div className="luxury-card" style={{padding: '1.75rem', background: 'linear-gradient(160deg, rgba(0,191,165,0.22), rgba(12,15,25,0.85))', border: '1px solid rgba(0,191,165,0.35)'}}>
          <p style={{color: '#f0ead6', margin: 0}}>Signature Status</p>
          <h2 className="gold-accent" style={{fontSize: '1.9rem', margin: '0.4rem 0'}}>
            {totalOrders >= 10 ? 'Cellar Connoisseur' : totalOrders >= 5 ? 'Pairing Pro' : totalOrders >= 1 ? 'Tasting Explorer' : 'Getting Started'}
          </h2>
          <small style={{color: '#f0ead6'}}>
            {totalOrders >= 10 ? "You've crafted an impressive tasting journal!" :
             totalOrders >= 5 ? 'Keep pairing — your palate is levelling up.' :
             totalOrders >= 1 ? 'Take another sip to unlock more insights.' :
             'Place your first order to unlock achievements.'}
          </small>
        </div>
      </div>

      {favouriteList.length > 0 && (
        <div className="luxury-card" style={{padding: '2rem', marginBottom: '2.5rem'}}>
          <h2 className="gold-accent" style={{fontSize: '1.9rem', marginBottom: '1.25rem'}}>Your Signature Picks</h2>
          <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem'}}>
            {favouriteList.map(fav => (
              <div key={`${fav.category}-${fav.name}`} style={{border: '1px solid rgba(212,175,55,0.25)', borderRadius: '10px', padding: '1rem', background: 'rgba(0,0,0,0.25)'}}>
                <p className="gold-accent" style={{margin: 0, fontSize: '1.1rem'}}>
                  {fav.name}
                </p>
                <p style={{color: '#f0ead6', margin: '0.4rem 0 0'}}>
                  {fav.category === 'wine' ? 'Wine Selection' : 'Coffee Selection'}
                </p>
                <small style={{color: ACCENT_TEXT}}>Enjoyed {fav.count} time{fav.count > 1 ? 's' : ''}</small>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="luxury-card" style={{padding: '2rem'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem'}}>
          <h2 className="gold-accent" style={{margin: 0, fontSize: '1.9rem'}}>Order History</h2>
          <span style={{color: '#f0ead6'}}>
            {orderHistory.length === 0 ? 'No orders yet' : `${orderHistory.length} order(s) logged`}
          </span>
        </div>

        {orderHistory.length === 0 ? (
          <p style={{color: '#f0ead6', margin: 0}}>
            Once you place an order, you'll see it here with rich tasting notes and totals.
          </p>
        ) : (
          <div style={{display: 'grid', gap: '1rem'}}>
            {highlightOrders.map(order => renderOrderCard(order))}
            {orderHistory.length > 3 && (
              <details style={{marginTop: '0.5rem'}}>
                <summary style={{color: ACCENT_TEXT, cursor: 'pointer'}}>View full history</summary>
                <div style={{marginTop: '1rem', display: 'grid', gap: '1rem'}}>
                  {orderHistory.slice(3).map(order => (
                    <div key={`full-${order.id}`} style={{border: '1px solid rgba(212,175,55,0.15)', borderRadius: '10px', padding: '1rem', background: 'rgba(0,0,0,0.2)'}}>
                      <div style={{display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem'}}>
                        <div>
                          <p className="gold-accent" style={{margin: 0}}>Order #{order.id}</p>
                          <small style={{color: '#f0ead6'}}>
                            {new Date(order.date).toLocaleString('en-IN', {
                              dateStyle: 'medium',
                              timeStyle: 'short'
                            })}
                          </small>
                        </div>
                        <p style={{color: ACCENT_TEXT, margin: 0}}>
                          ₹{parseFloat(order.total || 0).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </details>
            )}
          </div>
        )}
      </div>

      {lastOrder && (
        <div className="luxury-card" style={{padding: '2rem', marginTop: '2.5rem', background: 'linear-gradient(135deg, rgba(20,20,40,0.9), rgba(50,15,60,0.7))'}}>
          <h2 className="gold-accent" style={{fontSize: '2rem', marginBottom: '1rem'}}>Your Latest Pairing</h2>
          <p style={{color: '#f0ead6', marginBottom: '1rem'}}>
            Placed on {new Date(lastOrder.date).toLocaleString('en-IN', {dateStyle: 'long', timeStyle: 'short'})}
          </p>
          <div style={{display: 'flex', flexWrap: 'wrap', gap: '1rem'}}>
            {(lastOrder.items || []).map((item, index) => (
              <div key={`last-${index}`} style={{border: '1px solid rgba(212,175,55,0.35)', borderRadius: '12px', padding: '1rem', minWidth: '200px', flex: '1 1 200px', background: 'rgba(0,0,0,0.3)'}}>
                <p className="gold-accent" style={{margin: 0, fontSize: '1.1rem'}}>{item.name}</p>
                <p style={{color: '#f0ead6', margin: '0.4rem 0'}}>Category: {item.category === 'wine' ? 'Wine' : 'Coffee'}</p>
                <small style={{color: ACCENT_TEXT}}>Quantity: {item.quantity || 1}</small>
              </div>
            ))}
          </div>
        </div>
      )}

      {orderHistory.length > 0 && orderHistory.length <= 3 && (
        <div style={{marginTop: '1.5rem'}}>
          <h3 className="gold-accent" style={{marginBottom: '1rem'}}>Latest Orders</h3>
          <div style={{display: 'grid', gap: '1rem'}}>
            {orderHistory.map(order => renderOrderCard(order))}
          </div>
        </div>
      )}

      <div style={{marginTop: '2.5rem', display: 'flex', justifyContent: 'center'}}>
        <button
          type="button"
          className="luxury-button-secondary"
          style={{padding: '0.9rem 2.5rem', fontSize: '1.1rem'}}
          onClick={onLogout}
        >
          Log out
        </button>
      </div>
    </div>
  );
};

const ChooseProduct = ({ currentUser }) => {
  const navigate = useNavigate();
  const activeUser = currentUser || getCurrentActiveUser();
  const isAdmin = activeUser?.role === 'admin';
  return (
    <div style={{
      textAlign: 'center', 
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh'
    }}>
      <h2 className="gold-accent" style={{marginBottom: '2rem'}}>
        {isAdmin ? 'Preview your catalogue' : 'Choose Product Type'}
      </h2>
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', maxWidth: '800px', marginBottom: '2rem'}}>
        <div onClick={() => navigate('/wines')} className="luxury-card" style={{cursor: 'pointer', padding: '3rem 2rem'}}>
          <h3 className="gold-accent" style={{fontSize: '2rem'}}>
            {isAdmin ? '🍷 Manage Wines' : '🍷 WINE'}
          </h3>
        </div>
        <div onClick={() => navigate('/coffees')} className="luxury-card" style={{cursor: 'pointer', padding: '3rem 2rem'}}>
          <h3 className="gold-accent" style={{fontSize: '2rem'}}>
            {isAdmin ? '☕ Manage Coffees' : '☕ COFFEE'}
          </h3>
        </div>
      </div>
      <Link to={isAdmin ? '/admin' : '/experience'} className="luxury-button-secondary">← BACK</Link>
    </div>
  );
};

const WineSearch = ({ currentUser }) => {
  const [allWines, setAllWines] = useState([]);
  const [filteredWines, setFilteredWines] = useState([]);
  const [filters, setFilters] = useState({
    searchTerm: '',
    type: '',
    name: '',
    region: '',
    alcoholLevel: ''
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingWine, setEditingWine] = useState(null);
  const [newWine, setNewWine] = useState({
    name: '', type: '', region: '', country: '', vintage: '', 
    price: '', alcohol_content: '', acidity_level: '', sweetness_level: ''
  });
  const navigate = useNavigate();
  const activeUser = currentUser || getCurrentActiveUser();
  const isAdmin = activeUser?.role === 'admin';
  
  useEffect(() => {
    wineAPI.getAll()
      .then(response => {
        console.log('Fetched wines:', response.wines?.length, 'wines');
        setAllWines(response.wines || []);
      })
      .catch(err => {
        console.error('Error fetching wines:', err);
        // Fallback to demo query if API fails
    demoAPI.query('all-wines')
      .then(d => {
            console.log('Fetched wines (fallback):', d.data?.length, 'wines');
        setAllWines(d.data || []);
      })
          .catch(fallbackErr => console.error('Error fetching wines (fallback):', fallbackErr));
      });
  }, []);

  // Apply all filters together
  useEffect(() => {
    let filtered = [...allWines];
    
    // Apply search term filter
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(wine => 
        wine.name?.toLowerCase().includes(term) ||
        wine.region?.toLowerCase().includes(term) ||
        wine.country?.toLowerCase().includes(term) ||
        wine.type?.toLowerCase().includes(term)
      );
    }
    
    // Apply type filter
    if (filters.type) {
      filtered = filtered.filter(wine => wine.type === filters.type);
    }
    
    // Apply name filter
    if (filters.name) {
      filtered = filtered.filter(wine => wine.name?.includes(filters.name));
    }
    
    // Apply region filter
    if (filters.region) {
      filtered = filtered.filter(wine => wine.region === filters.region);
    }
    
    // Apply alcohol level filter
    if (filters.alcoholLevel) {
      const level = filters.alcoholLevel;
      if (level === 'low') {
        filtered = filtered.filter(w => parseFloat(w.alcohol_content || 0) < 13);
      } else if (level === 'medium') {
        filtered = filtered.filter(w => {
          const alc = parseFloat(w.alcohol_content || 0);
          return alc >= 13 && alc < 14;
        });
      } else if (level === 'high') {
        filtered = filtered.filter(w => parseFloat(w.alcohol_content || 0) >= 14);
      }
    }
    
    // Sort alphabetically by name
    filtered.sort((a, b) => {
      const nameA = (a.name || '').toLowerCase();
      const nameB = (b.name || '').toLowerCase();
      return nameA.localeCompare(nameB);
    });
    
    setFilteredWines(filtered);
  }, [allWines, filters]);

  const handleAddWine = async () => {
    if (!isAdmin) {
      alert('Only administrators can modify wines.');
      return;
    }
    try {
      if (editingWine) {
        // Update existing wine
        await wineAPI.update(editingWine.id, newWine);
        alert('Wine updated successfully!');
        setEditingWine(null);
      } else {
        // Create new wine
        await wineAPI.create(newWine);
        alert('Wine added successfully!');
      }
      setShowAddModal(false);
      setNewWine({ name: '', type: '', region: '', country: '', vintage: '', 
                   price: '', alcohol_content: '', acidity_level: '', sweetness_level: '' });
      // Refresh wine list
      try {
        const response = await wineAPI.getAll();
        setAllWines(response.wines || []);
      } catch (err) {
      const data = await demoAPI.query('all-wines');
      setAllWines(data.data || []);
      }
    } catch (err) {
      alert('Error: ' + (err.message || 'Failed to save wine'));
    }
  };

  const handleEditWine = (wine) => {
    if (!isAdmin) return;
    setEditingWine(wine);
    setNewWine({
      name: wine.name || '',
      type: wine.type || '',
      region: wine.region || '',
      country: wine.country || '',
      vintage: wine.vintage || '',
      price: wine.price || '',
      alcohol_content: wine.alcohol_content || '',
      acidity_level: wine.acidity_level || '',
      sweetness_level: wine.sweetness_level || ''
    });
    setShowAddModal(true);
  };

  const handleDeleteWine = async (wineId) => {
    if (!isAdmin) return;
    if (window.confirm('Are you sure you want to delete this wine?')) {
      try {
        await wineAPI.delete(wineId);
        alert('Wine deleted successfully!');
        // Refresh wine list
        try {
          const response = await wineAPI.getAll();
          setAllWines(response.wines || []);
        } catch (err) {
        const data = await demoAPI.query('all-wines');
        setAllWines(data.data || []);
        }
      } catch (err) {
        alert('Error: ' + (err.message || 'Failed to delete wine'));
      }
    }
  };

  const handleSearch = (e) => {
    setFilters({...filters, searchTerm: e.target.value});
  };

  const handleFilterChange = (filterKey, value) => {
    setFilters({...filters, [filterKey]: value});
  };

  const getUniqueValues = (key) => {
    const values = [...new Set(allWines.map(w => w[key]).filter(Boolean))];
    return values.sort((a, b) => {
      const valA = String(a).toLowerCase();
      const valB = String(b).toLowerCase();
      return valA.localeCompare(valB);
    });
  };

  return (
    <div style={{
      padding: '2rem',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
        <h1 className="gold-accent" style={{fontSize: '2.5rem', margin: 0}}>🍷 Wine Search</h1>
        {isAdmin && (
          <button onClick={() => setShowAddModal(true)} className="luxury-button" style={{padding: '1rem 2rem'}}>
            + Add New Wine
          </button>
        )}
      </div>
      
      {/* Search Bar */}
      <div style={{marginBottom: '2rem'}}>
        <input
          type="text"
          placeholder="Search wines by name, region, type, country..."
          value={filters.searchTerm}
          onChange={handleSearch}
          className="luxury-input"
          style={{width: '100%', padding: '1.5rem', fontSize: '1.2rem'}}
        />
      </div>

      {/* Category Filters */}
      <div className="luxury-card" style={{marginBottom: '2rem'}}>
        <h3 className="gold-accent" style={{marginBottom: '1rem'}}>Filter by Category:</h3>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem'}}>
          <div>
            <label className="gold-accent" style={{display: 'block', marginBottom: '0.5rem'}}>Wine Type</label>
            <select 
              className="luxury-input" 
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
            >
              <option value="">All Types</option>
              {getUniqueValues('type').map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
          
          <div>
            <label className="gold-accent" style={{display: 'block', marginBottom: '0.5rem'}}>Brand/Name</label>
            <select 
              className="luxury-input" 
              value={filters.name}
              onChange={(e) => handleFilterChange('name', e.target.value)}
            >
              <option value="">All Brands</option>
              {getUniqueValues('name').slice(0, 20).map(b => <option key={b} value={b}>{b}</option>)}
            </select>
          </div>
          
          <div>
            <label className="gold-accent" style={{display: 'block', marginBottom: '0.5rem'}}>Region</label>
            <select 
              className="luxury-input" 
              value={filters.region}
              onChange={(e) => handleFilterChange('region', e.target.value)}
            >
              <option value="">All Regions</option>
              {getUniqueValues('region').map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          
          <div>
            <label className="gold-accent" style={{display: 'block', marginBottom: '0.5rem'}}>Alcohol %</label>
            <select 
              className="luxury-input" 
              value={filters.alcoholLevel}
              onChange={(e) => handleFilterChange('alcoholLevel', e.target.value)}
            >
              <option value="">All Levels</option>
              <option value="low">Low (&lt;13%)</option>
              <option value="medium">Medium (13-14%)</option>
              <option value="high">High (14%+)</option>
            </select>
          </div>
        </div>
        {(filters.type || filters.name || filters.region || filters.alcoholLevel) && (
          <button 
            onClick={() => setFilters({searchTerm: filters.searchTerm, type: '', name: '', region: '', alcoholLevel: ''})}
            className="luxury-button-secondary"
            style={{marginTop: '1rem', padding: '0.5rem 1rem'}}
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Results */}
      <div style={{marginBottom: '2rem'}}>
        <h3 className="gold-accent" style={{marginBottom: '1rem'}}>Results: {filteredWines.length} wines</h3>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem'}}>
          {filteredWines.map(wine => {
            const currentYear = new Date().getFullYear();
            const age = wine.vintage ? currentYear - wine.vintage : null;
            return (
              <div key={wine.id} className="product-card" style={{position: 'relative'}}>
                <div onClick={() => navigate(`/product/${wine.id}?type=wine`)} style={{cursor: 'pointer'}}>
                  <h4 className="gold-accent" style={{fontSize: '1.2rem'}}>{wine.name}</h4>
                  <p style={{color: '#f0ead6', margin: '0.5rem 0'}}>Type: {wine.type || 'N/A'}</p>
                  <p style={{color: '#f0ead6', margin: '0.5rem 0'}}>Region: {wine.region || 'N/A'}</p>
                  <p style={{color: '#f0ead6', margin: '0.5rem 0'}}>Country: {wine.country || 'N/A'}</p>
                  {wine.vintage && (
                    <p style={{color: '#f0ead6', margin: '0.5rem 0'}}>
                      Vintage: {wine.vintage} {age ? `(${age} years old)` : ''}
                    </p>
                  )}
                  <p style={{color: '#f0ead6', margin: '0.5rem 0'}}>
                    Alcohol: {wine.alcohol_content ? `${wine.alcohol_content}%` : 'N/A'}
                  </p>
                  <p className="gold-accent" style={{fontSize: '1.3rem', fontWeight: 'bold', marginTop: '1rem'}}>
                    ₹{parseFloat(wine.price || 0).toLocaleString('en-IN')}
                  </p>
                </div>
                {isAdmin && (
                  <div style={{display: 'flex', gap: '0.5rem', marginTop: '0.5rem'}}>
                    <button 
                      onClick={(e) => {e.stopPropagation(); handleEditWine(wine);}}
                      className="luxury-button-secondary"
                      style={{padding: '0.5rem 1rem', fontSize: '0.9rem', flex: 1}}
                    >
                      ✏️ Edit
                    </button>
                    <button 
                      onClick={(e) => {e.stopPropagation(); handleDeleteWine(wine.id);}}
                      className="luxury-button-secondary"
                      style={{padding: '0.5rem 1rem', fontSize: '0.9rem', flex: 1, backgroundColor: 'rgba(220, 53, 69, 0.3)'}}
                    >
                      🗑️ Delete
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
      
      <Link to={isAdmin ? '/admin' : '/choose'} className="luxury-button-secondary" style={{display: 'block', textAlign: 'center', marginTop: '2rem'}}>← BACK</Link>

      {/* Add Wine Modal */}
      {isAdmin && showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div className="luxury-card" style={{
            maxWidth: '600px',
            width: '90%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '2rem'
          }}>
            <h2 className="gold-accent" style={{marginBottom: '1.5rem'}}>Add New Wine</h2>
            
            <div style={{display: 'grid', gap: '1rem', marginBottom: '1rem'}}>
              <div>
                <label className="gold-accent" style={{display: 'block', marginBottom: '0.5rem'}}>Name *</label>
                <input className="luxury-input" value={newWine.name} 
                  onChange={(e) => setNewWine({...newWine, name: e.target.value})} 
                  placeholder="Wine name" required />
              </div>
              <div>
                <label className="gold-accent" style={{display: 'block', marginBottom: '0.5rem'}}>Type *</label>
                <input className="luxury-input" value={newWine.type} 
                  onChange={(e) => setNewWine({...newWine, type: e.target.value})} 
                  placeholder="e.g., Red, White, Rose" required />
              </div>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                <div>
                  <label className="gold-accent" style={{display: 'block', marginBottom: '0.5rem'}}>Region</label>
                  <input className="luxury-input" value={newWine.region} 
                    onChange={(e) => setNewWine({...newWine, region: e.target.value})} 
                    placeholder="Region" />
                </div>
                <div>
                  <label className="gold-accent" style={{display: 'block', marginBottom: '0.5rem'}}>Country</label>
                  <input className="luxury-input" value={newWine.country} 
                    onChange={(e) => setNewWine({...newWine, country: e.target.value})} 
                    placeholder="Country" />
                </div>
              </div>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem'}}>
                <div>
                  <label className="gold-accent" style={{display: 'block', marginBottom: '0.5rem'}}>Vintage</label>
                  <input className="luxury-input" type="number" value={newWine.vintage} 
                    onChange={(e) => setNewWine({...newWine, vintage: e.target.value})} 
                    placeholder="Year" />
                </div>
                <div>
                  <label className="gold-accent" style={{display: 'block', marginBottom: '0.5rem'}}>Price (₹)</label>
                  <input className="luxury-input" type="number" step="0.01" value={newWine.price} 
                    onChange={(e) => setNewWine({...newWine, price: e.target.value})} 
                    placeholder="Price" />
                </div>
                <div>
                  <label className="gold-accent" style={{display: 'block', marginBottom: '0.5rem'}}>Alcohol %</label>
                  <input className="luxury-input" type="number" step="0.1" value={newWine.alcohol_content} 
                    onChange={(e) => setNewWine({...newWine, alcohol_content: e.target.value})} 
                    placeholder="%" />
                </div>
              </div>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                <div>
                  <label className="gold-accent" style={{display: 'block', marginBottom: '0.5rem'}}>Acidity Level</label>
                  <select className="luxury-input" value={newWine.acidity_level} 
                    onChange={(e) => setNewWine({...newWine, acidity_level: e.target.value})}>
                    <option value="">Select</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="gold-accent" style={{display: 'block', marginBottom: '0.5rem'}}>Sweetness Level</label>
                  <select className="luxury-input" value={newWine.sweetness_level} 
                    onChange={(e) => setNewWine({...newWine, sweetness_level: e.target.value})}>
                    <option value="">Select</option>
                    <option value="dry">Dry</option>
                    <option value="off-dry">Off-Dry</option>
                    <option value="semi-sweet">Semi-Sweet</option>
                    <option value="sweet">Sweet</option>
                  </select>
                </div>
              </div>
            </div>
            
            <div style={{display: 'flex', gap: '1rem', justifyContent: 'flex-end'}}>
              <button onClick={() => setShowAddModal(false)} className="luxury-button-secondary">
                Cancel
              </button>
              <button onClick={handleAddWine} className="luxury-button">
                Add Wine
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const CoffeeSearch = ({ currentUser }) => {
  const [allCoffees, setAllCoffees] = useState([]);
  const [filteredCoffees, setFilteredCoffees] = useState([]);
  const [filters, setFilters] = useState({
    searchTerm: '',
    type: '',
    roastLevel: '',
    origin: '',
    acidityLevel: ''
  });
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCoffee, setEditingCoffee] = useState(null);
  const [newCoffee, setNewCoffee] = useState({
    name: '', type: '', origin: '', country: '', roast_level: '', 
    price: '', description: '', acidity_level: ''
  });
  const navigate = useNavigate();
  const activeUser = currentUser || getCurrentActiveUser();
  const isAdmin = activeUser?.role === 'admin';
  
  useEffect(() => {
    coffeeAPI.getAll()
      .then(response => {
        console.log('Fetched coffees:', response.coffees?.length, 'coffees');
        setAllCoffees(response.coffees || []);
      })
      .catch(err => {
        console.error('Error fetching coffees:', err);
        // Fallback to demo query if API fails
    demoAPI.query('all-coffees')
      .then(d => {
            console.log('Fetched coffees (fallback):', d.data?.length, 'coffees');
        setAllCoffees(d.data || []);
      })
          .catch(fallbackErr => console.error('Error fetching coffees (fallback):', fallbackErr));
      });
  }, []);

  // Apply all filters together
  useEffect(() => {
    let filtered = [...allCoffees];
    
    // Apply search term filter
    if (filters.searchTerm) {
      const term = filters.searchTerm.toLowerCase();
      filtered = filtered.filter(coffee => 
        coffee.name?.toLowerCase().includes(term) ||
        coffee.origin?.toLowerCase().includes(term) ||
        coffee.country?.toLowerCase().includes(term) ||
        coffee.type?.toLowerCase().includes(term)
      );
    }
    
    // Apply type filter
    if (filters.type) {
      filtered = filtered.filter(coffee => coffee.type === filters.type);
    }
    
    // Apply roast level filter
    if (filters.roastLevel) {
      filtered = filtered.filter(coffee => coffee.roast_level === filters.roastLevel);
    }
    
    // Apply origin filter
    if (filters.origin) {
      filtered = filtered.filter(coffee => coffee.origin === filters.origin);
    }
    
    // Apply acidity level filter
    if (filters.acidityLevel) {
      filtered = filtered.filter(coffee => coffee.acidity_level === filters.acidityLevel);
    }
    
    // Sort alphabetically by name
    filtered.sort((a, b) => {
      const nameA = (a.name || '').toLowerCase();
      const nameB = (b.name || '').toLowerCase();
      return nameA.localeCompare(nameB);
    });
    
    setFilteredCoffees(filtered);
  }, [allCoffees, filters]);

  const handleAddCoffee = async () => {
    if (!isAdmin) {
      alert('Only administrators can modify coffees.');
      return;
    }
    try {
      if (editingCoffee) {
        // Update existing coffee
        await coffeeAPI.update(editingCoffee.id, newCoffee);
        alert('Coffee updated successfully!');
        setEditingCoffee(null);
      } else {
        // Create new coffee
        await coffeeAPI.create(newCoffee);
        alert('Coffee added successfully!');
      }
      setShowAddModal(false);
      setNewCoffee({ name: '', type: '', origin: '', country: '', roast_level: '', 
                     price: '', description: '', acidity_level: '' });
      // Refresh coffee list
      try {
        const response = await coffeeAPI.getAll();
        setAllCoffees(response.coffees || []);
      } catch (err) {
      const data = await demoAPI.query('all-coffees');
      setAllCoffees(data.data || []);
      }
    } catch (err) {
      alert('Error: ' + (err.message || 'Failed to save coffee'));
    }
  };

  const handleEditCoffee = (coffee) => {
    if (!isAdmin) return;
    setEditingCoffee(coffee);
    setNewCoffee({
      name: coffee.name || '',
      type: coffee.type || '',
      origin: coffee.origin || '',
      country: coffee.country || '',
      roast_level: coffee.roast_level || '',
      price: coffee.price || '',
      description: coffee.description || '',
      acidity_level: coffee.acidity_level || ''
    });
    setShowAddModal(true);
  };

  const handleDeleteCoffee = async (coffeeId) => {
    if (!isAdmin) return;
    if (window.confirm('Are you sure you want to delete this coffee?')) {
      try {
        await coffeeAPI.delete(coffeeId);
        alert('Coffee deleted successfully!');
        // Refresh coffee list
        try {
          const response = await coffeeAPI.getAll();
          setAllCoffees(response.coffees || []);
        } catch (err) {
        const data = await demoAPI.query('all-coffees');
        setAllCoffees(data.data || []);
        }
      } catch (err) {
        alert('Error: ' + (err.message || 'Failed to delete coffee'));
      }
    }
  };

  const handleSearch = (e) => {
    setFilters({...filters, searchTerm: e.target.value});
  };

  const handleFilterChange = (filterKey, value) => {
    setFilters({...filters, [filterKey]: value});
  };

  const getUniqueValues = (key) => {
    const values = [...new Set(allCoffees.map(c => c[key]).filter(Boolean))];
    return values.sort((a, b) => {
      const valA = String(a).toLowerCase();
      const valB = String(b).toLowerCase();
      return valA.localeCompare(valB);
    });
  };

  return (
    <div style={{
      padding: '2rem',
      maxWidth: '1200px',
      margin: '0 auto'
    }}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
        <h1 className="gold-accent" style={{fontSize: '2.5rem', margin: 0}}>☕ Coffee Search</h1>
        {isAdmin && (
          <button onClick={() => setShowAddModal(true)} className="luxury-button" style={{padding: '1rem 2rem'}}>
            + Add New Coffee
          </button>
        )}
      </div>
      
      {/* Search Bar */}
      <div style={{marginBottom: '2rem'}}>
        <input
          type="text"
          placeholder="Search coffees by name, origin, type, country..."
          value={filters.searchTerm}
          onChange={handleSearch}
          className="luxury-input"
          style={{width: '100%', padding: '1.5rem', fontSize: '1.2rem'}}
        />
      </div>

      {/* Category Filters */}
      <div className="luxury-card" style={{marginBottom: '2rem'}}>
        <h3 className="gold-accent" style={{marginBottom: '1rem'}}>Filter by Category:</h3>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem'}}>
          <div>
            <label className="gold-accent" style={{display: 'block', marginBottom: '0.5rem'}}>Coffee Type</label>
            <select 
              className="luxury-input" 
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
            >
              <option value="">All Types</option>
              {getUniqueValues('type').map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          
          <div>
            <label className="gold-accent" style={{display: 'block', marginBottom: '0.5rem'}}>Roast Level</label>
            <select 
              className="luxury-input" 
              value={filters.roastLevel}
              onChange={(e) => handleFilterChange('roastLevel', e.target.value)}
            >
              <option value="">All Roasts</option>
              {getUniqueValues('roast_level').map(r => <option key={r} value={r}>{r}</option>)}
            </select>
          </div>
          
          <div>
            <label className="gold-accent" style={{display: 'block', marginBottom: '0.5rem'}}>Origin/Region</label>
            <select 
              className="luxury-input" 
              value={filters.origin}
              onChange={(e) => handleFilterChange('origin', e.target.value)}
            >
              <option value="">All Origins</option>
              {getUniqueValues('origin').map(o => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
          
          <div>
            <label className="gold-accent" style={{display: 'block', marginBottom: '0.5rem'}}>Acidity</label>
            <select 
              className="luxury-input" 
              value={filters.acidityLevel}
              onChange={(e) => handleFilterChange('acidityLevel', e.target.value)}
            >
              <option value="">All Levels</option>
              {getUniqueValues('acidity_level').map(a => <option key={a} value={a}>{a}</option>)}
            </select>
          </div>
        </div>
        {(filters.type || filters.roastLevel || filters.origin || filters.acidityLevel) && (
          <button 
            onClick={() => setFilters({searchTerm: filters.searchTerm, type: '', roastLevel: '', origin: '', acidityLevel: ''})}
            className="luxury-button-secondary"
            style={{marginTop: '1rem', padding: '0.5rem 1rem'}}
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Results */}
      <div style={{marginBottom: '2rem'}}>
        <h3 className="gold-accent" style={{marginBottom: '1rem'}}>Results: {filteredCoffees.length} coffees</h3>
        <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem'}}>
          {filteredCoffees.map(coffee => (
            <div key={coffee.id} className="product-card" style={{position: 'relative'}}>
              <div onClick={() => navigate(`/product/${coffee.id}?type=coffee`)} style={{cursor: 'pointer'}}>
                <h4 className="gold-accent" style={{fontSize: '1.2rem'}}>{coffee.name}</h4>
                <p style={{color: '#f0ead6', margin: '0.5rem 0'}}>Type: {coffee.type || 'N/A'}</p>
                <p style={{color: '#f0ead6', margin: '0.5rem 0'}}>Origin: {coffee.origin || 'N/A'}</p>
                <p style={{color: '#f0ead6', margin: '0.5rem 0'}}>Country: {coffee.country || 'N/A'}</p>
                <p style={{color: '#f0ead6', margin: '0.5rem 0'}}>
                  Roast Level: {coffee.roast_level ? coffee.roast_level.charAt(0).toUpperCase() + coffee.roast_level.slice(1).replace('-', ' ') : 'N/A'}
                </p>
                <p style={{color: '#f0ead6', margin: '0.5rem 0'}}>
                  Acidity: {coffee.acidity_level ? coffee.acidity_level.charAt(0).toUpperCase() + coffee.acidity_level.slice(1) : 'N/A'}
                </p>
                {coffee.description && (
                  <p style={{color: '#f0ead6', margin: '0.5rem 0', fontSize: '0.9rem', fontStyle: 'italic'}}>
                    {coffee.description.length > 60 ? coffee.description.substring(0, 60) + '...' : coffee.description}
                  </p>
                )}
                <p className="gold-accent" style={{fontSize: '1.3rem', fontWeight: 'bold', marginTop: '1rem'}}>
                  ₹{parseFloat(coffee.price || 0).toLocaleString('en-IN')}
                </p>
              </div>
              {isAdmin && (
                <div style={{display: 'flex', gap: '0.5rem', marginTop: '0.5rem'}}>
                  <button 
                    onClick={(e) => {e.stopPropagation(); handleEditCoffee(coffee);}}
                    className="luxury-button-secondary"
                    style={{padding: '0.5rem 1rem', fontSize: '0.9rem', flex: 1}}
                  >
                    ✏️ Edit
                  </button>
                  <button 
                    onClick={(e) => {e.stopPropagation(); handleDeleteCoffee(coffee.id);}}
                    className="luxury-button-secondary"
                    style={{padding: '0.5rem 1rem', fontSize: '0.9rem', flex: 1, backgroundColor: 'rgba(220, 53, 69, 0.3)'}}
                  >
                    🗑️ Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <Link to={isAdmin ? '/admin' : '/choose'} className="luxury-button-secondary" style={{display: 'block', textAlign: 'center', marginTop: '2rem'}}>← BACK</Link>

      {/* Add Coffee Modal */}
      {isAdmin && showAddModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.8)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: 1000
        }}>
          <div className="luxury-card" style={{
            maxWidth: '600px',
            width: '90%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '2rem'
          }}>
            <h2 className="gold-accent" style={{marginBottom: '1.5rem'}}>
              {editingCoffee ? 'Edit Coffee' : 'Add New Coffee'}
            </h2>
            
            <div style={{display: 'grid', gap: '1rem', marginBottom: '1rem'}}>
              <div>
                <label className="gold-accent" style={{display: 'block', marginBottom: '0.5rem'}}>Name *</label>
                <input className="luxury-input" value={newCoffee.name} 
                  onChange={(e) => setNewCoffee({...newCoffee, name: e.target.value})} 
                  placeholder="Coffee name" required />
              </div>
              <div>
                <label className="gold-accent" style={{display: 'block', marginBottom: '0.5rem'}}>Type *</label>
                <input className="luxury-input" value={newCoffee.type} 
                  onChange={(e) => setNewCoffee({...newCoffee, type: e.target.value})} 
                  placeholder="e.g., Arabica, Robusta, Blend" required />
              </div>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                <div>
                  <label className="gold-accent" style={{display: 'block', marginBottom: '0.5rem'}}>Origin</label>
                  <input className="luxury-input" value={newCoffee.origin} 
                    onChange={(e) => setNewCoffee({...newCoffee, origin: e.target.value})} 
                    placeholder="Origin" />
                </div>
                <div>
                  <label className="gold-accent" style={{display: 'block', marginBottom: '0.5rem'}}>Country</label>
                  <input className="luxury-input" value={newCoffee.country} 
                    onChange={(e) => setNewCoffee({...newCoffee, country: e.target.value})} 
                    placeholder="Country" />
                </div>
              </div>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem'}}>
                <div>
                  <label className="gold-accent" style={{display: 'block', marginBottom: '0.5rem'}}>Roast Level</label>
                  <select className="luxury-input" value={newCoffee.roast_level} 
                    onChange={(e) => setNewCoffee({...newCoffee, roast_level: e.target.value})}>
                    <option value="">Select</option>
                    <option value="light">Light</option>
                    <option value="medium">Medium</option>
                    <option value="medium-dark">Medium-Dark</option>
                    <option value="dark">Dark</option>
                  </select>
                </div>
                <div>
                  <label className="gold-accent" style={{display: 'block', marginBottom: '0.5rem'}}>Price (₹)</label>
                  <input className="luxury-input" type="number" step="0.01" value={newCoffee.price} 
                    onChange={(e) => setNewCoffee({...newCoffee, price: e.target.value})} 
                    placeholder="Price" />
                </div>
              </div>
              <div>
                <label className="gold-accent" style={{display: 'block', marginBottom: '0.5rem'}}>Description</label>
                <textarea className="luxury-input" value={newCoffee.description} 
                  onChange={(e) => setNewCoffee({...newCoffee, description: e.target.value})} 
                  placeholder="Description" rows="3" />
              </div>
              <div>
                <label className="gold-accent" style={{display: 'block', marginBottom: '0.5rem'}}>Acidity Level</label>
                <select className="luxury-input" value={newCoffee.acidity_level} 
                  onChange={(e) => setNewCoffee({...newCoffee, acidity_level: e.target.value})}>
                  <option value="">Select</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </select>
              </div>
            </div>
            
            <div style={{display: 'flex', gap: '1rem', justifyContent: 'flex-end'}}>
              <button onClick={() => setShowAddModal(false)} className="luxury-button-secondary">
                Cancel
              </button>
              <button onClick={handleAddCoffee} className="luxury-button">
                Add Coffee
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const ProductDetail = ({ currentUser }) => {
  const [product, setProduct] = useState(null);
  const [stock, setStock] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const navigate = useNavigate();
  const params = new URLSearchParams(window.location.search);
  const type = params.get('type');
  const activeUser = currentUser || getCurrentActiveUser();
  const cartStorageKey = getCartStorageKey(activeUser);
  
  useEffect(() => {
    const id = window.location.pathname.split('/').pop();
    const fetchProduct = async () => {
      try {
        let foundProduct;
        if (type === 'wine') {
          foundProduct = await wineAPI.getById(id);
        } else {
          foundProduct = await coffeeAPI.getById(id);
        }
        setProduct(foundProduct);
        
        // Calculate stock based on rarity
        if (foundProduct) {
          const price = parseFloat(foundProduct.price || 0);
          // Rarer items (higher price) have lower stock
          // Price > 20000: 1-5 bottles (very rare)
          // Price > 10000: 5-15 bottles (rare)
          // Price > 5000: 10-30 bottles (premium)
          // Price <= 5000: 30-100 bottles (regular)
          let stockCount;
          if (price > 20000) {
            stockCount = Math.floor(Math.random() * 5) + 1; // 1-5
          } else if (price > 10000) {
            stockCount = Math.floor(Math.random() * 11) + 5; // 5-15
          } else if (price > 5000) {
            stockCount = Math.floor(Math.random() * 21) + 10; // 10-30
          } else {
            stockCount = Math.floor(Math.random() * 71) + 30; // 30-100
          }
          setStock(stockCount);
        }
      } catch (err) {
        console.error('Error fetching product:', err);
        // Fallback to demo query
        const queryType = type === 'wine' ? 'all-wines' : 'all-coffees';
        try {
          const d = await demoAPI.query(queryType);
          const foundProduct = d.data.find(p => Number(p.id) === Number(id));
          setProduct(foundProduct);
          
          // Calculate stock based on rarity
          if (foundProduct) {
            const price = parseFloat(foundProduct.price || 0);
            let stockCount;
            if (price > 20000) {
              stockCount = Math.floor(Math.random() * 5) + 1;
            } else if (price > 10000) {
              stockCount = Math.floor(Math.random() * 11) + 5;
            } else if (price > 5000) {
              stockCount = Math.floor(Math.random() * 21) + 10;
            } else {
              stockCount = Math.floor(Math.random() * 71) + 30;
            }
            setStock(stockCount);
          }
        } catch (fallbackErr) {
          console.error('Error fetching product (fallback):', fallbackErr);
        }
      }
    };
    fetchProduct();
  }, [type]);

  if (!product) return <div style={{padding: '2rem', textAlign: 'center'}}>Loading...</div>;

  // Build a brief, friendly history/context snippet (2–3 lines)
  const buildHistorySnippet = () => {
    const country = product.country || 'its country of origin';
    if (type === 'wine') {
      const region = product.region || 'renowned regions';
      const vintage = product.vintage ? ` Since ${product.vintage},` : ' Historically,';
      const grapeNote = product.type ? `${product.type.charAt(0).toUpperCase() + product.type.slice(1)} styles` : 'classic styles';
      return (
        `${vintage} ${grapeNote} from ${region} have reflected the terroir of ${country}. ` +
        `This bottle follows that tradition with careful cellar craft and a focus on balance.`
      );
    }
    // coffee
    const origin = product.origin || 'heritage origins';
    const roast = product.roast_level ? `${product.roast_level.replace('-', ' ')}` : 'artisan';
    return (
      `From ${origin}, ${country}, this ${roast} roast traces its roots to smallholder farms ` +
      `where careful processing shaped the region's signature cup profile.`
    );
  };

  const historySnippet = buildHistorySnippet();

  const addToCart = () => {
    if (quantity > stock) {
      alert(`Only ${stock} ${type === 'wine' ? 'bottles' : 'packages'} available!`);
      return;
    }
    
    const cart = JSON.parse(localStorage.getItem(cartStorageKey) || '[]');
    
    // Check if item already in cart
    const existingIndex = cart.findIndex(item => item.id === product.id && item.category === type);
    
    if (existingIndex >= 0) {
      // Update quantity if already in cart
      cart[existingIndex].quantity = (cart[existingIndex].quantity || 1) + quantity;
    } else {
      // Add new item with quantity and category
      cart.push({...product, quantity, category: type});
    }
    
    localStorage.setItem(cartStorageKey, JSON.stringify(cart));
    alert(`Added ${quantity} ${quantity === 1 ? (type === 'wine' ? 'bottle' : 'package') : (type === 'wine' ? 'bottles' : 'packages')} to cart!`);
    
    // Update stock display
    setStock(stock - quantity);
    setQuantity(1);
  };

  const currentYear = new Date().getFullYear();
  const age = product.vintage ? currentYear - product.vintage : null;

  return (
    <div style={{padding: '2rem', maxWidth: '900px', margin: '0 auto'}}>
      <h1 className="gold-accent" style={{fontSize: '2.5rem', marginBottom: '1rem'}}>{product.name}</h1>
      
      {/* Short history/context snippet */}
      <div className="luxury-card" style={{padding: '1rem 1.25rem', marginBottom: '1rem', background: 'rgba(0,0,0,0.35)'}}>
        <p style={{color: '#f0ead6', margin: 0, lineHeight: 1.6}}>{historySnippet}</p>
      </div>

      {/* Stock Information Banner */}
      <div className="luxury-card" style={{
        padding: '1.5rem', 
        marginBottom: '1.5rem', 
        backgroundColor: stock < 10 ? 'rgba(220, 53, 69, 0.2)' : stock < 30 ? 'rgba(255, 165, 0, 0.2)' : 'rgba(0,0,0,0.3)',
        border: stock < 10 ? '2px solid #dc3545' : stock < 30 ? '2px solid #ffa500' : `2px solid ${ACCENT_TEXT}`
      }}>
        <p style={{
          color: stock < 10 ? '#ff6b6b' : stock < 30 ? '#ffa500' : ACCENT_TEXT, 
          fontSize: '1.5rem', 
          fontWeight: 'bold', 
          margin: 0,
          textAlign: 'center'
        }}>
          {stock > 0 ? (
            <>📦 {stock} {type === 'wine' ? 'bottles' : 'packages'} left in stock</>
          ) : (
            <>⚠️ Out of Stock</>
          )}
        </p>
        {stock < 10 && stock > 0 && (
          <p style={{color: '#f0ead6', fontSize: '1rem', marginTop: '0.5rem', margin: 0, textAlign: 'center'}}>
            ⚡ Limited availability - Order soon!
          </p>
        )}
      </div>

      <div className="luxury-card" style={{padding: '2rem'}}>
        <div style={{marginBottom: '1.5rem'}}>
          {type === 'wine' ? (
            <>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem'}}>
                <p style={{color: '#f0ead6', margin: '0.5rem 0', fontSize: '1.1rem'}}>
                  <strong className="gold-accent">Type:</strong> {product.type ? product.type.charAt(0).toUpperCase() + product.type.slice(1) : 'N/A'}
                </p>
                <p style={{color: '#f0ead6', margin: '0.5rem 0', fontSize: '1.1rem'}}>
                  <strong className="gold-accent">Region:</strong> {product.region || 'N/A'}
                </p>
                <p style={{color: '#f0ead6', margin: '0.5rem 0', fontSize: '1.1rem'}}>
                  <strong className="gold-accent">Country:</strong> {product.country || 'N/A'}
                </p>
                {product.vintage && (
                  <p style={{color: '#f0ead6', margin: '0.5rem 0', fontSize: '1.1rem'}}>
                    <strong className="gold-accent">Vintage:</strong> {product.vintage} {age ? `(${age} years old)` : ''}
                  </p>
                )}
                <p style={{color: '#f0ead6', margin: '0.5rem 0', fontSize: '1.1rem'}}>
                  <strong className="gold-accent">Alcohol Content:</strong> {product.alcohol_content ? `${product.alcohol_content}%` : 'N/A'}
                </p>
                {product.acidity_level && (
                  <p style={{color: '#f0ead6', margin: '0.5rem 0', fontSize: '1.1rem'}}>
                    <strong className="gold-accent">Acidity:</strong> {product.acidity_level.charAt(0).toUpperCase() + product.acidity_level.slice(1)}
                  </p>
                )}
                {product.sweetness_level && (
                  <p style={{color: '#f0ead6', margin: '0.5rem 0', fontSize: '1.1rem'}}>
                    <strong className="gold-accent">Sweetness:</strong> {product.sweetness_level.charAt(0).toUpperCase() + product.sweetness_level.slice(1).replace('-', ' ')}
                  </p>
                )}
              </div>
            </>
          ) : (
            <>
              <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem'}}>
                <p style={{color: '#f0ead6', margin: '0.5rem 0', fontSize: '1.1rem'}}>
                  <strong className="gold-accent">Type:</strong> {product.type ? product.type.charAt(0).toUpperCase() + product.type.slice(1) : 'N/A'}
                </p>
                <p style={{color: '#f0ead6', margin: '0.5rem 0', fontSize: '1.1rem'}}>
                  <strong className="gold-accent">Origin:</strong> {product.origin || 'N/A'}
                </p>
                <p style={{color: '#f0ead6', margin: '0.5rem 0', fontSize: '1.1rem'}}>
                  <strong className="gold-accent">Country:</strong> {product.country || 'N/A'}
                </p>
                <p style={{color: '#f0ead6', margin: '0.5rem 0', fontSize: '1.1rem'}}>
                  <strong className="gold-accent">Roast Level:</strong> {product.roast_level ? product.roast_level.charAt(0).toUpperCase() + product.roast_level.slice(1).replace('-', ' ') : 'N/A'}
                </p>
                <p style={{color: '#f0ead6', margin: '0.5rem 0', fontSize: '1.1rem'}}>
                  <strong className="gold-accent">Acidity Level:</strong> {product.acidity_level ? product.acidity_level.charAt(0).toUpperCase() + product.acidity_level.slice(1) : 'N/A'}
                </p>
              </div>
              {product.description && (
                <p style={{color: '#f0ead6', margin: '0.5rem 0', fontSize: '1.1rem', lineHeight: '1.6', padding: '1rem', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '8px'}}>
                  <strong className="gold-accent">Description:</strong> {product.description}
                </p>
              )}
            </>
          )}
        </div>
        
        <div style={{borderTop: `2px solid ${ACCENT_TEXT}`, paddingTop: '1.5rem', marginTop: '1.5rem'}}>
          <p className="gold-accent" style={{fontSize: '2.5rem', fontWeight: 'bold', marginBottom: '1rem', textAlign: 'center'}}>
            ₹{parseFloat(product.price || 0).toLocaleString('en-IN')}
          </p>
          
          {stock > 0 && (
          <div style={{marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem'}}>
            <label className="gold-accent" style={{fontSize: '1.1rem'}}>Quantity:</label>
            <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
              <button 
                className="luxury-button-secondary" 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                style={{padding: '0.5rem 1rem', fontSize: '1.2rem'}}
              >
                -
              </button>
              <input
                type="number"
                min="1"
                max={stock}
                value={quantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value) || 1;
                  setQuantity(Math.max(1, Math.min(stock, val)));
                }}
                className="luxury-input"
                style={{width: '80px', textAlign: 'center', fontSize: '1.2rem', padding: '0.5rem'}}
              />
              <button 
                className="luxury-button-secondary" 
                onClick={() => setQuantity(Math.min(stock, quantity + 1))}
                style={{padding: '0.5rem 1rem', fontSize: '1.2rem'}}
              >
                +
              </button>
            </div>
            <span style={{color: '#f0ead6', fontSize: '1rem'}}>
              Total: ₹{(parseFloat(product.price || 0) * quantity).toLocaleString('en-IN')}
            </span>
          </div>
          )}
          
          <div style={{display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center'}}>
          {stock > 0 ? (
            <>
              <button 
                className="luxury-button" 
                onClick={addToCart} 
                style={{fontSize: '1.2rem', padding: '1rem 2rem', minWidth: '200px'}}
              >
                🛒 ADD TO CART
              </button>
              <button 
                className="luxury-button" 
                onClick={() => navigate('/checkout')} 
                style={{fontSize: '1.2rem', padding: '1rem 2rem', minWidth: '200px'}}
              >
                🛍️ VIEW CART
              </button>
            </>
          ) : (
            <button 
              className="luxury-button-secondary" 
              disabled 
              style={{fontSize: '1.2rem', padding: '1rem 2rem', opacity: 0.5, cursor: 'not-allowed', minWidth: '200px'}}
            >
              OUT OF STOCK
            </button>
          )}
          <Link 
            to={type === 'wine' ? '/wines' : '/coffees'} 
            className="luxury-button-secondary" 
            style={{fontSize: '1.2rem', padding: '1rem 2rem', minWidth: '200px', textAlign: 'center', display: 'inline-block'}}
          >
            ← BACK
          </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const Checkout = ({ currentUser }) => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [pairingSuggestions, setPairingSuggestions] = useState({});
  const [loadingPairings, setLoadingPairings] = useState(false);
  const [pairingError, setPairingError] = useState(null);
  const [fallbackPairings, setFallbackPairings] = useState({});
  const [formData, setFormData] = useState(DEFAULT_CHECKOUT_FORM);
  const [errors, setErrors] = useState({});
  const activeUser = currentUser || getCurrentActiveUser();
  const cartStorageKey = getCartStorageKey(activeUser);
  const checkoutDraftKey = `checkoutDraft_${activeUser?.id || 'guest'}`;
  
  useEffect(() => {
    const cartData = loadFromStorage(cartStorageKey, []);
    setCart(Array.isArray(cartData) ? cartData : []);
  }, [cartStorageKey]);

  useEffect(() => {
    if (!activeUser?.id) return;
    const savedProfile = loadFromStorage(`paymentProfile_${activeUser.id}`, null);
    if (savedProfile) {
      setFormData(prev => ({
        ...prev,
        ...mapProfileToCheckoutForm(savedProfile),
      }));
    }
  }, [activeUser]);

  useEffect(() => {
    const fetchPairings = async () => {
      if (!cart.length) {
        setPairingSuggestions({});
        setFallbackPairings({});
        setPairingError(null);
        setLoadingPairings(false);
        return;
      }

      const wineIds = new Set();
      const coffeeIds = new Set();
      const wineNames = {};
      const coffeeNames = {};
      const inCartKeys = new Set();

      cart.forEach(item => {
        if (!item || !item.id) return;
        const type = item.category || (item.region ? 'wine' : 'coffee');
        const key = `${type}:${item.id}`;
        inCartKeys.add(key);
        if (type === 'wine') {
          wineIds.add(item.id);
          wineNames[item.id] = item.name;
        } else {
          coffeeIds.add(item.id);
          coffeeNames[item.id] = item.name;
        }
      });

      if (!wineIds.size && !coffeeIds.size) {
        setPairingSuggestions({});
        setFallbackPairings({});
        setPairingError(null);
        setLoadingPairings(false);
        return;
      }

      setLoadingPairings(true);
      setPairingError(null);

      const extractProducts = (response, type) => {
        if (!response) return [];
        if (Array.isArray(response)) return response;
        if (type === 'wine') {
          return response.wines || response.data?.wines || response.results || [];
        }
        return response.coffees || response.data?.coffees || response.results || [];
      };

      const normalizeCandidate = (product, type) => {
        if (!product) return null;
        const id = product.id ?? product.wine_id ?? product.coffee_id ?? product.product_id;
        if (!id) return null;
        const normalizedPrice = product.price ?? product.price_in_inr ?? product.price_value ?? product.cost ?? product.amount ?? null;
        const normalized = {
          ...product,
          id,
          price: normalizedPrice !== null ? normalizedPrice : product.price,
          category: type,
          recommendedType: type,
          recommendedId: id,
        };
        normalized.key = product.key || `${type}:${id}`;
        return normalized;
      };

      const shuffleArray = (input = []) => {
        const array = [...input];
        for (let i = array.length - 1; i > 0; i -= 1) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
      };

      const buildDynamicFallbacks = async () => {
        try {
          const [topWinesResponse, topCoffeesResponse] = await Promise.all([
            wineAPI.getTopRated(12).catch(() => wineAPI.getAll()),
            coffeeAPI.getTopRated(12).catch(() => coffeeAPI.getAll()),
          ]);

          const normalizedWines = extractProducts(topWinesResponse, 'wine')
            .map(product => normalizeCandidate(product, 'wine'))
            .filter(Boolean);
          const normalizedCoffees = extractProducts(topCoffeesResponse, 'coffee')
            .map(product => normalizeCandidate(product, 'coffee'))
            .filter(Boolean);

          if (!normalizedWines.length && !normalizedCoffees.length) {
            return {};
          }

          const dynamicMap = {};
          const usedKeys = new Set();

          cart.forEach(item => {
            if (!item?.id) return;
            const itemType = item.category || (item.region ? 'wine' : 'coffee');
            if (!itemType) return;
            const pool = itemType === 'wine' ? normalizedCoffees : normalizedWines;
            if (!pool.length) return;

            const sourceKey = `${itemType}:${item.id}`;
            const shuffled = shuffleArray(pool);
            const selections = [];

            for (let idx = 0; idx < shuffled.length && selections.length < 3; idx += 1) {
              const candidate = shuffled[idx];
              const candidateKey = `${candidate.recommendedType}:${candidate.recommendedId}`;
              if (inCartKeys.has(candidateKey) || usedKeys.has(candidateKey)) {
                continue;
              }
              usedKeys.add(candidateKey);
              selections.push({
                ...candidate,
                key: `${candidateKey}-for-${itemType}-${item.id}`,
                description: candidate.description || `Curated to complement ${item.name}`,
                sourceName: item.name,
                sourceType: itemType,
              });
            }

            if (selections.length) {
              dynamicMap[sourceKey] = {
                sourceType: itemType,
                sourceId: item.id,
                sourceName: item.name,
                items: selections,
              };
            }
          });

          return dynamicMap;
        } catch (dynamicError) {
          console.error('Error building dynamic pairing suggestions:', dynamicError);
          return {};
        }
      };

      try {
        const requests = [];

        wineIds.forEach(id => {
          requests.push(
            pairingAPI.getRecommendations({ wineId: id, useFrequent: true })
              .then(data => ({ sourceType: 'wine', sourceId: id, recommendations: data.recommendations || [] }))
              .catch(err => {
                console.error(`Error getting recommendations for wine ${id}:`, err);
                return { sourceType: 'wine', sourceId: id, recommendations: [] };
              })
          );
        });

        coffeeIds.forEach(id => {
          requests.push(
            pairingAPI.getRecommendations({ coffeeId: id, useFrequent: true })
              .then(data => ({ sourceType: 'coffee', sourceId: id, recommendations: data.recommendations || [] }))
              .catch(err => {
                console.error(`Error getting recommendations for coffee ${id}:`, err);
                return { sourceType: 'coffee', sourceId: id, recommendations: [] };
              })
          );
        });

        if (!requests.length) {
          const dynamicMap = await buildDynamicFallbacks();
          const dynamicKeys = Object.keys(dynamicMap || {});
          if (dynamicKeys.length) {
            setPairingSuggestions({});
            setFallbackPairings(dynamicMap);
          } else {
          setPairingSuggestions({});
          setFallbackPairings({});
          }
          setLoadingPairings(false);
          return;
        }

        const responses = await Promise.all(requests);
        const suggestionsMap = {};

        await Promise.all(responses.map(async ({ sourceType, sourceId, recommendations }) => {
          if (!recommendations?.length) return;
          const sourceKey = `${sourceType}:${sourceId}`;
          const sourceName = sourceType === 'wine' ? wineNames[sourceId] : coffeeNames[sourceId];
          const seen = new Set();
          const enriched = await Promise.all(
            recommendations.slice(0, 4).map(async rec => {
              const recommendedType = sourceType === 'wine' ? 'coffee' : 'wine';
              const recommendedId = recommendedType === 'coffee' ? rec.coffee_id : rec.wine_id;
              if (!recommendedId) return null;
              const recKey = `${recommendedType}:${recommendedId}`;
              if (inCartKeys.has(recKey) || seen.has(recKey)) return null;
              seen.add(recKey);
              try {
                const product = recommendedType === 'wine'
                  ? await wineAPI.getById(recommendedId)
                  : await coffeeAPI.getById(recommendedId);
                return {
                  key: recKey,
                  recommendedType,
                  recommendedId,
                  ...product,
                  name: product.name || (recommendedType === 'coffee' ? (rec.coffee_name || rec.name) : (rec.wine_name || rec.name)),
                  type: product.type || (recommendedType === 'coffee' ? (rec.coffee_type || rec.type) : (rec.wine_type || rec.type)),
                  region: product.region || (recommendedType === 'wine' ? (rec.wine_region || rec.region) : null),
                  origin: product.origin || (recommendedType === 'coffee' ? (rec.coffee_origin || rec.origin) : null),
                  country: product.country || rec.country || null,
                  roast_level: product.roast_level || (recommendedType === 'coffee' ? rec.roast_level : null),
                  vintage: product.vintage || (recommendedType === 'wine' ? rec.vintage : null),
                  alcohol_content: product.alcohol_content || (recommendedType === 'wine' ? rec.alcohol_content : null),
                  acidity_level: product.acidity_level || rec.acidity_level,
                  pairingScore: rec.pairing_score || rec.recommendation_score || rec.purchase_count,
                  purchaseCount: rec.purchase_count,
                  description: rec.description || product.description || (rec.purchase_count ? `Bought together ${rec.purchase_count} time${rec.purchase_count > 1 ? 's' : ''}` : null),
                  sourceName,
                  sourceType,
                };
              } catch (err) {
                console.error(`Error fetching product ${recommendedId}:`, err);
                return null;
              }
            })
          );
          const filtered = enriched.filter(Boolean);
          if (filtered.length) {
            suggestionsMap[sourceKey] = {
              sourceType,
              sourceId,
              sourceName,
              items: filtered,
            };
          }
        }));

        if (Object.keys(suggestionsMap).length) {
          setPairingSuggestions(suggestionsMap);
          setFallbackPairings({});
          setLoadingPairings(false);
          return;
        }

        // fallback
        const fallbackRequests = [];
        wineIds.forEach(id => {
          fallbackRequests.push(
            pairingAPI.getRecommendations({ wineId: id, useFrequent: false })
              .then(data => ({ sourceType: 'wine', sourceId: id, recommendations: data.recommendations || [] }))
              .catch(() => ({ sourceType: 'wine', sourceId: id, recommendations: [] }))
          );
        });
        coffeeIds.forEach(id => {
          fallbackRequests.push(
            pairingAPI.getRecommendations({ coffeeId: id, useFrequent: false })
              .then(data => ({ sourceType: 'coffee', sourceId: id, recommendations: data.recommendations || [] }))
              .catch(() => ({ sourceType: 'coffee', sourceId: id, recommendations: [] }))
          );
        });

        const fallbackResponses = await Promise.all(fallbackRequests);
        const fallbackMap = {};

        await Promise.all(fallbackResponses.map(async ({ sourceType, sourceId, recommendations }) => {
          if (!recommendations?.length) return;
          const sourceKey = `${sourceType}:${sourceId}`;
          const sourceName = sourceType === 'wine' ? wineNames[sourceId] : coffeeNames[sourceId];
          const seen = new Set();
          const enriched = await Promise.all(
            recommendations.slice(0, 4).map(async rec => {
              const recommendedType = sourceType === 'wine' ? 'coffee' : 'wine';
              const recommendedId = recommendedType === 'coffee' ? rec.coffee_id : rec.wine_id;
              if (!recommendedId) return null;
              const recKey = `${recommendedType}:${recommendedId}`;
              if (inCartKeys.has(recKey) || seen.has(recKey)) return null;
              seen.add(recKey);
              try {
                const product = recommendedType === 'wine'
                  ? await wineAPI.getById(recommendedId)
                  : await coffeeAPI.getById(recommendedId);
                return {
                  key: recKey,
                  recommendedType,
                  recommendedId,
                  ...product,
                  name: product.name || (recommendedType === 'coffee' ? (rec.coffee_name || rec.name) : (rec.wine_name || rec.name)),
                  type: product.type || (recommendedType === 'coffee' ? (rec.coffee_type || rec.type) : (rec.wine_type || rec.type)),
                  region: product.region || (recommendedType === 'wine' ? (rec.wine_region || rec.region) : null),
                  origin: product.origin || (recommendedType === 'coffee' ? (rec.coffee_origin || rec.origin) : null),
                  country: product.country || rec.country || null,
                  roast_level: product.roast_level || (recommendedType === 'coffee' ? rec.roast_level : null),
                  vintage: product.vintage || (recommendedType === 'wine' ? rec.vintage : null),
                  alcohol_content: product.alcohol_content || (recommendedType === 'wine' ? rec.alcohol_content : null),
                  acidity_level: product.acidity_level || rec.acidity_level,
                  pairingScore: rec.pairing_score || rec.recommendation_score,
                  description: rec.description || product.description || 'Expertly paired for complementary flavors',
                  sourceName,
                  sourceType,
                };
              } catch (err) {
                console.error(`Error fetching fallback product ${recommendedId}:`, err);
                return null;
              }
            })
          );
          const filtered = enriched.filter(Boolean);
          if (filtered.length) {
            fallbackMap[sourceKey] = {
              sourceType,
              sourceId,
              sourceName,
              items: filtered,
            };
          }
        }));

        if (Object.keys(fallbackMap).length) {
        setPairingSuggestions({});
        setFallbackPairings(fallbackMap);
          return;
        }

        const dynamicMap = await buildDynamicFallbacks();
        const dynamicKeys = Object.keys(dynamicMap || {});
        if (dynamicKeys.length) {
          setPairingSuggestions({});
          setFallbackPairings(dynamicMap);
        } else {
          setPairingSuggestions({});
          setFallbackPairings({});
        }
      } catch (error) {
        console.error('Error fetching pairing recommendations:', error);
        setPairingError('Could not load pairing suggestions right now.');
        setPairingSuggestions({});
        setFallbackPairings({});
      } finally {
        setLoadingPairings(false);
      }
    };

    fetchPairings();
  }, [cart]);

  const updateCart = (newCart) => {
    setCart(newCart);
    saveToStorage(cartStorageKey, newCart);
  };

  const removeFromCart = (index) => {
    const newCart = cart.filter((_, i) => i !== index);
    updateCart(newCart);
  };

  const updateQuantity = (index, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(index);
      return;
    }
    const newCart = [...cart];
    newCart[index].quantity = newQuantity;
    updateCart(newCart);
  };

  const total = cart.reduce((sum, item) => {
    const quantity = item.quantity || 1;
    return sum + (parseFloat(item.price || 0) * quantity);
  }, 0);

  const itemCount = cart.reduce((sum, item) => sum + (item.quantity || 1), 0);

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
    if (errors[field]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  const renderError = (field) => errors[field] ? (
    <span style={{ color: '#ff6b6b', fontSize: '0.8rem', marginTop: '0.25rem', display: 'block' }}>
      {errors[field]}
    </span>
  ) : null;

  const validateForm = () => {
    const nextErrors = {};
    const trimmedName = formData.fullName.trim();
    const trimmedPhone = formData.phone.trim();
    const trimmedAddress = formData.addressLine1.trim();
    const trimmedCity = formData.city.trim();
    const trimmedState = formData.state.trim();
    const trimmedPostal = formData.postalCode.trim();

    if (!trimmedName) nextErrors.fullName = 'Full name is required';
    if (!trimmedPhone) {
      nextErrors.phone = 'Phone number is required';
    } else if (!/^[0-9]{10}$/.test(trimmedPhone)) {
      nextErrors.phone = 'Enter a valid 10-digit phone number';
    }
    if (!trimmedAddress) nextErrors.addressLine1 = 'Address line 1 is required';
    if (!trimmedCity) nextErrors.city = 'City is required';
    if (!trimmedState) nextErrors.state = 'State is required';
    if (!trimmedPostal) {
      nextErrors.postalCode = 'Postal code is required';
    } else if (!/^[0-9]{6}$/.test(trimmedPostal)) {
      nextErrors.postalCode = 'Enter a valid 6-digit postal code';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const [submitting, setSubmitting] = useState(false);
  const [paymentMode, setPaymentMode] = useState('cash');

  const handlePlaceOrder = async () => {
    if (!cart.length) {
      alert('Your cart is empty!');
      return;
    }

    if (!activeUser?.id) {
      alert('Please sign in to place order.');
      navigate('/login');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      // Prepare order data
      const orderItems = cart.map(item => ({
        product_id: item.id,
        product_type: item.category || (item.region ? 'wine' : 'coffee'),
        name: item.name,
        category: item.category || (item.region ? 'wine' : 'coffee'),
        quantity: item.quantity || 1,
        price: parseFloat(item.price || 0),
      }));

      const orderPayload = {
        userId: activeUser.id,
        items: orderItems,
        shipping: {
          full_name: formData.fullName,
          phone: formData.phone,
          address_line1: formData.addressLine1,
          address_line2: formData.addressLine2,
          city: formData.city,
          state: formData.state,
          postal_code: formData.postalCode,
          country: formData.country,
          delivery_instructions: formData.deliveryInstructions,
        },
        total: total,
        saveDetails: formData.saveDetails,
      };

      // Save order to backend
      const response = await orderAPI.create(orderPayload);
      
      // Clear cart
      removeFromStorage(cartStorageKey);
      removeFromStorage(checkoutDraftKey);
      
      // Show success and navigate
      alert(`✅ Order Placed Successfully!\n\nOrder ID: #${response.order?.id || 'Pending'}\nTotal: ₹${total.toLocaleString('en-IN')}\nPayment Mode: ${paymentMode.toUpperCase()}\n\nYour order will be delivered soon!`);
      navigate('/profile', { replace: true });
    } catch (error) {
      console.error('Failed to place order:', error);
      setSubmitting(false);
      alert(`Error placing order: ${error.message || 'Please try again'}`);
    }
  };

  const renderPairingCard = (suggestion, options = {}) => {
    const { allowNavigate = true } = options;
    const inferredType = suggestion.recommendedType || suggestion.category || (suggestion.region ? 'wine' : suggestion.origin ? 'coffee' : null);
    const isWine = inferredType === 'wine';
    const displayType = suggestion.type || (isWine ? (suggestion.wine_type || suggestion.product_type) : (suggestion.coffee_type || suggestion.product_type)) || 'N/A';
    const displayRegionOrOrigin = isWine
      ? (suggestion.region || suggestion.wine_region || suggestion.region_name || 'N/A')
      : (suggestion.origin || suggestion.coffee_origin || suggestion.origin_name || 'N/A');
    const displayCountry = suggestion.country || (isWine ? suggestion.wine_country : suggestion.coffee_country) || 'N/A';
    const displayVintage = isWine ? (suggestion.vintage || suggestion.wine_vintage || null) : null;
    const displayAlcohol = isWine ? (suggestion.alcohol_content || suggestion.wine_alcohol || null) : null;
    const displayRoast = !isWine ? (suggestion.roast_level || suggestion.coffee_roast_level || null) : null;
    const displayAcidity = !isWine ? (suggestion.acidity_level || suggestion.coffee_acidity_level || null) : null;
    const description = suggestion.description || (isWine
      ? "Classic pairing tailored to enhance the wine's tasting notes."
      : "Balanced pairing crafted to complement the coffee profile.");
    const currentYear = new Date().getFullYear();
    const vintageAge = displayVintage ? currentYear - parseInt(displayVintage, 10) : null;
    const targetId = suggestion.recommendedId || suggestion.id;
    const targetType = inferredType || 'wine';
    const suggestionKey = suggestion.key || `${targetType}:${targetId || suggestion.name}-${suggestion.sourceName || 'pairing'}`;
    const canNavigate = allowNavigate && targetId;
    const handleClick = () => {
      if (canNavigate) {
        navigate(`/product/${targetId}?type=${targetType}`);
      }
    };

    return (
      <div key={suggestionKey} className="product-card" style={{position: 'relative'}}>
        <div
          onClick={canNavigate ? handleClick : undefined}
          style={{cursor: canNavigate ? 'pointer' : 'default'}}
        >
          <h4 className="gold-accent" style={{fontSize: '1.2rem', marginBottom: '0.5rem'}}>{suggestion.name}</h4>
          <p style={{color: '#f0ead6', margin: '0.5rem 0'}}>Type: {displayType}</p>
          {isWine ? (
            <>
              <p style={{color: '#f0ead6', margin: '0.5rem 0'}}>Region: {displayRegionOrOrigin}</p>
              <p style={{color: '#f0ead6', margin: '0.5rem 0'}}>Country: {displayCountry}</p>
              {displayVintage && (
                <p style={{color: '#f0ead6', margin: '0.5rem 0'}}>
                  Vintage: {displayVintage} {vintageAge ? `(${vintageAge} years old)` : ''}
                </p>
              )}
              {displayAlcohol && (
                <p style={{color: '#f0ead6', margin: '0.5rem 0'}}>
                  Alcohol: {displayAlcohol}%
                </p>
              )}
            </>
          ) : (
            <>
              <p style={{color: '#f0ead6', margin: '0.5rem 0'}}>Origin: {displayRegionOrOrigin}</p>
              <p style={{color: '#f0ead6', margin: '0.5rem 0'}}>Country: {displayCountry}</p>
              {displayRoast && (
                <p style={{color: '#f0ead6', margin: '0.5rem 0'}}>
                  Roast Level: {displayRoast.charAt(0).toUpperCase() + displayRoast.slice(1).replace('-', ' ')}
                </p>
              )}
              {displayAcidity && (
                <p style={{color: '#f0ead6', margin: '0.5rem 0'}}>
                  Acidity: {displayAcidity.charAt(0).toUpperCase() + displayAcidity.slice(1)}
                </p>
              )}
            </>
          )}
          {description && (
            <p style={{color: '#f0ead6', margin: '0.5rem 0', fontSize: '0.9rem', fontStyle: 'italic'}}>
              {description}
            </p>
          )}
          {suggestion.purchaseCount && (
            <p style={{color: ACCENT_TEXT, margin: '0.5rem 0', fontWeight: 'bold', fontSize: '0.9rem'}}>
              🔥 Bought together {suggestion.purchaseCount} time{suggestion.purchaseCount > 1 ? 's' : ''}
            </p>
          )}
          {suggestion.pairingScore && !suggestion.purchaseCount && (
            <p style={{color: ACCENT_TEXT, margin: '0.5rem 0', fontWeight: 'bold', fontSize: '0.9rem'}}>
              ⭐ Pairing score: {parseFloat(suggestion.pairingScore).toFixed(1)}/10
            </p>
          )}
          <p style={{color: '#f0ead6', margin: '0.5rem 0', fontSize: '0.85rem', fontStyle: 'italic'}}>
            Recommended with <span className="gold-accent">{suggestion.sourceName}</span>
          </p>
          {suggestion.price && (
            <p className="gold-accent" style={{fontSize: '1.3rem', fontWeight: 'bold', marginTop: '1rem'}}>
              ₹{parseFloat(suggestion.price || 0).toLocaleString('en-IN')}
            </p>
          )}
        </div>
      </div>
    );
  };

  const samplePairings = [
    {
      key: 'sample-cabernet',
      recommendedType: 'wine',
      name: 'Cabernet Sauvignon Reserve',
      type: 'Red',
      region: 'Napa Valley',
      country: 'USA',
      vintage: 2018,
      alcohol_content: 14.5,
      description: 'Bold blackcurrant notes that balance the floral sweetness of Ethiopian Yirgacheffe coffee.',
      sourceName: 'Ethiopian Yirgacheffe Coffee',
      price: 5200,
      pairingScore: 9.6,
    },
    {
      key: 'sample-yirgacheffe',
      recommendedType: 'coffee',
      name: 'Ethiopian Yirgacheffe',
      type: 'Arabica',
      origin: 'Yirgacheffe',
      country: 'Ethiopia',
      roast_level: 'medium-light',
      acidity_level: 'bright',
      description: 'Floral citrus profile that pairs beautifully with buttery Chardonnay and crisp white wines.',
      sourceName: 'Sonoma Coast Chardonnay',
      price: 1800,
      pairingScore: 9.4,
    }
  ];

  const pairingKeys = Object.keys(pairingSuggestions || {});
  const fallbackKeys = Object.keys(fallbackPairings || {});
  const primarySuggestionList = pairingKeys.flatMap(key => pairingSuggestions?.[key]?.items || []);
  const hasPrimaryPairings = primarySuggestionList.length > 0;
  const hasFallbackPairings = fallbackKeys.length > 0;

  return (
    <div style={{padding: '2rem', maxWidth: '900px', margin: '0 auto'}}>
      <h1 className="gold-accent" style={{fontSize: '2.5rem', marginBottom: '1rem'}}>🛒 Shopping Cart</h1>
      
      {cart.length === 0 ? (
        <div className="luxury-card" style={{padding: '3rem', textAlign: 'center'}}>
          <p style={{color: '#f0ead6', fontSize: '1.5rem', marginBottom: '2rem'}}>Your cart is empty</p>
          <button className="luxury-button" onClick={() => navigate('/choose')}>Continue Shopping</button>
          </div>
      ) : (
        <>
          <div className="luxury-card" style={{padding: '2rem', marginBottom: '2rem'}}>
            <h2 className="gold-accent" style={{marginBottom: '1.5rem', fontSize: '1.8rem'}}>Your Order ({cart.length} {cart.length === 1 ? 'item' : 'items'})</h2>
            {cart.map((item, i) => {
              const quantity = item.quantity || 1;
              const itemTotal = parseFloat(item.price || 0) * quantity;
              // Get item category (wine or coffee)
              const itemType = item.category || (item.region ? 'wine' : 'coffee');
              const sourceKey = item.id ? `${itemType}:${item.id}` : null;
              const itemPairings = sourceKey ? pairingSuggestions[sourceKey] : null;
              const itemFallbackPairings = sourceKey ? fallbackPairings[sourceKey] : null;
              
              return (
                <div key={i} style={{
                  borderBottom: '1px solid rgba(212, 175, 55, 0.3)',
                  padding: '1.5rem 0',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.25rem'
                }}>
                  <div style={{display: 'flex', gap: '1rem', alignItems: 'flex-start'}}>
                    <div style={{flex: 1}}>
                      <h3 className="gold-accent" style={{fontSize: '1.3rem', marginBottom: '0.5rem'}}>
                        {item.name}
                      </h3>
                    <div style={{color: '#f0ead6', fontSize: '0.9rem', marginBottom: '0.5rem'}}>
                      {itemType === 'wine' ? (
                        <>
                          {item.type && <span>{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</span>}
                          {item.region && <span> • {item.region}</span>}
                          {item.vintage && <span> • {item.vintage}</span>}
                        </>
                      ) : (
                        <>
                          {item.type && <span>{item.type.charAt(0).toUpperCase() + item.type.slice(1)}</span>}
                          {item.origin && <span> • {item.origin}</span>}
                          {item.roast_level && <span> • {item.roast_level.charAt(0).toUpperCase() + item.roast_level.slice(1).replace('-', ' ')}</span>}
                        </>
                      )}
      </div>
                      <p style={{color: ACCENT_TEXT, fontSize: '1.1rem', fontWeight: 'bold'}}>
                        ₹{parseFloat(item.price || 0).toLocaleString('en-IN')} per {itemType === 'wine' ? 'bottle' : 'package'}
                      </p>
                    </div>
                    
                    <div style={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', minWidth: '120px'}}>
                      <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                        <button 
                          className="luxury-button-secondary" 
                          onClick={() => updateQuantity(i, quantity - 1)}
                          style={{padding: '0.3rem 0.8rem', fontSize: '1rem'}}
                        >
                          -
                        </button>
                        <span style={{color: '#f0ead6', fontSize: '1.1rem', minWidth: '40px', textAlign: 'center'}}>
                          {quantity}
                        </span>
                        <button 
                          className="luxury-button-secondary" 
                          onClick={() => updateQuantity(i, quantity + 1)}
                          style={{padding: '0.3rem 0.8rem', fontSize: '1rem'}}
                        >
                          +
                        </button>
                      </div>
                      <p className="gold-accent" style={{fontSize: '1.2rem', fontWeight: 'bold'}}>
                        ₹{itemTotal.toLocaleString('en-IN')}
                      </p>
                      <button 
                        className="luxury-button-secondary" 
                        onClick={() => removeFromCart(i)}
                        style={{padding: '0.3rem 0.8rem', fontSize: '0.9rem', marginTop: '0.5rem'}}
                      >
                        Remove
                      </button>
                    </div>
                  </div>

                  {!loadingPairings && !pairingError && itemPairings && (
                    <div style={{border: '1px solid rgba(212,175,55,0.35)', borderRadius: '12px', padding: '1.2rem', background: 'rgba(0,0,0,0.25)'}}>
                      <h4 className="gold-accent" style={{marginBottom: '0.75rem', fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem'}}>
                        <WineCoffeeIcon size={22} spacing={4} /> Perfect Pairings for {item.name}
                      </h4>
                      <p style={{color: '#f0ead6', marginBottom: '1rem', fontSize: '0.95rem'}}>
                        These are frequently enjoyed with {item.name}. Add them to curate a complete experience.
                      </p>
                      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem'}}>
                        {itemPairings.items.map(suggestion => renderPairingCard(suggestion))}
                      </div>
                    </div>
                  )}

                  {!loadingPairings && !pairingError && !itemPairings && itemFallbackPairings && (
                    <div style={{border: '1px solid rgba(212,175,55,0.25)', borderRadius: '12px', padding: '1.2rem', background: 'rgba(0,0,0,0.18)'}}>
                      <h4 className="gold-accent" style={{marginBottom: '0.75rem', fontSize: '1.2rem'}}>
                        💡 Curated Pairings for {item.name}
                      </h4>
                      <p style={{color: '#f0ead6', marginBottom: '1rem', fontSize: '0.95rem'}}>
                        Our sommeliers recommend exploring these complementary selections with {item.name}.
                      </p>
                      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem'}}>
                        {itemFallbackPairings.items.map(suggestion => renderPairingCard(suggestion))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="luxury-card" style={{padding: '2rem', marginBottom: '2rem'}}>
            <h2 className="gold-accent" style={{marginBottom: '1.25rem', fontSize: '1.8rem'}}>Delivery Details</h2>
            <p style={{color: '#f0ead6', marginBottom: '1.5rem'}}>
              We deliver within 2-5 business days. Cash on Delivery (COD) is collected at your doorstep.
            </p>

            <div style={{display: 'grid', gap: '1.5rem'}}>
              <div style={{display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))'}}>
                <div>
                  <label className="gold-accent" style={{display: 'block', marginBottom: '0.4rem'}}>Full Name</label>
                  <input
                    className="luxury-input"
                    value={formData.fullName}
                    onChange={(e) => handleFieldChange('fullName', e.target.value)}
                    placeholder="Recipient name"
                  />
                  {renderError('fullName')}
                </div>
                <div>
                  <label className="gold-accent" style={{display: 'block', marginBottom: '0.4rem'}}>Phone Number</label>
                  <input
                    className="luxury-input"
                    value={formData.phone}
                    onChange={(e) => handleFieldChange('phone', e.target.value)}
                    placeholder="10-digit mobile"
                  />
                  {renderError('phone')}
                </div>
                <div>
                  <label className="gold-accent" style={{display: 'block', marginBottom: '0.4rem'}}>Country</label>
                  <input
                    className="luxury-input"
                    value={formData.country}
                    onChange={(e) => handleFieldChange('country', e.target.value)}
                    placeholder="Country"
                  />
                </div>
              </div>

              <div>
                <label className="gold-accent" style={{display: 'block', marginBottom: '0.4rem'}}>Address Line 1</label>
                <input
                  className="luxury-input"
                  value={formData.addressLine1}
                  onChange={(e) => handleFieldChange('addressLine1', e.target.value)}
                  placeholder="House number, street name"
                />
                {renderError('addressLine1')}
              </div>
              <div>
                <label className="gold-accent" style={{display: 'block', marginBottom: '0.4rem'}}>Address Line 2 (optional)</label>
                <input
                  className="luxury-input"
                  value={formData.addressLine2}
                  onChange={(e) => handleFieldChange('addressLine2', e.target.value)}
                  placeholder="Landmark, apartment, etc."
                />
              </div>

              <div style={{display: 'grid', gap: '1rem', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))'}}>
                <div>
                  <label className="gold-accent" style={{display: 'block', marginBottom: '0.4rem'}}>City</label>
                  <input
                    className="luxury-input"
                    value={formData.city}
                    onChange={(e) => handleFieldChange('city', e.target.value)}
                    placeholder="City"
                  />
                  {renderError('city')}
                </div>
                <div>
                  <label className="gold-accent" style={{display: 'block', marginBottom: '0.4rem'}}>State</label>
                  <input
                    className="luxury-input"
                    value={formData.state}
                    onChange={(e) => handleFieldChange('state', e.target.value)}
                    placeholder="State"
                  />
                  {renderError('state')}
                </div>
                <div>
                  <label className="gold-accent" style={{display: 'block', marginBottom: '0.4rem'}}>Postal Code</label>
                  <input
                    className="luxury-input"
                    value={formData.postalCode}
                    onChange={(e) => handleFieldChange('postalCode', e.target.value)}
                    placeholder="6-digit PIN"
                  />
                  {renderError('postalCode')}
                </div>
              </div>

              <div>
                <label className="gold-accent" style={{display: 'block', marginBottom: '0.4rem'}}>Delivery Instructions (optional)</label>
                <textarea
                  className="luxury-input"
                  rows={3}
                  value={formData.deliveryInstructions}
                  onChange={(e) => handleFieldChange('deliveryInstructions', e.target.value)}
                  placeholder="Gate code, preferred delivery time, etc."
                  style={{resize: 'vertical'}}
                />
              </div>

              <label style={{display: 'flex', alignItems: 'center', gap: '0.6rem', color: '#f0ead6'}}>
                <input
                  type="checkbox"
                  checked={formData.saveDetails}
                  onChange={(e) => handleFieldChange('saveDetails', e.target.checked)}
                  style={{width: '1.1rem', height: '1.1rem'}}
                />
                Save these details for future orders
              </label>

              <div style={{
                marginTop: '0.5rem',
                padding: '1.2rem',
                borderRadius: '10px',
                background: 'rgba(0,0,0,0.35)',
                border: '1px solid rgba(212, 175, 55, 0.35)',
              }}>
                <h3 className="gold-accent" style={{marginBottom: '0.5rem'}}>Payment Method</h3>
                <p style={{color: '#f0ead6', marginBottom: '0.4rem'}}>
                  <strong className="gold-accent">Cash on Delivery (COD)</strong>
                </p>
                <p style={{color: '#f0ead6', fontSize: '0.95rem', margin: 0}}>
                  Keep exact change ready if possible. Our delivery partner will call before arrival to confirm a suitable time.
                </p>
              </div>
            </div>
          </div>

          {loadingPairings && (
            <div className="luxury-card" style={{padding: '1.5rem', marginBottom: '2rem'}}>
              <p style={{color: '#f0ead6', margin: 0}}>Curating pairings for your selection...</p>
            </div>
          )}

          {!loadingPairings && pairingError && (
            <div className="luxury-card" style={{padding: '1.5rem', marginBottom: '2rem', border: '1px solid rgba(220, 53, 69, 0.4)'}}>
              <p style={{color: '#ff6b6b', margin: 0}}>{pairingError}</p>
            </div>
          )}

          {!loadingPairings && !pairingError && hasPrimaryPairings && (
            <div className="luxury-card" style={{padding: '2rem', marginBottom: '2rem', border: `2px solid ${ACCENT_TEXT}`}}>
              <h2 className="gold-accent" style={{marginBottom: '0.75rem', fontSize: '1.8rem', display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                <WineCoffeeIcon size={26} spacing={6} /> Perfect Pairings
              </h2>
              <p style={{color: '#f0ead6', margin: '0 0 1.5rem', fontSize: '1.1rem'}}>
                <strong>People generally buy these products together!</strong> These pairings go well with your selection.
              </p>
              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem'}}>
                {primarySuggestionList.map(suggestion => renderPairingCard(suggestion))}
              </div>
            </div>
          )}

          {!loadingPairings && !pairingError && !hasPrimaryPairings && !hasFallbackPairings && cart.length > 0 && (
            <div className="luxury-card" style={{padding: '2rem', marginBottom: '2rem', backgroundColor: 'rgba(212, 175, 55, 0.1)', border: '2px solid rgba(212, 175, 55, 0.4)'}}>
              <h3 className="gold-accent" style={{marginBottom: '1rem', fontSize: '1.5rem'}}>💡 Recommended Pairings</h3>
              <div>
                <p style={{color: '#f0ead6', marginBottom: '1rem', fontSize: '1rem'}}>
                  <strong>Why pairing matters:</strong> The right wine and coffee combination can enhance both flavors. Here are two sommelier-approved pairings to inspire you:
                </p>
                <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1rem'}}>
                  {samplePairings.map(sample => renderPairingCard(sample))}
                </div>
                <p style={{color: '#f0ead6', marginTop: '1.25rem', fontSize: '0.95rem'}}>
                  As customers place orders, we'll replace these examples with real recommendations based on what other guests enjoy alongside their selections. Check back after a few orders to see personalized suggestions!
                </p>
              </div>
            </div>
          )}
          
          <div className="luxury-card" style={{padding: '2rem'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '1rem', fontSize: '1.2rem'}}>
              <span style={{color: '#f0ead6'}}>Items ({itemCount}):</span>
              <span className="gold-accent">₹{total.toLocaleString('en-IN')}</span>
            </div>
            <div style={{borderTop: `2px solid ${ACCENT_TEXT}`, paddingTop: '1rem', marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
              <h2 className="gold-accent" style={{fontSize: '2rem', margin: 0}}>Total:</h2>
              <h2 className="gold-accent" style={{fontSize: '2rem', margin: 0}}>₹{total.toLocaleString('en-IN')}</h2>
            </div>
            
            <div style={{marginTop: '2rem', padding: '1.5rem', background: 'rgba(212,175,55,0.1)', borderRadius: '8px', border: '1px solid rgba(212,175,55,0.3)'}}>
              <label className="gold-accent" style={{display: 'block', marginBottom: '0.75rem', fontSize: '1.1rem'}}>
                Payment Mode
              </label>
              <select
                className="luxury-input"
                value={paymentMode}
                onChange={(e) => setPaymentMode(e.target.value)}
                style={{fontSize: '1.1rem', padding: '0.75rem'}}
              >
                <option value="cash">Cash on Delivery</option>
                <option value="card">Card Payment</option>
                <option value="upi">UPI Payment</option>
                <option value="netbanking">Net Banking</option>
              </select>
            </div>

            <div style={{display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap'}}>
              <button
                className="luxury-button"
                onClick={handlePlaceOrder}
                disabled={submitting}
                style={{fontSize: '1.2rem', padding: '1rem 2rem', flex: 1}}
              >
                {submitting ? '⏳ Placing Order...' : '✅ Place Order'}
              </button>
              <button className="luxury-button-secondary" onClick={() => navigate('/choose')} style={{fontSize: '1.2rem', padding: '1rem 2rem'}}>
                Continue Shopping
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

const RateOrder = ({ currentUser }) => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [ratings, setRatings] = useState({});
  const [comments, setComments] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const activeUser = currentUser || getCurrentActiveUser();
  const lastOrderStorageKey = getLastOrderStorageKey(activeUser);
  const exitRoute = activeUser?.role === 'admin' ? '/admin' : '/choose';

  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem(lastOrderStorageKey) || '[]');
    if (!storedItems.length) {
      navigate(exitRoute);
      return;
    }

    setItems(storedItems);
    setRatings(storedItems.reduce((acc, item) => {
      acc[item.id] = acc[item.id] || 5;
      return acc;
    }, {}));
    setComments(storedItems.reduce((acc, item) => {
      acc[item.id] = acc[item.id] || '';
      return acc;
    }, {}));
  }, [navigate, exitRoute, lastOrderStorageKey]);

  const handleRatingChange = (id, value) => {
    setRatings(prev => ({...prev, [id]: Number(value)}));
  };

  const handleCommentChange = (id, value) => {
    setComments(prev => ({...prev, [id]: value}));
  };

  const handleSkip = () => {
    localStorage.removeItem(lastOrderStorageKey);
    navigate(exitRoute);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!items.length) return;

    const missingRatings = items.filter(item => !ratings[item.id]);
    if (missingRatings.length) {
      alert('Please select a rating for each item before submitting.');
      return;
    }

    setSubmitting(true);
    alert('Thank you for sharing your feedback!');
    localStorage.removeItem(lastOrderStorageKey);
    setSubmitting(false);
    navigate('/choose');
  };

  return (
    <div style={{padding: '2rem', maxWidth: '900px', margin: '0 auto'}}>
      <h1 className="gold-accent" style={{fontSize: '2.5rem', marginBottom: '1rem'}}>⭐ Rate Your Experience</h1>
      <p style={{color: '#f0ead6', marginBottom: '1.5rem'}}>
        Thank you for your purchase! Please rate each wine or coffee you ordered so we can keep refining the collection.
      </p>

      <form onSubmit={handleSubmit}>
        {items.map(item => (
          <div key={`${item.category}-${item.id}`} className="luxury-card" style={{padding: '1.5rem', marginBottom: '1.5rem'}}>
            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap'}}>
              <div style={{flex: 1}}>
                <h2 className="gold-accent" style={{margin: 0, fontSize: '1.5rem'}}>
                  {item.name}
                </h2>
                <p style={{color: '#f0ead6', margin: '0.5rem 0'}}>
                  Category: {item.category === 'wine' ? 'Wine' : 'Coffee'}{item.quantity > 1 ? ` • Quantity: ${item.quantity}` : ''}
                </p>
              </div>

              <div style={{minWidth: '160px'}}>
                <label className="gold-accent" style={{display: 'block', marginBottom: '0.5rem'}}>Your Rating</label>
                <select
                  className="luxury-input"
                  value={ratings[item.id] ?? ''}
                  onChange={(e) => handleRatingChange(item.id, e.target.value)}
                  required
                >
                  <option value="">Select rating</option>
                  <option value={5}>⭐⭐⭐⭐⭐ (5)</option>
                  <option value={4}>⭐⭐⭐⭐ (4)</option>
                  <option value={3}>⭐⭐⭐ (3)</option>
                  <option value={2}>⭐⭐ (2)</option>
                  <option value={1}>⭐ (1)</option>
                </select>
              </div>
            </div>

            <div style={{marginTop: '1rem'}}>
              <label className="gold-accent" style={{display: 'block', marginBottom: '0.5rem'}}>Optional Notes</label>
              <textarea
                className="luxury-input"
                rows={3}
                placeholder="Share tasting notes, aromas, roast impressions..."
                value={comments[item.id] ?? ''}
                onChange={(e) => handleCommentChange(item.id, e.target.value)}
              />
            </div>
          </div>
        ))}

        <div style={{display: 'flex', gap: '1rem', marginTop: '2rem', flexWrap: 'wrap'}}>
          <button
            type="submit"
            className="luxury-button"
            style={{fontSize: '1.1rem', padding: '1rem 2rem'}}
            disabled={submitting}
          >
            {submitting ? 'Submitting Ratings…' : 'Submit Ratings'}
          </button>
          <button
            type="button"
            className="luxury-button-secondary"
            style={{fontSize: '1.1rem', padding: '1rem 2rem'}}
            onClick={handleSkip}
            disabled={submitting}
          >
            Skip for now
          </button>
        </div>
      </form>
    </div>
  );
};

function App() {
  const [currentUser, setCurrentUser] = useState(() => getActiveUserFromStorage());

  const handleAuthChange = (user) => {
    if (user) {
      const normalizedUser = { ...user, role: user.role || 'customer' };
      saveActiveUserToStorage(normalizedUser);
      currentActiveUser = normalizedUser;
      setCurrentUser(normalizedUser);
    } else {
      clearActiveUserFromStorage();
      currentActiveUser = null;
      setCurrentUser(null);
    }
  };

  const handleLogout = () => {
    handleAuthChange(null);
  };

const renderWithLayout = (component) => (
    <PageWrapper currentUser={currentUser}>
      {component}
    </PageWrapper>
  );

  const defaultLanding = currentUser?.role === 'admin' ? '/admin' : '/experience';

  return (
    <Router>
      <Routes>
        {!currentUser ? (
          <>
            <Route path="/" element={renderWithLayout(<Home currentUser={null} />)} />
            <Route path="/auth" element={renderWithLayout(<AuthLandingPage />)} />
            <Route path="/login" element={<LoginPage onLogin={handleAuthChange} />} />
            <Route path="/admin-login" element={<AdminLoginPage onLogin={handleAuthChange} />} />
            <Route path="/signup" element={<SignupPage onSignup={handleAuthChange} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </>
        ) : (
          <>
            <Route path="/login" element={<Navigate to={defaultLanding} replace />} />
            <Route path="/admin-login" element={<Navigate to={defaultLanding} replace />} />
            <Route path="/signup" element={<Navigate to={defaultLanding} replace />} />
            <Route path="/auth" element={<Navigate to={defaultLanding} replace />} />
            <Route path="/" element={<Navigate to={defaultLanding} replace />} />
            <Route path="/admin" element={renderWithLayout(<AdminDashboard currentUser={currentUser} />)} />
            <Route path="/admin/wines" element={renderWithLayout(<AdminWineManager currentUser={currentUser} />)} />
            <Route path="/admin/coffees" element={renderWithLayout(<AdminCoffeeManager currentUser={currentUser} />)} />
            <Route path="/admin/orders" element={renderWithLayout(<AdminOrders currentUser={currentUser} />)} />
            <Route path="/experience" element={renderWithLayout(<Home currentUser={currentUser} />)} />
            <Route path="/choose" element={renderWithLayout(<ChooseProduct currentUser={currentUser} />)} />
            <Route path="/wines" element={renderWithLayout(<WineSearch currentUser={currentUser} />)} />
            <Route path="/coffees" element={renderWithLayout(<CoffeeSearch currentUser={currentUser} />)} />
            <Route path="/product/:id" element={renderWithLayout(<ProductDetail currentUser={currentUser} />)} />
            <Route path="/checkout" element={renderWithLayout(<Checkout currentUser={currentUser} />)} />
            <Route path="/payment" element={renderWithLayout(<PaymentPage currentUser={currentUser} />)} />
            <Route path="/rate" element={renderWithLayout(<RateOrder currentUser={currentUser} />)} />
            <Route path="/profile" element={renderWithLayout(<ProfilePage currentUser={currentUser} onLogout={handleLogout} />)} />
            <Route path="/demo" element={renderWithLayout(<DBMSDemo currentUser={currentUser} />)} />
            <Route path="*" element={<Navigate to={defaultLanding} replace />} />
          </>
        )}
      </Routes>
    </Router>
  );
}

const DBMSDemo = () => {
  const [results, setResults] = useState({});

  const testTriggers = async (type) => {
    try {
      const data = await demoAPI.testTrigger(type);
      setResults(prev => ({...prev, [`trigger_${type}`]: data}));
    } catch (err) {
      setResults(prev => ({...prev, [`trigger_${type}`]: {error: err.message}}));
    }
  };

  const testProcedure = async (type) => {
    try {
      const data = await demoAPI.procedure(type);
      setResults(prev => ({...prev, [`procedure_${type}`]: data}));
    } catch (err) {
      setResults(prev => ({...prev, [`procedure_${type}`]: {error: err.message}}));
    }
  };

  const runQuery = async (type) => {
    try {
      const data = await demoAPI.query(type);
      setResults(prev => ({...prev, [`query_${type}`]: data}));
    } catch (err) {
      setResults(prev => ({...prev, [`query_${type}`]: {error: err.message}}));
    }
  };

  return (
    <div style={{padding: '2rem', maxWidth: '1400px', margin: '0 auto'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem'}}>
        <h1 className="gold-accent" style={{fontSize: '2.5rem'}}>🎯 DBMS Features Demo</h1>
        <Link to="/" className="luxury-button-secondary">← HOME</Link>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', gap: '2rem'}}>
        {/* TRIGGERS */}
        <div className="luxury-card">
          <h2 className="gold-accent" style={{marginBottom: '1rem'}}>🔥 Triggers</h2>
          <p style={{color: '#f0ead6', marginBottom: '1rem'}}>Automatic database operations that execute before/after data changes</p>
          
          <div style={{display: 'grid', gap: '0.5rem', marginBottom: '1rem'}}>
            <button onClick={() => testTriggers('order-total')} className="luxury-button">
              1. Test Order Total Trigger
            </button>
            <small style={{color: ACCENT_TEXT}}>Automatically calculates order totals</small>
            
            <button onClick={() => testTriggers('rating-validation')} className="luxury-button">
              2. Test Rating Validation Trigger
            </button>
            <small style={{color: ACCENT_TEXT}}>Validates ratings between 1-5</small>
          </div>
          
          {results['trigger_order-total'] && (
            <div style={{backgroundColor: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', marginTop: '1rem'}}>
              <pre style={{color: '#f0ead6', fontSize: '0.9rem', overflow: 'auto'}}>
                {JSON.stringify(results['trigger_order-total'], null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* STORED PROCEDURES */}
        <div className="luxury-card">
          <h2 className="gold-accent" style={{marginBottom: '1rem'}}>⚙️ Stored Procedures</h2>
          <p style={{color: '#f0ead6', marginBottom: '1rem'}}>Pre-defined database operations for efficient data access</p>
          
          <div style={{display: 'grid', gap: '0.5rem'}}>
            <button onClick={() => testProcedure('wines')} className="luxury-button">Get Red Wines</button>
            <button onClick={() => testProcedure('coffees')} className="luxury-button">Get Light Roast Coffees</button>
            <button onClick={() => testProcedure('top-wines')} className="luxury-button">Get Top Rated Wines</button>
            <button onClick={() => testProcedure('top-coffees')} className="luxury-button">Get Top Rated Coffees</button>
          </div>
        </div>

        {/* QUERIES */}
        <div className="luxury-card">
          <h2 className="gold-accent" style={{marginBottom: '1rem'}}>📊 SQL Queries</h2>
          <p style={{color: '#f0ead6', marginBottom: '1rem'}}>Execute SELECT queries on database tables</p>
          
          <div style={{display: 'grid', gap: '0.5rem', marginBottom: '1rem'}}>
            <h3 className="gold-accent" style={{fontSize: '1.1rem', marginTop: '0.5rem'}}>Basic Queries:</h3>
            <button onClick={() => runQuery('all-wines')} className="luxury-button">Query All Wines</button>
            <button onClick={() => runQuery('all-coffees')} className="luxury-button">Query All Coffees</button>
            <button onClick={() => runQuery('orders')} className="luxury-button">Query Orders</button>
            <button onClick={() => runQuery('customers')} className="luxury-button">Query Customers</button>
            <button onClick={() => runQuery('reviews')} className="luxury-button">Query Reviews</button>
          </div>
          
          <div style={{display: 'grid', gap: '0.5rem', marginBottom: '1rem'}}>
            <h3 className="gold-accent" style={{fontSize: '1.1rem', marginTop: '0.5rem'}}>🔍 Nested Queries:</h3>
            <button onClick={() => runQuery('nested-wines-high-rated')} className="luxury-button">
              High-Rated Wines (Nested)
            </button>
            <small style={{color: ACCENT_TEXT}}>Wines with reviews rating &gt; 4</small>
            <button onClick={() => runQuery('nested-coffees-high-rated')} className="luxury-button">
              High-Rated Coffees (Nested)
            </button>
            <small style={{color: ACCENT_TEXT}}>Coffees with reviews rating &gt; 4</small>
          </div>
          
          <div style={{display: 'grid', gap: '0.5rem', marginBottom: '1rem'}}>
            <h3 className="gold-accent" style={{fontSize: '1.1rem', marginTop: '0.5rem'}}>🔗 Join Queries:</h3>
            <button onClick={() => runQuery('join-wines-reviews')} className="luxury-button">
              Wines with Reviews (Join)
            </button>
            <small style={{color: ACCENT_TEXT}}>Wines JOIN reviews with stats</small>
            <button onClick={() => runQuery('join-coffees-reviews')} className="luxury-button">
              Coffees with Reviews (Join)
            </button>
            <small style={{color: ACCENT_TEXT}}>Coffees JOIN reviews with stats</small>
          </div>
          
          <div style={{display: 'grid', gap: '0.5rem'}}>
            <h3 className="gold-accent" style={{fontSize: '1.1rem', marginTop: '0.5rem'}}>📈 Aggregate Queries:</h3>
            <button onClick={() => runQuery('aggregate-wine-stats')} className="luxury-button">
              Wine Statistics (Aggregate)
            </button>
            <small style={{color: ACCENT_TEXT}}>COUNT, AVG, MIN, MAX by type</small>
            <button onClick={() => runQuery('aggregate-coffee-stats')} className="luxury-button">
              Coffee Statistics (Aggregate)
            </button>
            <small style={{color: ACCENT_TEXT}}>COUNT, AVG, MIN, MAX by type</small>
          </div>
        </div>

        {/* OPERATIONS */}
        <div className="luxury-card">
          <h2 className="gold-accent" style={{marginBottom: '1rem'}}>✨ Database Operations</h2>
          <p style={{color: '#f0ead6', marginBottom: '1rem'}}>Add customers using stored procedures</p>
          
          <AddCustomerForm />
          <p style={{color: ACCENT_TEXT, fontSize: '0.9rem', marginTop: '1rem'}}>
            Also Available: Add Wine/Coffee from search pages
          </p>
        </div>
      </div>

      {/* Display Results */}
      {Object.keys(results).length > 0 && (
        <div className="luxury-card" style={{marginTop: '2rem'}}>
          <h2 className="gold-accent" style={{marginBottom: '1rem'}}>📋 Results</h2>
          {Object.entries(results).map(([key, value]) => (
            <div key={key} style={{marginBottom: '1rem'}}>
              <h3 style={{color: ACCENT_TEXT, fontSize: '1rem'}}>{key}:</h3>
              <pre style={{backgroundColor: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', color: '#f0ead6', fontSize: '0.85rem', overflow: 'auto', maxHeight: '300px'}}>
                {JSON.stringify(value, null, 2)}
              </pre>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const AddCustomerForm = () => {
  const [formData, setFormData] = useState({name: '', email: '', phone: '', address: ''});
  const [result, setResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await demoAPI.addCustomer(formData);
      setResult(data);
      if (data.customer_id) {
        setFormData({name: '', email: '', phone: '', address: ''});
      }
    } catch (err) {
      setResult({error: err.message});
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div style={{display: 'grid', gap: '0.5rem'}}>
        <input className="luxury-input" value={formData.name} 
          onChange={(e) => setFormData({...formData, name: e.target.value})}
          placeholder="Name" required />
        <input className="luxury-input" type="email" value={formData.email} 
          onChange={(e) => setFormData({...formData, email: e.target.value})}
          placeholder="Email" required />
        <input className="luxury-input" value={formData.phone} 
          onChange={(e) => setFormData({...formData, phone: e.target.value})}
          placeholder="Phone" />
        <input className="luxury-input" value={formData.address} 
          onChange={(e) => setFormData({...formData, address: e.target.value})}
          placeholder="Address" />
        <button type="submit" className="luxury-button">Add Customer</button>
      </div>
      {result && (
        <div style={{marginTop: '1rem', padding: '0.5rem', backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: '4px'}}>
          <pre style={{color: '#f0ead6', fontSize: '0.8rem'}}>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </form>
  );
};

const EMPTY_WINE_FORM = {
  name: '',
  type: '',
  region: '',
  country: '',
  vintage: '',
  price: '',
  alcohol_content: '',
  acidity_level: '',
  sweetness_level: '',
};

const AdminWineManager = ({ currentUser }) => {
  const navigate = useNavigate();
  const isAdmin = currentUser?.role === 'admin';
  const [wines, setWines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [formData, setFormData] = useState(() => ({ ...EMPTY_WINE_FORM }));
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCountry, setFilterCountry] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const getWineId = (wine) =>
    wine?.id ??
    wine?.wine_id ??
    wine?.WineID ??
    wine?.WineId ??
    wine?.ID ??
    wine?._id ??
    wine?.wineId;

  const fetchWines = async () => {
    setLoading(true);
    setError('');
    setStatusMessage('');
    try {
      const response = await wineAPI.getAll();
      setWines(response.wines || []);
    } catch (err) {
      setError(err.message || 'Unable to load wines from the API.');
      try {
        const fallback = await demoAPI.query('all-wines');
        setWines(fallback.data || []);
        setStatusMessage('Showing cached dataset while API is unavailable.');
      } catch (fallbackErr) {
        console.error('Fallback wine load failed:', fallbackErr);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAdmin) {
      navigate('/experience');
      return;
    }
    fetchWines();
  }, [isAdmin, navigate]);

  const resetForm = () => {
    setFormData({ ...EMPTY_WINE_FORM });
    setEditingId(null);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isAdmin) return;

    setSaving(true);
    setError('');
    try {
      const payload = Object.fromEntries(
        Object.entries(formData).map(([key, value]) => [key, value === '' ? null : value])
      );
      if (payload.price !== null && payload.price !== undefined) {
        const numericPrice = parseFloat(payload.price);
        payload.price = Number.isFinite(numericPrice) ? numericPrice : payload.price;
      }
      if (editingId) {
        await wineAPI.update(editingId, payload);
        setStatusMessage('Wine updated successfully.');
      } else {
        await wineAPI.create(payload);
        setStatusMessage('Wine added successfully.');
      }
      resetForm();
      await fetchWines();
    } catch (err) {
      setError(err.message || 'Unable to save wine details.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (wine) => {
    if (!isAdmin) return;
    const wineId = getWineId(wine);
    if (!wineId) {
      setError('Unable to identify this wine record.');
      return;
    }

    setEditingId(wineId);
    setFormData({
      name: wine.name || '',
      type: wine.type || '',
      region: wine.region || '',
      country: wine.country || '',
      vintage: wine.vintage || '',
      price: wine.price ?? '',
      alcohol_content: wine.alcohol_content ?? '',
      acidity_level: wine.acidity_level ?? '',
      sweetness_level: wine.sweetness_level ?? '',
    });
    setStatusMessage('');
  };

  const handleDelete = async (wine) => {
    if (!isAdmin) return;
    const wineId = getWineId(wine);
    if (!wineId) {
      setError('Unable to identify this wine record.');
      return;
    }
    if (!window.confirm(`Delete ${wine.name || 'this wine'}?`)) return;

    setSaving(true);
    setError('');
    try {
      await wineAPI.delete(wineId);
      setStatusMessage('Wine deleted successfully.');
      if (editingId === wineId) {
        resetForm();
      }
      await fetchWines();
    } catch (err) {
      setError(err.message || 'Unable to delete wine.');
    } finally {
      setSaving(false);
    }
  };

  if (!isAdmin) return null;

  // Get unique types and countries for filters
  const uniqueTypes = [...new Set(wines.map(w => w.type).filter(Boolean))].sort();
  const uniqueCountries = [...new Set(wines.map(w => w.country).filter(Boolean))].sort();

  // Filter and sort wines
  const filteredWines = wines
    .filter(wine => {
      // Search filter
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm || 
        (wine.name || '').toLowerCase().includes(searchLower) ||
        (wine.region || '').toLowerCase().includes(searchLower) ||
        (wine.type || '').toLowerCase().includes(searchLower) ||
        (wine.country || '').toLowerCase().includes(searchLower);
      
      // Type filter
      const matchesType = filterType === 'all' || wine.type === filterType;
      
      // Country filter
      const matchesCountry = filterCountry === 'all' || wine.country === filterCountry;
      
      return matchesSearch && matchesType && matchesCountry;
    })
    .sort((a, b) => {
      if (sortBy === 'recent') {
        // Sort by ID descending (higher ID = more recent)
        const idA = getWineId(a) || 0;
        const idB = getWineId(b) || 0;
        return idB - idA;
      }
      // Default: sort by name
      const nameA = (a?.name || '').toLowerCase();
      const nameB = (b?.name || '').toLowerCase();
      return nameA.localeCompare(nameB);
    });

  return (
    <div style={{padding: '2rem', maxWidth: '1200px', margin: '0 auto'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
        <div>
          <h1 className="gold-accent" style={{margin: 0, fontSize: '2.4rem'}}>🍷 Wine Inventory</h1>
          <p style={{color: '#f0ead6', marginTop: '0.5rem'}}>Add, update, or remove wines available to guests.</p>
        </div>
        <Link to="/admin" className="luxury-button-secondary">← Admin Hub</Link>
      </div>

      {(error || statusMessage) && (
        <div
          className="luxury-card"
          style={{
            marginBottom: '1.5rem',
            padding: '1rem',
            background: error ? 'rgba(220,53,69,0.18)' : 'rgba(25,135,84,0.18)',
            border: error ? '1px solid rgba(220,53,69,0.4)' : '1px solid rgba(25,135,84,0.4)'
          }}
        >
          <p style={{margin: 0, color: error ? '#ff6b6b' : '#63d471'}}>{error || statusMessage}</p>
        </div>
      )}

      {/* Search and Filter Bar */}
      <div className="luxury-card" style={{padding: '1.5rem', marginBottom: '1.5rem'}}>
        <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '1rem', alignItems: 'end'}}>
          <div>
            <label className="gold-accent" style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem'}}>
              🔍 Search Wines
            </label>
            <input
              type="text"
              className="luxury-input"
              placeholder="Search by name, region, type, country..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{width: '100%'}}
            />
          </div>
          <div>
            <label className="gold-accent" style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem'}}>
              Filter by Type
            </label>
            <select
              className="luxury-input"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              style={{width: '100%'}}
            >
              <option value="all">All Types</option>
              {uniqueTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="gold-accent" style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem'}}>
              Filter by Country
            </label>
            <select
              className="luxury-input"
              value={filterCountry}
              onChange={(e) => setFilterCountry(e.target.value)}
              style={{width: '100%'}}
            >
              <option value="all">All Countries</option>
              {uniqueCountries.map(country => (
                <option key={country} value={country}>{country}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="gold-accent" style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem'}}>
              Sort By
            </label>
            <select
              className="luxury-input"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{width: '100%'}}
            >
              <option value="name">Name (A-Z)</option>
              <option value="recent">Recently Added</option>
            </select>
          </div>
        </div>
        <div style={{marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <p style={{color: '#f0ead6', margin: 0, fontSize: '0.9rem'}}>
            Showing {filteredWines.length} of {wines.length} wines
          </p>
          {(searchTerm || filterType !== 'all' || filterCountry !== 'all') && (
            <button
              className="luxury-button-secondary"
              style={{padding: '0.4rem 1rem', fontSize: '0.85rem'}}
              onClick={() => {
                setSearchTerm('');
                setFilterType('all');
                setFilterCountry('all');
              }}
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem'}}>
        <div className="luxury-card" style={{padding: '1.5rem', maxHeight: '70vh', overflowY: 'auto'}}>
          {loading ? (
            <p style={{color: '#f0ead6'}}>Loading wines...</p>
          ) : filteredWines.length === 0 ? (
            <p style={{color: '#f0ead6'}}>No wines found. Add your first vintage using the form.</p>
          ) : (
            <table style={{width: '100%', borderCollapse: 'collapse', color: '#f0ead6'}}>
              <thead>
                <tr style={{background: 'rgba(255,255,255,0.05)'}}>
                  <th style={{padding: '0.75rem', textAlign: 'left'}}>Name</th>
                  <th style={{padding: '0.75rem', textAlign: 'left'}}>Type</th>
                  <th style={{padding: '0.75rem', textAlign: 'left'}}>Region</th>
                  <th style={{padding: '0.75rem', textAlign: 'left'}}>Price</th>
                  <th style={{padding: '0.75rem', textAlign: 'left'}}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredWines.map(wine => {
                  const wineId = getWineId(wine);
                  return (
                    <tr key={wineId || wine.name} style={{borderTop: '1px solid rgba(240,234,214,0.12)'}}>
                      <td style={{padding: '0.75rem'}}>
                        <strong className="gold-accent">{wine.name || 'Unnamed'}</strong>
                        <div style={{fontSize: '0.8rem', color: '#c6c6c6'}}>
                          {wine.vintage ? `Vintage ${wine.vintage}` : 'Vintage n/a'}
                        </div>
                      </td>
                      <td style={{padding: '0.75rem'}}>{wine.type || '—'}</td>
                      <td style={{padding: '0.75rem'}}>
                        {[wine.region, wine.country].filter(Boolean).join(', ') || '—'}
                      </td>
                      <td style={{padding: '0.75rem'}}>₹{parseFloat(wine.price || 0).toLocaleString('en-IN')}</td>
                      <td style={{padding: '0.75rem'}}>
                        <div style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap'}}>
                          <button
                            className="luxury-button-secondary"
                            style={{padding: '0.35rem 0.9rem'}}
                            onClick={() => handleEdit(wine)}
                          >
                            Edit
                          </button>
                          <button
                            className="luxury-button-secondary"
                            style={{padding: '0.35rem 0.9rem', background: 'rgba(220,53,69,0.35)', border: '1px solid rgba(220,53,69,0.45)'}}
                            onClick={() => handleDelete(wine)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <div className="luxury-card" style={{padding: '1.5rem'}}>
          <h2 className="gold-accent" style={{marginTop: 0, marginBottom: '1rem'}}>
            {editingId ? 'Update Wine' : 'Add New Wine'}
          </h2>
          <form onSubmit={handleSubmit} style={{display: 'grid', gap: '0.75rem'}}>
            <input
              className="luxury-input"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
            />
            <input
              className="luxury-input"
              placeholder="Type"
              value={formData.type}
              onChange={(e) => handleChange('type', e.target.value)}
            />
            <input
              className="luxury-input"
              placeholder="Region"
              value={formData.region}
              onChange={(e) => handleChange('region', e.target.value)}
            />
            <input
              className="luxury-input"
              placeholder="Country"
              value={formData.country}
              onChange={(e) => handleChange('country', e.target.value)}
            />
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '0.75rem'}}>
              <input
                className="luxury-input"
                placeholder="Vintage"
                value={formData.vintage}
                onChange={(e) => handleChange('vintage', e.target.value)}
              />
              <input
                className="luxury-input"
                placeholder="Alcohol %"
                value={formData.alcohol_content}
                onChange={(e) => handleChange('alcohol_content', e.target.value)}
              />
              <input
                className="luxury-input"
                placeholder="Price (₹)"
                value={formData.price}
                onChange={(e) => handleChange('price', e.target.value)}
              />
            </div>
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '0.75rem'}}>
              <input
                className="luxury-input"
                placeholder="Acidity level"
                value={formData.acidity_level}
                onChange={(e) => handleChange('acidity_level', e.target.value)}
              />
              <input
                className="luxury-input"
                placeholder="Sweetness level"
                value={formData.sweetness_level}
                onChange={(e) => handleChange('sweetness_level', e.target.value)}
              />
            </div>
            <div style={{display: 'flex', gap: '0.75rem', marginTop: '0.5rem'}}>
              <button type="submit" className="luxury-button" disabled={saving}>
                {saving ? 'Saving…' : editingId ? 'Update Wine' : 'Add Wine'}
              </button>
              {editingId && (
                <button
                  type="button"
                  className="luxury-button-secondary"
                  onClick={resetForm}
                  disabled={saving}
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const EMPTY_COFFEE_FORM = {
  name: '',
  type: '',
  origin: '',
  country: '',
  roast_level: '',
  price: '',
  description: '',
  acidity_level: '',
};

const AdminCoffeeManager = ({ currentUser }) => {
  const navigate = useNavigate();
  const isAdmin = currentUser?.role === 'admin';
  const [coffees, setCoffees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [formData, setFormData] = useState(() => ({ ...EMPTY_COFFEE_FORM }));
  const [editingId, setEditingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterRoast, setFilterRoast] = useState('all');
  const [sortBy, setSortBy] = useState('name');

  const getCoffeeId = (coffee) =>
    coffee?.id ??
    coffee?.coffee_id ??
    coffee?.CoffeeID ??
    coffee?.CoffeeId ??
    coffee?.ID ??
    coffee?._id ??
    coffee?.coffeeId;

  const fetchCoffees = async () => {
    setLoading(true);
    setError('');
    setStatusMessage('');
    try {
      const response = await coffeeAPI.getAll();
      setCoffees(response.coffees || []);
    } catch (err) {
      setError(err.message || 'Unable to load coffees from the API.');
      try {
        const fallback = await demoAPI.query('all-coffees');
        setCoffees(fallback.data || []);
        setStatusMessage('Showing cached dataset while API is unavailable.');
      } catch (fallbackErr) {
        console.error('Fallback coffee load failed:', fallbackErr);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAdmin) {
      navigate('/experience');
      return;
    }
    fetchCoffees();
  }, [isAdmin, navigate]);

  const resetForm = () => {
    setFormData({ ...EMPTY_COFFEE_FORM });
    setEditingId(null);
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!isAdmin) return;

    setSaving(true);
    setError('');
    try {
      const payload = Object.fromEntries(
        Object.entries(formData).map(([key, value]) => [key, value === '' ? null : value])
      );
      if (payload.price !== null && payload.price !== undefined) {
        const numericPrice = parseFloat(payload.price);
        payload.price = Number.isFinite(numericPrice) ? numericPrice : payload.price;
      }
      if (editingId) {
        await coffeeAPI.update(editingId, payload);
        setStatusMessage('Coffee updated successfully.');
      } else {
        await coffeeAPI.create(payload);
        setStatusMessage('Coffee added successfully.');
      }
      resetForm();
      await fetchCoffees();
    } catch (err) {
      setError(err.message || 'Unable to save coffee details.');
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (coffee) => {
    if (!isAdmin) return;
    const coffeeId = getCoffeeId(coffee);
    if (!coffeeId) {
      setError('Unable to identify this coffee record.');
      return;
    }

    setEditingId(coffeeId);
    setFormData({
      name: coffee.name || '',
      type: coffee.type || '',
      origin: coffee.origin || '',
      country: coffee.country || '',
      roast_level: coffee.roast_level || '',
      price: coffee.price ?? '',
      description: coffee.description ?? '',
      acidity_level: coffee.acidity_level ?? '',
    });
    setStatusMessage('');
  };

  const handleDelete = async (coffee) => {
    if (!isAdmin) return;
    const coffeeId = getCoffeeId(coffee);
    if (!coffeeId) {
      setError('Unable to identify this coffee record.');
      return;
    }
    if (!window.confirm(`Delete ${coffee.name || 'this coffee'}?`)) return;

    setSaving(true);
    setError('');
    try {
      await coffeeAPI.delete(coffeeId);
      setStatusMessage('Coffee deleted successfully.');
      if (editingId === coffeeId) {
        resetForm();
      }
      await fetchCoffees();
    } catch (err) {
      setError(err.message || 'Unable to delete coffee.');
    } finally {
      setSaving(false);
    }
  };

  if (!isAdmin) return null;

  // Get unique types and roast levels for filters
  const uniqueTypes = [...new Set(coffees.map(c => c.type).filter(Boolean))].sort();
  const uniqueRoasts = [...new Set(coffees.map(c => c.roast_level).filter(Boolean))].sort();

  // Filter and sort coffees
  const filteredCoffees = coffees
    .filter(coffee => {
      // Search filter
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch = !searchTerm || 
        (coffee.name || '').toLowerCase().includes(searchLower) ||
        (coffee.origin || '').toLowerCase().includes(searchLower) ||
        (coffee.type || '').toLowerCase().includes(searchLower) ||
        (coffee.country || '').toLowerCase().includes(searchLower);
      
      // Type filter
      const matchesType = filterType === 'all' || coffee.type === filterType;
      
      // Roast level filter
      const matchesRoast = filterRoast === 'all' || coffee.roast_level === filterRoast;
      
      return matchesSearch && matchesType && matchesRoast;
    })
    .sort((a, b) => {
      if (sortBy === 'recent') {
        // Sort by ID descending (higher ID = more recent)
        const idA = getCoffeeId(a) || 0;
        const idB = getCoffeeId(b) || 0;
        return idB - idA;
      }
      // Default: sort by name
      const nameA = (a?.name || '').toLowerCase();
      const nameB = (b?.name || '').toLowerCase();
      return nameA.localeCompare(nameB);
    });

  return (
    <div style={{padding: '2rem', maxWidth: '1200px', margin: '0 auto'}}>
      <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem'}}>
        <div>
          <h1 className="gold-accent" style={{margin: 0, fontSize: '2.4rem'}}>☕ Coffee Inventory</h1>
          <p style={{color: '#f0ead6', marginTop: '0.5rem'}}>Manage the roastery menu served to customers.</p>
        </div>
        <Link to="/admin" className="luxury-button-secondary">← Admin Hub</Link>
      </div>

      {(error || statusMessage) && (
        <div
          className="luxury-card"
          style={{
            marginBottom: '1.5rem',
            padding: '1rem',
            background: error ? 'rgba(220,53,69,0.18)' : 'rgba(25,135,84,0.18)',
            border: error ? '1px solid rgba(220,53,69,0.4)' : '1px solid rgba(25,135,84,0.4)'
          }}
        >
          <p style={{margin: 0, color: error ? '#ff6b6b' : '#63d471'}}>{error || statusMessage}</p>
        </div>
      )}

      {/* Search and Filter Bar */}
      <div className="luxury-card" style={{padding: '1.5rem', marginBottom: '1.5rem'}}>
        <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '1rem', alignItems: 'end'}}>
          <div>
            <label className="gold-accent" style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem'}}>
              🔍 Search Coffees
            </label>
            <input
              type="text"
              className="luxury-input"
              placeholder="Search by name, origin, type, country..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{width: '100%'}}
            />
          </div>
          <div>
            <label className="gold-accent" style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem'}}>
              Filter by Type
            </label>
            <select
              className="luxury-input"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              style={{width: '100%'}}
            >
              <option value="all">All Types</option>
              {uniqueTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="gold-accent" style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem'}}>
              Filter by Roast
            </label>
            <select
              className="luxury-input"
              value={filterRoast}
              onChange={(e) => setFilterRoast(e.target.value)}
              style={{width: '100%'}}
            >
              <option value="all">All Roasts</option>
              {uniqueRoasts.map(roast => (
                <option key={roast} value={roast}>{roast}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="gold-accent" style={{display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem'}}>
              Sort By
            </label>
            <select
              className="luxury-input"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{width: '100%'}}
            >
              <option value="name">Name (A-Z)</option>
              <option value="recent">Recently Added</option>
            </select>
          </div>
        </div>
        <div style={{marginTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
          <p style={{color: '#f0ead6', margin: 0, fontSize: '0.9rem'}}>
            Showing {filteredCoffees.length} of {coffees.length} coffees
          </p>
          {(searchTerm || filterType !== 'all' || filterRoast !== 'all') && (
            <button
              className="luxury-button-secondary"
              style={{padding: '0.4rem 1rem', fontSize: '0.85rem'}}
              onClick={() => {
                setSearchTerm('');
                setFilterType('all');
                setFilterRoast('all');
              }}
            >
              Clear Filters
            </button>
          )}
        </div>
      </div>

      <div style={{display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem'}}>
        <div className="luxury-card" style={{padding: '1.5rem', maxHeight: '70vh', overflowY: 'auto'}}>
          {loading ? (
            <p style={{color: '#f0ead6'}}>Loading coffees...</p>
          ) : filteredCoffees.length === 0 ? (
            <p style={{color: '#f0ead6'}}>No coffees found. Add your first roast using the form.</p>
          ) : (
            <table style={{width: '100%', borderCollapse: 'collapse', color: '#f0ead6'}}>
              <thead>
                <tr style={{background: 'rgba(255,255,255,0.05)'}}>
                  <th style={{padding: '0.75rem', textAlign: 'left'}}>Name</th>
                  <th style={{padding: '0.75rem', textAlign: 'left'}}>Roast</th>
                  <th style={{padding: '0.75rem', textAlign: 'left'}}>Origin</th>
                  <th style={{padding: '0.75rem', textAlign: 'left'}}>Price</th>
                  <th style={{padding: '0.75rem', textAlign: 'left'}}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCoffees.map(coffee => {
                  const coffeeId = getCoffeeId(coffee);
                  return (
                    <tr key={coffeeId || coffee.name} style={{borderTop: '1px solid rgba(240,234,214,0.12)'}}>
                      <td style={{padding: '0.75rem'}}>
                        <strong className="gold-accent">{coffee.name || 'Unnamed'}</strong>
                        <div style={{fontSize: '0.8rem', color: '#c6c6c6'}}>
                          {coffee.type || 'Type n/a'}
                        </div>
                      </td>
                      <td style={{padding: '0.75rem'}}>
                        {coffee.roast_level ? coffee.roast_level.replace(/-/g, ' ') : '—'}
                      </td>
                      <td style={{padding: '0.75rem'}}>
                        {[coffee.origin, coffee.country].filter(Boolean).join(', ') || '—'}
                      </td>
                      <td style={{padding: '0.75rem'}}>₹{parseFloat(coffee.price || 0).toLocaleString('en-IN')}</td>
                      <td style={{padding: '0.75rem'}}>
                        <div style={{display: 'flex', gap: '0.5rem', flexWrap: 'wrap'}}>
                          <button
                            className="luxury-button-secondary"
                            style={{padding: '0.35rem 0.9rem'}}
                            onClick={() => handleEdit(coffee)}
                          >
                            Edit
                          </button>
                          <button
                            className="luxury-button-secondary"
                            style={{padding: '0.35rem 0.9rem', background: 'rgba(220,53,69,0.35)', border: '1px solid rgba(220,53,69,0.45)'}}
                            onClick={() => handleDelete(coffee)}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <div className="luxury-card" style={{padding: '1.5rem'}}>
          <h2 className="gold-accent" style={{marginTop: 0, marginBottom: '1rem'}}>
            {editingId ? 'Update Coffee' : 'Add New Coffee'}
          </h2>
          <form onSubmit={handleSubmit} style={{display: 'grid', gap: '0.75rem'}}>
            <input
              className="luxury-input"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              required
            />
            <input
              className="luxury-input"
              placeholder="Coffee type"
              value={formData.type}
              onChange={(e) => handleChange('type', e.target.value)}
            />
            <input
              className="luxury-input"
              placeholder="Origin / Region"
              value={formData.origin}
              onChange={(e) => handleChange('origin', e.target.value)}
            />
            <input
              className="luxury-input"
              placeholder="Country"
              value={formData.country}
              onChange={(e) => handleChange('country', e.target.value)}
            />
            <div style={{display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '0.75rem'}}>
              <input
                className="luxury-input"
                placeholder="Roast level"
                value={formData.roast_level}
                onChange={(e) => handleChange('roast_level', e.target.value)}
              />
              <input
                className="luxury-input"
                placeholder="Acidity"
                value={formData.acidity_level}
                onChange={(e) => handleChange('acidity_level', e.target.value)}
              />
              <input
                className="luxury-input"
                placeholder="Price (₹)"
                value={formData.price}
                onChange={(e) => handleChange('price', e.target.value)}
              />
            </div>
            <textarea
              className="luxury-input"
              placeholder="Tasting notes / description"
              rows={4}
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              style={{resize: 'vertical'}}
            />
            <div style={{display: 'flex', gap: '0.75rem', marginTop: '0.5rem'}}>
              <button type="submit" className="luxury-button" disabled={saving}>
                {saving ? 'Saving…' : editingId ? 'Update Coffee' : 'Add Coffee'}
              </button>
              {editingId && (
                <button
                  type="button"
                  className="luxury-button-secondary"
                  onClick={resetForm}
                  disabled={saving}
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const AdminOrders = ({ currentUser }) => {
  const navigate = useNavigate();
  const isAdmin = currentUser?.role === 'admin';
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [orderQuery, setOrderQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  useEffect(() => {
    if (!isAdmin) {
      navigate('/experience');
      return;
    }

    let active = true;
    const fetchOrders = async () => {
      setLoading(true);
      setError('');
      try {
        const adminIdentity = JSON.stringify({ id: currentUser?.id, role: currentUser?.role });
        const data = await orderAPI.getAll({
          headers: {
            'X-Admin-Identity': adminIdentity
          }
        });
        if (active) {
          if (currentUser?.role !== 'admin') {
            setError('Admin privileges required.');
            setOrders([]);
            setSelectedOrder(null);
          } else {
            const loadedOrders = data.orders || [];
            setOrders(loadedOrders);
            if (loadedOrders.length > 0) {
              setSelectedOrder(prev => {
                if (!prev) return loadedOrders[0];
                const stillExists = loadedOrders.find(order => order.id === prev.id);
                return stillExists || loadedOrders[0];
              });
            } else {
              setSelectedOrder(null);
            }
          }
        }
      } catch (err) {
        if (active) {
          setError(err.message || 'Unable to load orders.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchOrders();
    return () => {
      active = false;
    };
  }, [isAdmin, navigate, currentUser]);

  const formatDate = (value) => {
    if (!value) return 'N/A';
    try {
      return new Date(value).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' });
    } catch (err) {
      return value;
    }
  };

  const formatCurrency = (value) => {
    const amount = parseFloat(value || 0);
    return `₹${Number.isFinite(amount) ? amount.toLocaleString('en-IN') : '0'}`;
  };

  const normalizedQuery = orderQuery.trim().toLowerCase();
  const filteredOrders = normalizedQuery
    ? orders.filter(order => {
        const haystack = [
          order.id,
          order.customer?.name,
          order.customer?.email,
          order.shipping?.city,
          order.shipping?.state,
          order.payment?.method,
          order.payment?.status,
        ];
        return haystack.some(value =>
          value ? String(value).toLowerCase().includes(normalizedQuery) : false
        );
      })
    : orders;

  useEffect(() => {
    if (!selectedOrder) {
      if (filteredOrders.length > 0) {
        setSelectedOrder(filteredOrders[0]);
      }
      return;
    }
    const stillVisible = filteredOrders.some(order => order.id === selectedOrder.id);
    if (!stillVisible) {
      setSelectedOrder(filteredOrders[0] ?? null);
    }
  }, [filteredOrders, selectedOrder]);

  if (!isAdmin) return null;

  return (
    <div style={{padding: '2rem 1.5rem', maxWidth: '1250px', margin: '0 auto'}}>
      <div className="luxury-card" style={{padding: '2rem', marginBottom: '2rem'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem'}}>
          <div>
        <h1 className="gold-accent" style={{fontSize: '2.4rem', marginBottom: '0.5rem'}}>📦 Orders & Fulfilment</h1>
            <p style={{color: '#f0ead6', margin: 0}}>Review customer activity and delivery readiness.</p>
          </div>
          <Link to="/admin" className="luxury-button-secondary">← Admin Hub</Link>
        </div>
      </div>

      {loading ? (
        <div className="luxury-card" style={{padding: '2rem', textAlign: 'center'}}>
          <p style={{color: '#f0ead6', margin: 0}}>Loading orders...</p>
        </div>
      ) : error ? (
        <div className="luxury-card" style={{padding: '2rem', border: '1px solid rgba(220,53,69,0.4)', background: 'rgba(220,53,69,0.15)'}}>
          <p style={{color: '#ff6b6b', margin: 0}}>{error}</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="luxury-card" style={{padding: '2rem', textAlign: 'center'}}>
          <h3 className="gold-accent" style={{marginBottom: '0.5rem'}}>No orders yet</h3>
          <p style={{color: '#f0ead6', margin: 0}}>Check back after your first fulfilment run.</p>
        </div>
      ) : (
        <>
          <div className="luxury-card" style={{padding: '1rem 1.5rem', marginBottom: '1.5rem'}}>
            <label className="gold-accent" style={{display: 'block', marginBottom: '0.5rem'}}>Search orders</label>
            <input
              className="luxury-input"
              placeholder="Search by order #, customer, email, city, or payment status"
              value={orderQuery}
              onChange={(e) => setOrderQuery(e.target.value)}
            />
          </div>

        <div className="luxury-card" style={{padding: '0', overflow: 'hidden'}}>
          <div style={{overflowX: 'auto'}}>
            <table style={{width: '100%', borderCollapse: 'collapse', color: '#f0ead6'}}>
              <thead>
                <tr style={{background: 'rgba(255,255,255,0.06)'}}>
                  <th style={{padding: '1rem', textAlign: 'left'}}>Order #</th>
                  <th style={{padding: '1rem', textAlign: 'left'}}>Customer</th>
                  <th style={{padding: '1rem', textAlign: 'left'}}>Selections</th>
                  <th style={{padding: '1rem', textAlign: 'left'}}>Total</th>
                  <th style={{padding: '1rem', textAlign: 'left'}}>Payment</th>
                  <th style={{padding: '1rem', textAlign: 'left'}}>Placed</th>
                </tr>
              </thead>
              <tbody>
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={6} style={{padding: '1.5rem', textAlign: 'center', color: '#f0ead6'}}>
                        No orders match your search.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map(order => {
                      const isSelected = selectedOrder?.id === order.id;
                      return (
                        <tr
                          key={order.id}
                          onClick={() => setSelectedOrder(order)}
                          style={{
                            borderTop: '1px solid rgba(240,234,214,0.12)',
                            background: isSelected ? 'rgba(212,175,55,0.08)' : 'transparent',
                            cursor: 'pointer'
                          }}
                        >
                    <td style={{padding: '1rem'}}>
                      <strong className="gold-accent">#{order.id}</strong>
                      <div style={{fontSize: '0.85rem', color: ACCENT_TEXT}}>
                              {[order.shipping?.city, order.shipping?.state].filter(Boolean).join(', ')}
                      </div>
                    </td>
                    <td style={{padding: '1rem'}}>
                      <div>{order.customer?.name || 'N/A'}</div>
                      <small style={{color: '#f0ead6'}}>{order.customer?.email}</small>
                    </td>
                    <td style={{padding: '1rem'}}>
                      <ul style={{margin: 0, paddingLeft: '1.1rem'}}>
                        {order.items?.map((item, index) => (
                                <li key={`${order.id}-${index}`}>
                                  {item.name} • {item.category} × {item.quantity || 1}
                                </li>
                        ))}
                      </ul>
                    </td>
                          <td style={{padding: '1rem'}}>{formatCurrency(order.total_amount || order.total)}</td>
                    <td style={{padding: '1rem'}}>
                      <div>{(order.payment?.method || 'N/A').toUpperCase()}</div>
                      <small style={{color: '#f0ead6'}}>{(order.payment?.status || 'pending').toUpperCase()}</small>
                    </td>
                    <td style={{padding: '1rem'}}>{formatDate(order.order_date)}</td>
                  </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {selectedOrder && (
            <div className="luxury-card" style={{marginTop: '1.5rem', padding: '1.75rem'}}>
              <div style={{display: 'flex', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem'}}>
                <div>
                  <h2 className="gold-accent" style={{margin: 0}}>Order #{selectedOrder.id}</h2>
                  <p style={{color: '#f0ead6', margin: 0}}>Placed {formatDate(selectedOrder.order_date)}</p>
                </div>
                <div style={{textAlign: 'right'}}>
                  <p style={{color: ACCENT_TEXT, margin: 0, fontWeight: 600}}>
                    {formatCurrency(selectedOrder.total_amount || selectedOrder.total)}
                  </p>
                  <small style={{color: '#f0ead6'}}>
                    {(selectedOrder.payment?.method || 'N/A').toUpperCase()} • {(selectedOrder.payment?.status || 'pending').toUpperCase()}
                  </small>
                </div>
              </div>

              <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.2rem', marginBottom: '1.5rem'}}>
                <div>
                  <h3 className="gold-accent" style={{marginBottom: '0.5rem'}}>Customer</h3>
                  <p style={{color: '#f0ead6', margin: 0}}>
                    {selectedOrder.customer?.name || 'N/A'}
                    <br />
                    <span style={{color: '#c6c6c6'}}>{selectedOrder.customer?.email}</span>
                    {selectedOrder.customer?.phone && (
                      <>
                        <br />
                        <span style={{color: '#c6c6c6'}}>{selectedOrder.customer.phone}</span>
                      </>
                    )}
                  </p>
                </div>
                <div>
                  <h3 className="gold-accent" style={{marginBottom: '0.5rem'}}>Shipping</h3>
                  <p style={{color: '#f0ead6', margin: 0}}>
                    {selectedOrder.shipping?.address_line1 && <>{selectedOrder.shipping.address_line1}<br /></>}
                    {selectedOrder.shipping?.address_line2 && <>{selectedOrder.shipping.address_line2}<br /></>}
                    {[selectedOrder.shipping?.city, selectedOrder.shipping?.state, selectedOrder.shipping?.postal_code]
                      .filter(Boolean)
                      .join(', ')}
                    <br />
                    {selectedOrder.shipping?.country}
                  </p>
                </div>
                <div>
                  <h3 className="gold-accent" style={{marginBottom: '0.5rem'}}>Delivery Notes</h3>
                  <p style={{color: '#f0ead6', margin: 0}}>
                    {selectedOrder.shipping?.instructions || 'No special instructions provided.'}
                  </p>
                </div>
              </div>

              <div>
                <h3 className="gold-accent" style={{marginBottom: '0.75rem'}}>Items</h3>
                <div style={{overflowX: 'auto'}}>
                  <table style={{width: '100%', borderCollapse: 'collapse', color: '#f0ead6'}}>
                    <thead>
                      <tr style={{background: 'rgba(255,255,255,0.05)'}}>
                        <th style={{padding: '0.75rem', textAlign: 'left'}}>Item</th>
                        <th style={{padding: '0.75rem', textAlign: 'left'}}>Category</th>
                        <th style={{padding: '0.75rem', textAlign: 'center'}}>Qty</th>
                        <th style={{padding: '0.75rem', textAlign: 'right'}}>Price</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(selectedOrder.items || []).map((item, index) => (
                        <tr key={`${selectedOrder.id}-${index}`} style={{borderTop: '1px solid rgba(240,234,214,0.12)'}}>
                          <td style={{padding: '0.75rem'}}>{item.name}</td>
                          <td style={{padding: '0.75rem'}}>{item.category}</td>
                          <td style={{padding: '0.75rem', textAlign: 'center'}}>{item.quantity || 1}</td>
                          <td style={{padding: '0.75rem', textAlign: 'right'}}>
                            {item.price ? formatCurrency(item.price) : '—'}
                          </td>
                        </tr>
                ))}
              </tbody>
            </table>
                </div>
          </div>
        </div>
          )}
        </>
      )}
    </div>
  );
};

export default App;
