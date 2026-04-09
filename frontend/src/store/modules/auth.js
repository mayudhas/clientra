import AuthService from '../../services/auth.service';

const token = localStorage.getItem('token');
let user = null;
try {
  const storedUser = localStorage.getItem('user');
  user = (storedUser && storedUser !== 'undefined') ? JSON.parse(storedUser) : null;
} catch (e) {
  user = null;
}

const hasValidToken = token && token !== 'undefined' && token !== 'null';

const initialState = hasValidToken
  ? { status: { loggedIn: true }, user, token }
  : { status: { loggedIn: false }, user: null, token: null };

export default {
  namespaced: true,
  state: initialState,
  actions: {
    login({ commit }, userPayload) {
      return AuthService.login(userPayload).then(
        response => {
          // Robust extraction: check both wrapped and unwrapped data
          const data = response.data || {};
          const result = data.result || data;
          
          const rawToken = result.token || result.accessToken || result.result?.accessToken;
          const userData = result.user || result.result?.user || {};
          
          if (rawToken && rawToken !== 'undefined' && rawToken !== 'null') {
            localStorage.setItem('token', rawToken);
            localStorage.setItem('user', JSON.stringify(userData));
            commit('loginSuccess', { token: rawToken, user: userData });
            return Promise.resolve(data);
          } else {
            console.error('Failed to extract token from response:', data);
            commit('loginFailure');
            return Promise.reject(new Error('Format token tidak valid dari server'));
          }
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
