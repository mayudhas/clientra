import api from './api';

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    tenantId: string | null;
  };
}

export interface LoginPayload {
  email: string;
  password: string;
}

const AuthService = {
  login: (payload: LoginPayload) => api.post<AuthResponse>('/auth/login', payload),
  register: (payload: any) => api.post('/auth/register', payload),
  refresh: (refreshToken: string) => api.post<AuthResponse>('/auth/refresh', { refreshToken }),
};

export default AuthService;
