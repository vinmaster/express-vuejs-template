import Vue from 'vue';
import Router from 'vue-router';
import HomePage from 'components/HomePage';
import RegisterPage from 'components/RegisterPage';
import LoginPage from 'components/LoginPage';
import TodosPage from 'components/TodosPage';
import CalendarsPage from 'components/CalendarsPage';
import store from 'client/store';

Vue.use(Router);

const checkAuth = (to, from, next) => {
  if (store.getters.isAuth) {
    next();
    return;
  }
  next('/login');
};

const checkNotAuth = (to, from, next) => {
  if (!store.getters.isAuth) {
    next();
    return;
  }
  next('/');
};

const router = new Router({
  mode: 'history',
  routes: [
    { path: '/', name: 'home', component: HomePage },
    {
      path: '/register', name: 'register', beforeEnter: checkNotAuth, component: RegisterPage,
    },
    {
      path: '/login', name: 'login', beforeEnter: checkNotAuth, component: LoginPage,
    },
    {
      path: '/logout',
      name: 'logout',
      beforeEnter: (_to, _from, _next) => {
        store.dispatch('logout');
      },
    },
    { path: '/todos', component: TodosPage },
    { path: '/calendars', beforeEnter: checkAuth, component: CalendarsPage },
  ],
});

// Clear alerts when navigating
router.beforeEach((_to, _from, next) => {
  if (store.state.alerts
    && (store.state.alerts.success
    || store.state.alerts.info
    || store.state.alerts.warning
    || store.state.alerts.error)) {
    store.commit('SET_ALERTS', {});
  }
  next();
});

export default router;
