// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

export const API_ENDPOINTS = {
  // Base API
  BASE: API_BASE_URL,
  HEALTH: `${API_BASE_URL}/health`,
  
  // Wines
  WINES: `${API_BASE_URL}/api/wines`,
  WINE_BY_ID: (id) => `${API_BASE_URL}/api/wines/${id}`,
  WINE_REVIEWS: (id) => `${API_BASE_URL}/api/wines/${id}/reviews`,
  WINE_TYPES: `${API_BASE_URL}/api/wines/types`,
  WINE_REGIONS: `${API_BASE_URL}/api/wines/regions`,
  TOP_RATED_WINES: `${API_BASE_URL}/api/wines/top-rated`,
  
  // Coffees
  COFFEES: `${API_BASE_URL}/api/coffees`,
  COFFEE_BY_ID: (id) => `${API_BASE_URL}/api/coffees/${id}`,
  COFFEE_REVIEWS: (id) => `${API_BASE_URL}/api/coffees/${id}/reviews`,
  COFFEE_TYPES: `${API_BASE_URL}/api/coffees/types`,
  COFFEE_ORIGINS: `${API_BASE_URL}/api/coffees/origins`,
  ROAST_LEVELS: `${API_BASE_URL}/api/coffees/roast-levels`,
  TOP_RATED_COFFEES: `${API_BASE_URL}/api/coffees/top-rated`,
  
  // Reviews
  REVIEWS: `${API_BASE_URL}/api/reviews`,
  
  // Users
  USERS: `${API_BASE_URL}/api/users`,
  USER_BY_ID: (id) => `${API_BASE_URL}/api/users/${id}`,
  USERS_REGISTER: `${API_BASE_URL}/api/users/register`,
  USERS_LOGIN: `${API_BASE_URL}/api/users/login`,
  USER_PREFERENCES: (id) => `${API_BASE_URL}/api/users/${id}/preferences`,
  
  // Pairings
  PAIRINGS: `${API_BASE_URL}/api/pairings`,
  
  // Orders & checkout
  ORDERS: `${API_BASE_URL}/api/orders`,
  ORDERS_BY_CUSTOMER: (userId) => `${API_BASE_URL}/api/orders/customer/${userId}`,
  ORDER_PAYMENT_PROFILE: (userId) => `${API_BASE_URL}/api/orders/payment-profile/${userId}`,
  
  // Demo/Queries
  QUERY: (type) => `${API_BASE_URL}/api/queries/${type}`,
  PROCEDURE: (type) => `${API_BASE_URL}/api/procedures/${type}`,
  TRIGGER_TEST: (type) => `${API_BASE_URL}/api/test/triggers/${type}`,
  ADD_CUSTOMER: `${API_BASE_URL}/api/operations/add-customer`,
};

export default API_ENDPOINTS;

