import Vue from 'vue';
import VueRouter from 'vue-router';
import App from './App.vue';
import './quasar';
import { routes } from './routes';

Vue.config.productionTip = false;

const router = new VueRouter({
  routes,
});

Vue.use(VueRouter);

new Vue({
  router,
  render: h => h(App),
}).$mount('#app');
