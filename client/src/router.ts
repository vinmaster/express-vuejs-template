import { createRouter, createWebHistory } from 'vue-router';
import Home from '/src/components/Home.vue';
import Login from '/src/components/Login.vue';

export const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
