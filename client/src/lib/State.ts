import { reactive } from 'vue';
import Api from './Api';

export const state = reactive({
  user: null,
});

export function isAuthenticated() {
  return !!state.user;
}

async function loadState() {
  try {
    await Api.refreshToken();
  } catch (error) { }
}

loadState();