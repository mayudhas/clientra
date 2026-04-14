import api from './api';
import { type Client } from './client.service';

export interface Project {
  id: string;
  name: string;
  description?: string;
  status: 'planning' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  budget?: number;
  startDate?: string;
  deadline?: string;
  progress: number;
  clientId: string;
  client?: Client;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectPayload {
  name: string;
  description?: string;
  status?: string;
  priority?: string;
  budget?: number;
  startDate?: string;
  endDate?: string; // Backend uses endDate for deadline in DTO if I recall correctly, let me check backend DTO
  progress?: number;
  clientId: string;
}

export interface UpdateProjectPayload extends Partial<CreateProjectPayload> {}

const ProjectService = {
  getProjects: () => api.get<Project[]>('/projects'),
  getProjectById: (id: string) => api.get<Project>(`/projects/${id}`),
  createProject: (payload: CreateProjectPayload) => api.post<Project>('/projects', payload),
  updateProject: (id: string, payload: UpdateProjectPayload) => api.patch<Project>(`/projects/${id}`, payload),
  deleteProject: (id: string) => api.delete<{ message: string }>(`/projects/${id}`),
};

export default ProjectService;
