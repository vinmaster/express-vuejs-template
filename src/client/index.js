/* eslint-disable no-new */

import Vue from 'vue';
import App from 'client/App';
import router from 'client/routes';
import store from 'client/store';
import { sync } from 'vuex-router-sync';
import Websocket from 'client/lib/websocket';
import reporter from 'client/lib/reporter';
import Alert from 'components/Alert';

reporter.start();
window._reporter = reporter;
Vue.use(Websocket, undefined, { reconnectionAttempts: 3 });
sync(store, router);

// Global components
Vue.component('alert', Alert);

new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
});
