const hasWindow = typeof window !== 'undefined';

const safeParse = (value, fallback = null) => {
  if (!value) return fallback;
  try {
    return JSON.parse(value);
  } catch (error) {
    console.error('Failed to parse localStorage value:', error);
    return fallback;
  }
};

export const getActiveUserFromStorage = () => {
  if (!hasWindow || !window.localStorage) {
    return null;
  }
  const stored = window.localStorage.getItem('activeUser');
  return safeParse(stored, null);
};

export const saveActiveUserToStorage = (user) => {
  if (!hasWindow || !window.localStorage || !user) {
    return;
  }
  try {
    window.localStorage.setItem('activeUser', JSON.stringify(user));
  } catch (error) {
    console.error('Failed to save active user to storage:', error);
  }
};

export const clearActiveUserFromStorage = () => {
  if (!hasWindow || !window.localStorage) {
    return;
  }
  try {
    window.localStorage.removeItem('activeUser');
  } catch (error) {
    console.error('Failed to clear active user from storage:', error);
  }
};

const buildScopedKey = (baseKey, user = getActiveUserFromStorage()) => {
  const identifier = user?.id ? user.id : 'guest';
  return `${baseKey}_${identifier}`;
};

export const getCartStorageKey = (user) => buildScopedKey('cart', user);

export const getLastOrderStorageKey = (user) => buildScopedKey('lastOrderItems', user);

export const getOrderHistoryStorageKey = (user) => buildScopedKey('orderHistory', user);

export const loadFromStorage = (key, fallback = null) => {
  if (!hasWindow || !window.localStorage) {
    return fallback;
  }
  const stored = window.localStorage.getItem(key);
  return safeParse(stored, fallback);
};

export const saveToStorage = (key, value) => {
  if (!hasWindow || !window.localStorage) {
    return;
  }
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Failed to save key ${key} to storage:`, error);
  }
};

export const removeFromStorage = (key) => {
  if (!hasWindow || !window.localStorage) {
    return;
  }
  try {
    window.localStorage.removeItem(key);
  } catch (error) {
    console.error(`Failed to remove key ${key} from storage:`, error);
  }
};

