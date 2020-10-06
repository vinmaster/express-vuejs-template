import Home from './components/Home.vue';
import Login from './components/Login.vue';
import NotFound from './components/NotFound.vue';

export const routes = [
  { path: '/', component: Home },
  { path: '/login', component: Login },
  { path: '*', component: NotFound },
];
