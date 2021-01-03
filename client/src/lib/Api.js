import axios from 'axios';
import Auth, { state } from './Auth';
import { router } from '../main';

let BASE_URL = '';
axios.defaults.withCredentials = true;

const http = axios.create();

if (process.env.NODE_ENV === 'development') {
  BASE_URL = 'http://localhost:8000';
}

http.interceptors.request.use(config => {
  config.headers['X-Requested-With'] = 'XmlHttpRequest';
  return config;
});
http.interceptors.response.use(
  response => response,
  async error => {
    console.error(error);
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
    await router.push('/');
    return res;
  }

  static async register({ email, username, password }) {
    const res = await http.post(`${BASE_URL}/api/users/register`, { email, username, password });
    return res;
  }

  static async logout() {
    await http.post(`${BASE_URL}/api/users/logout`);
    state.user = null;
    await router.push('/login');
  }

  static async refreshToken() {
    try {
      const res = await http.post(`${BASE_URL}/api/users/refresh-token`);
      state.user = res.data.payload;
      return res;
    } catch (error) {
      await this.logout();
    }
  }

  static async current() {
    return http.get(`${BASE_URL}/api/users/current`);
  }
}
