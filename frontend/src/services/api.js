import axios from 'axios';

const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL || 'http://localhost:3000',
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    // Ngambil token dari localStorage agar lebih konsisten saat refresh
    const rawToken = localStorage.getItem('token');
    const isValidToken = rawToken && 
                         rawToken !== 'undefined' && 
                         rawToken !== 'null' && 
                         rawToken !== '';

    if (isValidToken) {
      config.headers['Authorization'] = `Bearer ${rawToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 401) {
      // Import secara dinamis untuk menghindari circular dependency
      const store = (await import('../store')).default;
      const router = (await import('../router')).default;
      
      store.dispatch('auth/logout');
      router.push({ path: '/auth/login' }).catch(() => {});
    }
    return Promise.reject(error);
  }
);

export default api;
