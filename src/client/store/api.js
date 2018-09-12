import axios from 'axios';

export default class Api {
  static getCalendars() {
    return axios.get('/api/calendars');
  }
}
