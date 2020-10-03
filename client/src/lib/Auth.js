import Vue from 'vue';
import Api from './api';

export const state = Vue.observable({
  user: null,
});

export default class Auth {
  static isAuthenticated() {
    return !!state.user;
  }

  static async refreshToken() {
    console.log('api', Api);
    try {
      const res = await Api.refreshToken();
      state.user = res.data.payload;
    } catch (error) {
      // TODO: logout
      console.log('logout');
      throw error;
    }
  }

  static async login({ username, password }) {
    const res = await Api.login({ username, password });
    state.user = res.data.payload;
    return state.user;
  }
}

// Refresh on app load
Auth.refreshToken();
