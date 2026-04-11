import api from './api';

export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  tenantId: string | null;
  isActive: boolean;
  createdAt: string;
}

export interface PaginationFilter {
  page?: number;
  limit?: number;
  search?: string;
  isActive?: boolean;
}

export interface UserListResponse {
  data: User[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const UserService = {
  getUsers: (params?: PaginationFilter) => api.get<UserListResponse>('/users', { params }),
  getUserById: (id: string) => api.get<User>(`/users/${id}`),
  createUser: (payload: any) => api.post<User>('/users', payload),
  updateUser: (id: string, payload: any) => api.put<User>(`/users/${id}`, payload),
  deleteUser: (id: string) => api.delete(`/users/${id}`),
};

export default UserService;
