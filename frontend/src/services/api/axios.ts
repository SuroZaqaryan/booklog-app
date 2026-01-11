/**
 * Конфигурация axios для работы с backend API
 */

import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api/v1/';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor для обработки ошибок
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Ошибка от сервера
      console.error('API Error:', error.response.data);
    } else if (error.request) {
      // Ошибка сети
      console.error('Network Error:', error.message);
    } else {
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

