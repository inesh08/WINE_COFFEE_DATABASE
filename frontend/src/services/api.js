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
    const message = error?.message || '';
    const networkFailure = error instanceof TypeError &&
      (
        message === 'Failed to fetch' ||
        message === 'Network request failed' ||
        message === 'Load failed' ||
        message === 'NetworkError when attempting to fetch resource.' ||
        message === 'fetch failed'
      );

    if (networkFailure) {
      const friendlyMessage = `Unable to reach the API server at ${API_ENDPOINTS.BASE}. ` +
        'Please confirm the backend is running and that this device can access it.';
      throw new Error(friendlyMessage);
    }

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

// Pairing API
export const pairingAPI = {
  getAll: (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        params.append(key, value);
      }
    });
    const queryString = params.toString();
    const endpoint = queryString
      ? `${API_ENDPOINTS.PAIRINGS}?${queryString}`
      : API_ENDPOINTS.PAIRINGS;
    return apiCall(endpoint);
  },
  getRecommendations: ({ wineId, coffeeId, useFrequent = true } = {}) => {
    const params = new URLSearchParams();
    if (wineId) {
      params.append('wine_id', wineId);
    }
    if (coffeeId) {
      params.append('coffee_id', coffeeId);
    }
    if (useFrequent !== undefined) {
      params.append('use_frequent', useFrequent);
    }

    if (!wineId && !coffeeId) {
      return Promise.reject(new Error('Provide wineId or coffeeId to get recommendations'));
    }

    return apiCall(`${API_ENDPOINTS.PAIRINGS}/recommendations?${params.toString()}`);
  },
};

// Order API
export const orderAPI = {
  create: (orderData, options = {}) => apiCall(API_ENDPOINTS.ORDERS, {
    method: 'POST',
    body: JSON.stringify(orderData),
    headers: options.headers,
  }),
  getAll: (options = {}) => apiCall(`${API_ENDPOINTS.ORDERS}/all`, options),
  getByUser: (userId) => apiCall(API_ENDPOINTS.ORDERS_BY_CUSTOMER(userId)),
  getPaymentProfile: (userId) => apiCall(API_ENDPOINTS.ORDER_PAYMENT_PROFILE(userId)),
};

// User API
export const userAPI = {
  register: (userData) => apiCall(API_ENDPOINTS.USERS_REGISTER, {
    method: 'POST',
    body: JSON.stringify(userData),
  }),
  login: (credentials) => apiCall(API_ENDPOINTS.USERS_LOGIN, {
    method: 'POST',
    body: JSON.stringify(credentials),
  }),
  getById: (id) => apiCall(API_ENDPOINTS.USER_BY_ID(id)),
  getPreferences: (id) => apiCall(API_ENDPOINTS.USER_PREFERENCES(id)),
  setPreference: (id, preference) => apiCall(API_ENDPOINTS.USER_PREFERENCES(id), {
    method: 'POST',
    body: JSON.stringify(preference),
  }),
  deletePreference: (id, preferenceType, key) => apiCall(`${API_ENDPOINTS.USER_PREFERENCES(id)}/${preferenceType}/${key}`, {
    method: 'DELETE',
  }),
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

const apiServices = {
  wineAPI,
  coffeeAPI,
  userAPI,
  pairingAPI,
  orderAPI,
  demoAPI,
  healthCheck,
};

export default apiServices;

