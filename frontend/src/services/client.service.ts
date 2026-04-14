import api from './api';

export interface Client {
  id: string;
  name: string;
  email: string;
  company?: string;
  phone?: string;
  address?: string;
  notes?: string;
  status: 'active' | 'inactive';
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateClientPayload {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  address?: string;
  notes?: string;
  status?: string;
}

export interface UpdateClientPayload extends Partial<CreateClientPayload> {}

const ClientService = {
  getClients: () => api.get<Client[]>('/clients'),
  getClientById: (id: string) => api.get<Client>(`/clients/${id}`),
  createClient: (payload: CreateClientPayload) => api.post<Client>('/clients', payload),
  updateClient: (id: string, payload: UpdateClientPayload) => api.patch<Client>(`/clients/${id}`, payload),
  deleteClient: (id: string) => api.delete<{ message: string }>(`/clients/${id}`),
};

export default ClientService;
