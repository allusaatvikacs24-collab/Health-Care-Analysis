const API_KEY_STORAGE_KEY = 'health_api_key';

export const apiKeyService = {
  // Store API key securely in localStorage
  setApiKey(apiKey) {
    localStorage.setItem(API_KEY_STORAGE_KEY, apiKey);
  },

  // Retrieve API key
  getApiKey() {
    return localStorage.getItem(API_KEY_STORAGE_KEY);
  },

  // Remove API key
  removeApiKey() {
    localStorage.removeItem(API_KEY_STORAGE_KEY);
  },

  // Check if API key exists
  hasApiKey() {
    return !!this.getApiKey();
  },

  // Validate API key format (basic validation)
  validateApiKey(apiKey) {
    return apiKey && apiKey.length >= 20 && /^[a-zA-Z0-9_-]+$/.test(apiKey);
  }
};