// API Configuration for different environments
const API_CONFIG = {
  development: {
    baseURL: 'http://localhost:5000',
  },
  production: {
    baseURL: 'https://latent-kk5m.onrender.com',
  }
};

// Get current environment
const isDevelopment = process.env.NODE_ENV === 'development' || window.location.hostname === 'localhost';

// Export the appropriate base URL
export const API_BASE_URL = isDevelopment ? API_CONFIG.development.baseURL : API_CONFIG.production.baseURL;

// For debugging
console.log('Environment:', isDevelopment ? 'development' : 'production');
console.log('API Base URL:', API_BASE_URL);

// API endpoints
export const API_ENDPOINTS = {
  fileUpload: `${API_BASE_URL}/fileupload`,
  allVideos: `${API_BASE_URL}/allVideos`,
  rate: `${API_BASE_URL}/rate`,
  getVid: `${API_BASE_URL}/getVid`,
  getRankings: `${API_BASE_URL}/getRankings`,
};

// Log all endpoints for debugging
console.log('API Endpoints:', API_ENDPOINTS);

export default API_CONFIG; 