import { defineStore } from 'pinia';
import UserService, { type User, type PaginationFilter } from '@/services/user.service';

export const useUsersStore = defineStore('users', {
  state: () => ({
    users: [] as User[],
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
    loading: false,
    error: null as string | null,
    selectedUser: null as User | null,
  }),

  actions: {
    async fetchUsers(filter?: PaginationFilter) {
      this.loading = true;
      this.error = null;
      try {
        const params = {
          page: filter?.page || this.page,
          limit: filter?.limit || this.limit,
          search: filter?.search || undefined,
          isActive: filter?.isActive,
        };
        const response = await UserService.getUsers(params);
        this.users = response.data.data;
        this.total = response.data.meta.total;
        this.page = response.data.meta.page;
        this.limit = response.data.meta.limit;
        this.totalPages = response.data.meta.totalPages;
      } catch (err: any) {
        this.error = err.response?.data?.message || err.message || 'Failed to fetch users';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async fetchUserById(id: string) {
      this.loading = true;
      this.error = null;
      try {
        const response = await UserService.getUserById(id);
        this.selectedUser = response.data;
        return response.data;
      } catch (err: any) {
        this.error = err.response?.data?.message || err.message || 'Failed to fetch user';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async createUser(payload: any) {
      this.loading = true;
      this.error = null;
      try {
        const response = await UserService.createUser(payload);
        return response.data;
      } catch (err: any) {
        this.error = err.response?.data?.message || err.message || 'Failed to create user';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async updateUser(id: string, payload: any) {
      this.loading = true;
      this.error = null;
      try {
        const response = await UserService.updateUser(id, payload);
        return response.data;
      } catch (err: any) {
        this.error = err.response?.data?.message || err.message || 'Failed to update user';
        throw err;
      } finally {
        this.loading = false;
      }
    },
    
    async toggleUserStatus(id: string, currentStatus: boolean) {
      return this.updateUser(id, { isActive: !currentStatus });
    }
  }
});
