import axios from 'axios';

export default class Api {
  static init(store) {
    this.axiosInstance = axios.create();

    if (store.state.token) {
      Api.setToken(store.state.token);
      Api.setRefreshToken(store.state.refreshToken);
    }
    // Use undefined to ignore success callback
    this.axiosInstance.interceptors.response.use(undefined, error => {
      if (error.response && error.response.status === 401) {
        // Use refresh token to get new token and retry request
        return this.axiosInstance.post('/api/users/refresh', { refreshToken: this.refreshToken }).then(response => {
          error.config.headers.Authorization = `Bearer ${response.data.payload.token}`;
          return this.axiosInstance.request(error.config);
        }).catch(error2 => {
          store.dispatch('logout');
          store.commit('SET_ALERTS', { error: error2.response.data.error.message });
          return Promise.reject(error2);
        });
      }
      return Promise.reject(error);
    });
  }

  static setToken(token) {
    this.axiosInstance.defaults.headers.common.Authorization = `Bearer ${token}`;
  }

  static setRefreshToken(refreshToken) {
    this.refreshToken = refreshToken;
  }

  static register(body) {
    return this.axiosInstance.post('/api/users/register', body);
  }

  static login(body) {
    return this.axiosInstance.post('/api/users/login', body);
  }

  // Global logout
  static logout() {
    return this.axiosInstance.post('/api/users/logout');
  }

  static getCalendars() {
    return this.axiosInstance.get('/api/calendars');
  }
}
