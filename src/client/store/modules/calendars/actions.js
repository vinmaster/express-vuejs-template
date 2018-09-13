/* eslint-disable import/prefer-default-export */

import Api from 'store/api';
import types from './mutation-types';

export const getCalendars = ({ commit }) => {
  Api.getCalendars().then(response => {
    commit(types.FETCHED_CALENDARS, { calendars: response.data.payload.calendars });
  });
};
