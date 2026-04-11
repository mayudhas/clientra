import { defineStore } from 'pinia';
import TenantService, { type Tenant, type TenantPaginationFilter, type TenantStats } from '@/services/tenant.service';

export const useTenantsStore = defineStore('tenants', {
  state: () => ({
    tenants: [] as Tenant[],
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
    loading: false,
    error: null as string | null,
    selectedTenant: null as Tenant | null,
    selectedTenantStats: null as TenantStats | null,
  }),

  actions: {
    async fetchTenants(filter?: TenantPaginationFilter) {
      this.loading = true;
      this.error = null;
      try {
        const params = {
          page: filter?.page || this.page,
          limit: filter?.limit || this.limit,
          search: filter?.search || undefined,
        };
        const response = await TenantService.getTenants(params);
        this.tenants = response.data.data;
        this.total = response.data.meta.total;
        this.page = response.data.meta.page;
        this.limit = response.data.meta.limit;
        this.totalPages = response.data.meta.totalPages;
      } catch (err: any) {
        this.error = err.response?.data?.message || err.message || 'Failed to fetch tenants';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async fetchTenantById(id: string) {
      this.loading = true;
      try {
        const response = await TenantService.getTenantById(id);
        this.selectedTenant = response.data;
        return response.data;
      } catch (err: any) {
        this.error = err.response?.data?.message || err.message || 'Failed to fetch tenant';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async fetchTenantStats(id: string) {
      try {
        const response = await TenantService.getTenantStats(id);
        this.selectedTenantStats = response.data;
        return response.data;
      } catch (err: any) {
        console.error('Failed to fetch tenant stats:', err);
        return null;
      }
    },

    async createTenant(payload: { name: string }) {
      this.loading = true;
      try {
        const response = await TenantService.createTenant(payload);
        return response.data;
      } catch (err: any) {
        this.error = err.response?.data?.message || err.message || 'Failed to create tenant';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async updateTenant(id: string, payload: { name: string }) {
      this.loading = true;
      try {
        const response = await TenantService.updateTenant(id, payload);
        return response.data;
      } catch (err: any) {
        this.error = err.response?.data?.message || err.message || 'Failed to update tenant';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async deleteTenant(id: string) {
      this.loading = true;
      try {
        await TenantService.deleteTenant(id);
      } catch (err: any) {
        this.error = err.response?.data?.message || err.message || 'Failed to delete tenant';
        throw err;
      } finally {
        this.loading = false;
      }
    }
  }
});
