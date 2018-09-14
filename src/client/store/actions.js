import Api from 'client/api';
import router from 'client/routes';
import types from './types';

export default {
  async register({ commit }, { username, password, passwordConfirmation }) {
    if (password !== passwordConfirmation) {
      commit(types.SET_ALERTS, { error: 'Password confirmation does not match' });
      return;
    }
    commit(types.SET_LOADING, true);
    try {
      await Api.register({ username, password, passwordConfirmation });
      router.push('/login');
    } catch (e) {
      if (e.response) {
        commit(types.SET_ALERTS, { error: e.response.data.error.message });
      } else {
        commit(types.SET_ALERTS, { error: e.message });
      }
    }
    commit(types.SET_LOADING, false);
  },
  async login({ commit }, { username, password }) {
    commit(types.SET_LOADING, true);
    try {
      const response = await Api.login({ username, password });
      // payload keys: token, username
      commit(types.USER_LOGIN, response.data.payload);
      Api.setToken(response.data.payload.token);
      router.push('/');
    } catch (e) {
      if (e.response) {
        commit(types.SET_ALERTS, { error: e.response.data.error.message });
      } else {
        commit(types.SET_ALERTS, { error: e.message });
      }
    }
    commit(types.SET_LOADING, false);
  },
  logout({ commit }) {
    commit(types.USER_LOGOUT);
    Api.setToken(null);
    router.push('/login');
  },
  changeTitle({ commit }, title) {
    commit(types.CHANGE_TITLE, { title });
  },
  changeSubtext({ commit }, subtext) {
    commit(types.CHANGE_SUBTEXT, { subtext });
  },
};
