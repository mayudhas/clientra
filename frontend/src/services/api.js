import axios from 'axios';
import router from '../router';
import store from '../store';

const api = axios.create({
  baseURL: process.env.VUE_APP_API_URL || 'http://localhost:3000',
  timeout: 10000,
});

api.interceptors.request.use(
  (config) => {
    // Ngambil token dari localStorage yang disinkronisasi dengan Vuex
    const token = localStorage.getItem('token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Menghapus state & local storage jika token invalid/expired
      store.dispatch('auth/logout');
      
      // Arahkan ke halaman login (sesuaikan dengan nama route login di template Anda)
      router.push({ path: '/auth/login' }).catch(() => {});
    }
    return Promise.reject(error);
  }
);

export default api;
