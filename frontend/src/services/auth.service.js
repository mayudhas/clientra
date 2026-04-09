import api from './api';

class AuthService {
  login(user) {
    return api.post('/api/auth/login', {
      email: user.email,
      password: user.password
    });
  }

  register(user) {
    return api.post('/api/auth/register', user);
  }

  getProfile() {
    return api.get('/api/auth/profile');
  }
}

export default new AuthService();
