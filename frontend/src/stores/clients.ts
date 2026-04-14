import { defineStore } from 'pinia';
import ClientService, { type Client, type CreateClientPayload, type UpdateClientPayload } from '@/services/client.service';

export const useClientsStore = defineStore('clients', {
  state: () => ({
    clients: [] as Client[],
    loading: false,
    error: null as string | null,
    selectedClient: null as Client | null,
  }),

  actions: {
    async fetchClients() {
      this.loading = true;
      this.error = null;
      try {
        const response = await ClientService.getClients();
        // Since api.ts unwraps the result, we get the array directly or in response.data depending on axios return
        // But looking at api.ts: response.data = response.data.result;
        // So axios return has the array in .data
        this.clients = response.data;
      } catch (err: any) {
        this.error = err.response?.data?.message || err.message || 'Failed to fetch clients';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async fetchClientById(id: string) {
      this.loading = true;
      try {
        const response = await ClientService.getClientById(id);
        this.selectedClient = response.data;
        return response.data;
      } catch (err: any) {
        this.error = err.response?.data?.message || err.message || 'Failed to fetch client';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async createClient(payload: CreateClientPayload) {
      this.loading = true;
      try {
        const response = await ClientService.createClient(payload);
        return response.data;
      } catch (err: any) {
        this.error = err.response?.data?.message || err.message || 'Failed to create client';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async updateClient(id: string, payload: UpdateClientPayload) {
      this.loading = true;
      try {
        const response = await ClientService.updateClient(id, payload);
        return response.data;
      } catch (err: any) {
        this.error = err.response?.data?.message || err.message || 'Failed to update client';
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async deleteClient(id: string) {
      this.loading = true;
      try {
        await ClientService.deleteClient(id);
      } catch (err: any) {
        this.error = err.response?.data?.message || err.message || 'Failed to delete client';
        throw err;
      } finally {
        this.loading = false;
      }
    }
  }
});
