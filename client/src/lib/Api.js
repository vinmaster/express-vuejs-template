import axios from 'axios';
import Auth, { state } from './Auth';

let BASE_URL = '';
const http = axios.create();

if (process.env.NODE_ENV === 'development') {
  BASE_URL = 'http://localhost:8000';
}

axios.defaults.withCredentials = true;

http.interceptors.request.use(config => {
  config.headers['X-Requested-With'] = 'XmlHttpRequest';
  return config;
});
http.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (
      originalRequest.url.includes('/refresh-token') ||
      error.response.status !== 401 ||
      originalRequest._attempt
    ) {
      return Promise.reject(error);
    }

    originalRequest._attempt = true;
    try {
      // This will log the user out
      await Auth.refreshToken();
      return http(originalRequest);
    } catch (error) {
      return Promise.reject(error);
    }
  }
);

export default class Api {
  static async login({ username, password }) {
    const res = await http.post(`${BASE_URL}/api/users/login`, { username, password });
    state.user = res.data.payload;
    return res;
  }

  static async register({ email, username, password }) {
    const res = await http.post(`${BASE_URL}/api/users/login`, { email, username, password });
    return res;
  }

  static async refreshToken() {
    return http.get(`${BASE_URL}/api/users/refresh-token`);
  }

  static async current() {
    return http.get(`${BASE_URL}/api/users/current`);
  }
}
