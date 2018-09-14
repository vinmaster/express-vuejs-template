/* eslint-disable import/prefer-default-export */

import Api from 'client/api';
import types from './types';

export const getCalendars = ({ commit }) => {
  Api.getCalendars().then(response => {
    commit(types.FETCHED_CALENDARS, { calendars: response.data.payload.calendars });
  });
};
