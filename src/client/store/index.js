/* eslint-disable global-require */

import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from 'client/lib/logger';
import Api from 'client/api';
import calendars from './modules/calendars';
import todos from './modules/todos';
import actions from './actions';
import getters from './getters';
import mutations from './mutations';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

const initState = {
  isLoading: false,
  alerts: {},
  token: localStorage.getItem('token') || null,
  username: localStorage.getItem('username') || null,
  title: 'Welcome',
  subtext: 'This is subtext',
};

const store = new Vuex.Store({
  state: initState,
  actions,
  getters,
  mutations,
  modules: {
    calendars,
    todos,
  },
  strict: debug,
  plugins: debug ? [createLogger()] : [],
});

Api.init(store);
if (initState.token) {
  Api.setToken(initState.token);
}

// Hot reload each modules
if (module.hot) {
  module.hot.accept([
    './actions',
    './getters',
    './mutations',
    './types',
    './modules/calendars',
    './modules/todos',
  ], () => {
    store.hotUpdate({
      actions: require('./actions').default,
      getters: require('./getters').default,
      mutations: require('./mutations').default,
      types: require('./types').default,
      modules: {
        calendars: require('./modules/calendars').default,
        todos: require('./modules/todos').default,
      },
    });
  });
}

export default store;
