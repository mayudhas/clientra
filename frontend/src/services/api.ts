import axios from 'axios';
import { router } from '@/router';

const api = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || 'http://localhost:3000') + '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request Interceptor: Inject JWT token into headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && token !== 'undefined' && token !== 'null') {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Unwrap backend response envelope
api.interceptors.response.use(
  (response) => {
    // Backend wraps response in: { statusCode, message, error, result }
    // We unwrap it so consumers don't have to keep doing .result
    if (response.data && response.data.result !== undefined) {
      response.data = response.data.result;
    }
    return response;
  },
  (error) => {
    // Handle global errors like 401 Unauthorized
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('refreshToken');
      router.push('/authentication/login');
    }
    return Promise.reject(error);
  }
);

export default api;
