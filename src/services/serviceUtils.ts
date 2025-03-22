
// Base API URL with the correct API base URL
export const API_BASE_URL = 'http://localhost:8080/api';

// Simulate API delay - useful for fallbacks and testing
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
