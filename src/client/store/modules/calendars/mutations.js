import types from './mutation-types';

export default {
  [types.FETCHED_CALENDARS](state, { calendars }) {
    state.calendars = calendars;
  },
};
