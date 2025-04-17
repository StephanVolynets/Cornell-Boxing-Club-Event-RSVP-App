import axios from 'axios';

// Create the base URL that works in both development and production environments
const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? '/api' // In production, use relative path
  : `http://localhost:${process.env.PORT || 8080}/api`; // In development, use the full URL with environment variable PORT

console.log('API Base URL:', API_BASE_URL);

// Create axios instance with common configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies (admin auth)
  timeout: 10000, // 10 second timeout
});

// Add request interceptor for debugging
api.interceptors.request.use(
  config => {
    console.log('Making request to:', config.url);
    return config;
  },
  error => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for debugging
api.interceptors.response.use(
  response => {
    console.log('Response from:', response.config.url, 'Status:', response.status);
    return response;
  },
  error => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response error:', error.response.status, error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Request setup error:', error.message);
    }
    return Promise.reject(error);
  }
);

export default api;
