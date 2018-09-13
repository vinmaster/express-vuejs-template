import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from 'client/lib/logger';
import calendars from './modules/calendars';
import todos from './modules/todos';

Vue.use(Vuex);

const debug = process.env.NODE_ENV !== 'production';

const initState = {
  title: 'Welcome',
  subtext: 'This is subtext',
};

const types = {
  CHANGE_TITLE: 'CHANGE_TITLE',
  CHANGE_SUBTEXT: 'CHANGE_SUBTEXT',
};

const getters = {
  title: state => state.title,
  subtext: state => state.subtext,
};

const actions = {
  changeTitle({ commit }, title) {
    commit(types.CHANGE_TITLE, { title });
  },
  changeSubtext({ commit }, subtext) {
    commit(types.CHANGE_SUBTEXT, { subtext });
  },
};

const mutations = {
  [types.CHANGE_TITLE](state, { title }) {
    state.title = title;
  },
  [types.CHANGE_SUBTEXT](state, { subtext }) {
    state.subtext = subtext;
  },
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

// Hot reload each modules
if (module.hot) {
  module.hot.accept([
    './modules/calendars',
    './modules/todos',
  ], () => {
    store.hotUpdate({
      modules: {
        calendars: require('./modules/calendars').default, // eslint-disable-line
        todos: require('./modules/todos').default, // eslint-disable-line
      },
    });
  });
}

export default store;
