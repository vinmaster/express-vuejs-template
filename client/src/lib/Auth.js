import Vue from 'vue';

export const state = Vue.observable({
  user: null,
});

export default class Auth {
  static isAuthenticated() {
    return !!state.user;
  }
}
