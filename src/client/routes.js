import Vue from 'vue';
import Router from 'vue-router';
import HomePage from 'components/HomePage';
import TodosPage from 'components/TodosPage';
import CalendarsPage from 'components/CalendarsPage';

Vue.use(Router);

export default new Router({
  mode: 'history',
  routes: [
    { path: '/', name: 'home', component: HomePage },
    { path: '/todos', component: TodosPage },
    { path: '/calendars', component: CalendarsPage },
  ],
});
