import api from './api';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in_progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  dueDate?: string;
  projectId: string;
  tenantId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskPayload {
  title: string;
  description?: string;
  status?: string;
  priority?: string;
  dueDate?: string;
}

export interface UpdateTaskPayload extends Partial<CreateTaskPayload> {}

const TaskService = {
  getTasksByProject: (projectId: string) => api.get<Task[]>(`/projects/${projectId}/tasks`),
  createTask: (projectId: string, payload: CreateTaskPayload) => api.post<Task>(`/projects/${projectId}/tasks`, payload),
  updateTask: (projectId: string, taskId: string, payload: UpdateTaskPayload) => api.patch<Task>(`/projects/${projectId}/tasks/${taskId}`, payload),
  deleteTask: (projectId: string, taskId: string) => api.delete<{ message: string }>(`/projects/${projectId}/tasks/${taskId}`),
};

export default TaskService;
