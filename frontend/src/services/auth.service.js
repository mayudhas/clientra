import api from './api';

class AuthService {
  login(user) {
    return api.post('/auth/login', {
      email: user.email,
      password: user.password
    });
  }

  register(user) {
    return api.post('/auth/register', user);
  }

  getProfile() {
    return api.get('/auth/profile');
  }
}

export default new AuthService();
