import api from './api';

export interface Tenant {
  id: string;
  name: string;
  userCount?: number;
  clientCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface TenantStats {
  users: number;
  clients: number;
  projects: number;
  invoices: number;
}

export interface TenantPaginationFilter {
  page?: number;
  limit?: number;
  search?: string;
}

export interface TenantListResponse {
  data: Tenant[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const TenantService = {
  getTenants: (params?: TenantPaginationFilter) => api.get<TenantListResponse>('/tenants', { params }),
  getTenantById: (id: string) => api.get<Tenant>(`/tenants/${id}`),
  getTenantStats: (id: string) => api.get<TenantStats>(`/tenants/${id}/stats`),
  createTenant: (payload: { name: string }) => api.post<Tenant>('/tenants', payload),
  updateTenant: (id: string, payload: { name: string }) => api.put<Tenant>(`/tenants/${id}`, payload),
  deleteTenant: (id: string) => api.delete<{ message: string }>(`/tenants/${id}`),
};

export default TenantService;
