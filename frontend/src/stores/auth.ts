import { defineStore } from 'pinia';
import { router } from '@/router';
import AuthService, { type LoginPayload, type AuthResponse } from '@/services/auth.service';

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    refreshToken: localStorage.getItem('refreshToken') || null,
    user: JSON.parse(localStorage.getItem('user') || 'null'),
    loading: false,
    error: null as string | null,
  }),

  getters: {
    isAuthenticated: (state) => !!state.token,
    currentUser: (state) => state.user,
  },

  actions: {
    async login(payload: LoginPayload) {
      this.loading = true;
      this.error = null;
      try {
        const response = await AuthService.login(payload);
        // Because of our Axios interceptor, response.data is already the result
        this.setSession(response.data);
        return response.data;
      } catch (err: any) {
        this.error = err.response?.data?.message || err.message || 'Login failed';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    setSession(data: AuthResponse) {
      this.token = data.accessToken;
      this.refreshToken = data.refreshToken;
      this.user = data.user;
      localStorage.setItem('token', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      localStorage.setItem('user', JSON.stringify(data.user));
    },

    logout() {
      this.token = null;
      this.refreshToken = null;
      this.user = null;
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');
      router.push('/authentication/login');
    },

    async checkAuth() {
      if (!this.token && this.refreshToken) {
        try {
          const response = await AuthService.refresh(this.refreshToken);
          this.setSession(response.data);
        } catch (err) {
          this.logout();
        }
      }
    }
  }
});
