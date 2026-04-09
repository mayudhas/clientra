import api from './api';

class ClientsService {
  getAll() {
    return api.get('/api/clients');
  }

  get(id) {
    return api.get(`/api/clients/${id}`);
  }

  create(data) {
    return api.post('/api/clients', data);
  }

  update(id, data) {
    return api.patch(`/api/clients/${id}`, data);
  }

  delete(id) {
    return api.delete(`/api/clients/${id}`);
  }
}

export default new ClientsService();
