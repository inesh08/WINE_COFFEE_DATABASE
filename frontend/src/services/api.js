// API Service - Centralized API calls
import API_ENDPOINTS from '../config/api';

/**
 * Generic fetch wrapper with error handling
 */
const apiCall = async (endpoint, options = {}) => {
  try {
    const response = await fetch(endpoint, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || `HTTP error! status: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
};

// Wine API
export const wineAPI = {
  getAll: () => apiCall(API_ENDPOINTS.WINES),
  getById: (id) => apiCall(API_ENDPOINTS.WINE_BY_ID(id)),
  getReviews: (id) => apiCall(API_ENDPOINTS.WINE_REVIEWS(id)),
  getTypes: () => apiCall(API_ENDPOINTS.WINE_TYPES),
  getRegions: () => apiCall(API_ENDPOINTS.WINE_REGIONS),
  getTopRated: (limit = 10) => apiCall(`${API_ENDPOINTS.TOP_RATED_WINES}?limit=${limit}`),
  create: (wineData) => apiCall(API_ENDPOINTS.WINES, {
    method: 'POST',
    body: JSON.stringify(wineData),
  }),
  update: (id, wineData) => apiCall(API_ENDPOINTS.WINE_BY_ID(id), {
    method: 'PUT',
    body: JSON.stringify(wineData),
  }),
  delete: (id) => apiCall(API_ENDPOINTS.WINE_BY_ID(id), {
    method: 'DELETE',
  }),
  search: (filters) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params.append(key, value);
      }
    });
    return apiCall(`${API_ENDPOINTS.WINES}?${params.toString()}`);
  },
};

// Coffee API
export const coffeeAPI = {
  getAll: () => apiCall(API_ENDPOINTS.COFFEES),
  getById: (id) => apiCall(API_ENDPOINTS.COFFEE_BY_ID(id)),
  getReviews: (id) => apiCall(API_ENDPOINTS.COFFEE_REVIEWS(id)),
  getTypes: () => apiCall(API_ENDPOINTS.COFFEE_TYPES),
  getOrigins: () => apiCall(API_ENDPOINTS.COFFEE_ORIGINS),
  getRoastLevels: () => apiCall(API_ENDPOINTS.ROAST_LEVELS),
  getTopRated: (limit = 10) => apiCall(`${API_ENDPOINTS.TOP_RATED_COFFEES}?limit=${limit}`),
  create: (coffeeData) => apiCall(API_ENDPOINTS.COFFEES, {
    method: 'POST',
    body: JSON.stringify(coffeeData),
  }),
  update: (id, coffeeData) => apiCall(API_ENDPOINTS.COFFEE_BY_ID(id), {
    method: 'PUT',
    body: JSON.stringify(coffeeData),
  }),
  delete: (id) => apiCall(API_ENDPOINTS.COFFEE_BY_ID(id), {
    method: 'DELETE',
  }),
  search: (filters) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params.append(key, value);
      }
    });
    return apiCall(`${API_ENDPOINTS.COFFEES}?${params.toString()}`);
  },
};

// Review API
export const reviewAPI = {
  create: (reviewData) => apiCall(API_ENDPOINTS.REVIEWS, {
    method: 'POST',
    body: JSON.stringify(reviewData),
  }),
  getWineReviews: (wineId) => apiCall(API_ENDPOINTS.WINE_REVIEWS(wineId)),
  getCoffeeReviews: (coffeeId) => apiCall(API_ENDPOINTS.COFFEE_REVIEWS(coffeeId)),
  getWineRating: (wineId) => apiCall(`${API_ENDPOINTS.WINE_REVIEWS(wineId)}/rating`),
  getCoffeeRating: (coffeeId) => apiCall(`${API_ENDPOINTS.COFFEE_REVIEWS(coffeeId)}/rating`),
};

// Demo/Query API
export const demoAPI = {
  query: (type) => apiCall(API_ENDPOINTS.QUERY(type)),
  procedure: (type) => apiCall(API_ENDPOINTS.PROCEDURE(type)),
  testTrigger: (type) => apiCall(API_ENDPOINTS.TRIGGER_TEST(type)),
  addCustomer: (customerData) => apiCall(API_ENDPOINTS.ADD_CUSTOMER, {
    method: 'POST',
    body: JSON.stringify(customerData),
  }),
};

// Health check
export const healthCheck = () => apiCall(API_ENDPOINTS.HEALTH);

export default {
  wineAPI,
  coffeeAPI,
  demoAPI,
  healthCheck,
};

