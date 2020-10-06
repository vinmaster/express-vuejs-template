import Vue from 'vue';
import VueRouter from 'vue-router';
import VueSocketIOExt from 'vue-socket.io-extended';
import SocketIO from 'socket.io-client';
import vuetify from '@/plugins/vuetify';
import App from './App.vue';
import { routes } from './routes';
import Api from './lib/Api';

export const router = new VueRouter({
  mode: 'history',
  routes,
});
Vue.use(VueRouter);

if (process.env.NODE_ENV === 'development') {
  Vue.use(VueSocketIOExt, SocketIO(':8000'));
} else {
  Vue.use(VueSocketIOExt, SocketIO());
}

Vue.config.productionTip = false;

new Vue({
  router,
  vuetify,
  render: h => h(App),
}).$mount('#app');

// Refresh on app load
Api.refreshToken();
