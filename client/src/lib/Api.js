import axios from 'axios';
import Auth from './auth';

const BASE_URL = 'http://localhost:8000';
axios.defaults.withCredentials = true;

const http = axios.create();
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
    return http.post(`${BASE_URL}/api/users/login`, { username, password });
  }

  static async refreshToken() {
    return http.get(`${BASE_URL}/api/users/refresh-token`);
  }

  static async current() {
    return http.get(`${BASE_URL}/api/users/current`);
  }
}
