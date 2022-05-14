import { createApp } from 'vue';
import App from './App.vue';
import { router } from './router';
import { useSocketIO } from '../src/composables/useSocketIO';

createApp(App).use(router).mount('#app');

let url =
  window.location.protocol === 'http:' ? `ws://localhost:8000` : `wss://${window.location.host}`;
let options = {
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 3,
  withCredentials: true,
};
let on = {
  CONNECTED(msg: any) {
    console.log('connected', msg);
  },
};
useSocketIO({ url, options, on });
