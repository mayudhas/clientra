import { defineStore } from 'pinia';
import TaskService, { type Task, type CreateTaskPayload, type UpdateTaskPayload } from '@/services/task.service';

export const useTasksStore = defineStore('tasks', {
  state: () => ({
    tasks: [] as Task[],
    loading: false,
    error: null as string | null,
  }),

  getters: {
    todoTasks: (state) => state.tasks.filter((t) => t.status === 'todo'),
    inProgressTasks: (state) => state.tasks.filter((t) => t.status === 'in_progress'),
    doneTasks: (state) => state.tasks.filter((t) => t.status === 'done'),
    totalTasks: (state) => state.tasks.length,
    completedCount: (state) => state.tasks.filter((t) => t.status === 'done').length,
  },

  actions: {
    async fetchTasks(projectId: string) {
      this.loading = true;
      this.error = null;
      try {
        const response = await TaskService.getTasksByProject(projectId);
        this.tasks = response.data;
      } catch (err: any) {
        this.error = err.response?.data?.message || err.message || 'Failed to fetch tasks';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async createTask(projectId: string, payload: CreateTaskPayload) {
      try {
        const response = await TaskService.createTask(projectId, payload);
        this.tasks.push(response.data);
        return response.data;
      } catch (err: any) {
        this.error = err.response?.data?.message || err.message || 'Failed to create task';
        throw err;
      }
    },

    async updateTask(projectId: string, taskId: string, payload: UpdateTaskPayload) {
      try {
        const response = await TaskService.updateTask(projectId, taskId, payload);
        const index = this.tasks.findIndex((t) => t.id === taskId);
        if (index !== -1) {
          this.tasks[index] = response.data;
        }
        return response.data;
      } catch (err: any) {
        this.error = err.response?.data?.message || err.message || 'Failed to update task';
        throw err;
      }
    },

    async deleteTask(projectId: string, taskId: string) {
      try {
        await TaskService.deleteTask(projectId, taskId);
        this.tasks = this.tasks.filter((t) => t.id !== taskId);
      } catch (err: any) {
        this.error = err.response?.data?.message || err.message || 'Failed to delete task';
        throw err;
      }
    },

    async toggleTaskStatus(projectId: string, task: Task) {
      const nextStatus = task.status === 'done' ? 'todo' : 'done';
      return await this.updateTask(projectId, task.id, { status: nextStatus });
    },
  },
});
