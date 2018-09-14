import axios from 'axios';

export default class Api {
  static init(store) {
    // Use undefined to ignore success callback
    axios.interceptors.response.use(undefined, error => {
      if (error.response.status === 401) {
        store.dispatch('logout');
      }
      return Promise.reject(error);
    });
  }

  static setToken(token) {
    axios.defaults.headers.common.Authorization = `Bearer ${token}`;
  }

  static register(body) {
    return axios.post('/api/users/register', body);
  }

  static login(body) {
    return axios.post('/api/users/login', body);
  }

  static getCalendars() {
    return axios.get('/api/calendars');
  }
}
