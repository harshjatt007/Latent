// API Configuration for different environments
const API_CONFIG = {
  development: {
    baseURL: 'http://localhost:5000',
  },
  production: {
    baseURL: process.env.REACT_APP_API_BASE_URL || 'https://latent-kk5m.onrender.com',
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
  BASE_URL: API_BASE_URL,
  fileUpload: `${API_BASE_URL}/fileupload`,
  allVideos: `${API_BASE_URL}/allVideos`,
  rate: `${API_BASE_URL}/rate`,
  getVid: `${API_BASE_URL}/getVid`,
  getRankings: `${API_BASE_URL}/getRankings`,
  auth: {
    signup: `${API_BASE_URL}/api/signup`,
    login: `${API_BASE_URL}/api/login`,
    checkAuth: `${API_BASE_URL}/api/check-auth`,
    updateProfile: `${API_BASE_URL}/api/updateProfile`,
    pendingRequests: `${API_BASE_URL}/api/pending-requests`,
    approveUser: `${API_BASE_URL}/api/approve-user`,
    promoteToAdmin: `${API_BASE_URL}/api/promote-to-admin`,
    allUsers: `${API_BASE_URL}/api/all-users`,
  }
};

// Log all endpoints for debugging
console.log('API Endpoints:', API_ENDPOINTS);

export default API_CONFIG; 