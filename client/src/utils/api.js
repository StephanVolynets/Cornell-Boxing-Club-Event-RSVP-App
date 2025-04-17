import axios from 'axios';

// Create the base URL that works in both development and production environments
const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? '/api' // In production, use relative path
  : 'http://localhost:8080/api'; // In development, use the full URL

// Create axios instance with common configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important for cookies (admin auth)
});

export default api;
