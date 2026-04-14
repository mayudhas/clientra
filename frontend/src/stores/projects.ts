import { defineStore } from 'pinia';
import ProjectService, { type Project, type CreateProjectPayload, type UpdateProjectPayload } from '@/services/project.service';

export const useProjectsStore = defineStore('projects', {
  state: () => ({
    projects: [] as Project[],
    loading: false,
    error: null as string | null,
    selectedProject: null as Project | null,
  }),

  actions: {
    async fetchProjects() {
      this.loading = true;
      this.error = null;
      try {
        const response = await ProjectService.getProjects();
        this.projects = response.data;
      } catch (err: any) {
        this.error = err.response?.data?.message || err.message || 'Failed to fetch projects';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async fetchProjectById(id: string) {
      this.loading = true;
      try {
        const response = await ProjectService.getProjectById(id);
        this.selectedProject = response.data;
        return response.data;
      } catch (err: any) {
        this.error = err.response?.data?.message || err.message || 'Failed to fetch project';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async createProject(payload: CreateProjectPayload) {
      this.loading = true;
      try {
        const response = await ProjectService.createProject(payload);
        await this.fetchProjects(); // Refresh list
        return response.data;
      } catch (err: any) {
        this.error = err.response?.data?.message || err.message || 'Failed to create project';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async updateProject(id: string, payload: UpdateProjectPayload) {
      this.loading = true;
      try {
        const response = await ProjectService.updateProject(id, payload);
        await this.fetchProjects(); // Refresh list
        return response.data;
      } catch (err: any) {
        this.error = err.response?.data?.message || err.message || 'Failed to update project';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async deleteProject(id: string) {
      this.loading = true;
      try {
        await ProjectService.deleteProject(id);
        await this.fetchProjects(); // Refresh list
      } catch (err: any) {
        this.error = err.response?.data?.message || err.message || 'Failed to delete project';
        throw err;
      } finally {
        this.loading = false;
      }
    }
  }
});
