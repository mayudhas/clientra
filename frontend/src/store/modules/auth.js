import AuthService from '../../services/auth.service';

const token = localStorage.getItem('token');
let user = null;
try {
  user = JSON.parse(localStorage.getItem('user'));
} catch (e) {
  // Ignored if parser fails
}

const initialState = token
  ? { status: { loggedIn: true }, user, token }
  : { status: { loggedIn: false }, user: null, token: null };

export default {
  namespaced: true,
  state: initialState,
  actions: {
    login({ commit }, userPayload) {
      return AuthService.login(userPayload).then(
        response => {
          const rawToken = response.data.token || response.data.accessToken;
          const userData = response.data.user || {};
          
          if (rawToken) {
            localStorage.setItem('token', rawToken);
            localStorage.setItem('user', JSON.stringify(userData));
          }
          
          commit('loginSuccess', { token: rawToken, user: userData });
          return Promise.resolve(response.data);
        },
        error => {
          commit('loginFailure');
          return Promise.reject(error);
        }
      );
    },
    logout({ commit }) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      commit('logout');
    },
    register({ commit }, user) {
      return AuthService.register(user).then(
        response => {
          commit('registerSuccess');
          return Promise.resolve(response.data);
        },
        error => {
          commit('registerFailure');
          return Promise.reject(error);
        }
      );
    }
  },
  mutations: {
    loginSuccess(state, { user, token }) {
      state.status.loggedIn = true;
      state.user = user;
      state.token = token;
    },
    loginFailure(state) {
      state.status.loggedIn = false;
      state.user = null;
      state.token = null;
    },
    logout(state) {
      state.status.loggedIn = false;
      state.user = null;
      state.token = null;
    },
    registerSuccess(state) {
      state.status.loggedIn = false;
    },
    registerFailure(state) {
      state.status.loggedIn = false;
    }
  }
};
