/* eslint-disable import/prefer-default-export */

import Api from 'client/api';
import types from './types';

export const getCalendars = async ({ commit }) => {
  commit('SET_LOADING', true, { root: true });
  try {
    const response = await Api.getCalendars();
    commit(types.FETCHED_CALENDARS, { calendars: response.data.payload.calendars });
  } catch (e) {
    if (e.response) {
      commit('SET_ALERTS', { error: e.response.data.error.message }, { root: true });
    } else {
      commit('SET_ALERTS', { error: e.message }, { root: true });
      throw e;
    }
  }
  commit('SET_LOADING', false, { root: true });
};
