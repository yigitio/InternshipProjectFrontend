// src/services/apiClient.js or similar

import axios from 'axios';

const apiClient = axios.create({
  // This line reads the variable from your .env file
  baseURL: process.env.VUE_APP_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
