import Vue from 'vue';
import types from './types';

export default {
  [types.SET_LOADING](state, boolean) {
    state.isLoading = boolean;
  },
  [types.SET_ALERTS](state, alerts) {
    Vue.set(state.alerts, 'success', alerts.success);
    Vue.set(state.alerts, 'info', alerts.info);
    Vue.set(state.alerts, 'warning', alerts.warning);
    Vue.set(state.alerts, 'error', alerts.error);
  },
  // [types.USER_REGISTER](state, { token, username }) {
  //   state.token = token;
  //   state.username = username;
  //   localStorage.setItem('token', token);
  //   localStorage.setItem('username', username);
  // },
  [types.USER_LOGIN](state, { token, username }) {
    state.token = token;
    state.username = username;
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
  },
  [types.USER_LOGOUT](state) {
    state.token = null;
    state.username = null;
    localStorage.clear();
  },
  [types.CHANGE_TITLE](state, { title }) {
    state.title = title;
  },
  [types.CHANGE_SUBTEXT](state, { subtext }) {
    state.subtext = subtext;
  },
};
