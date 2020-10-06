<template>
  <v-app>
    <v-app-bar app color="green darken-3" dark>
      <div class="d-flex align-center">
        <router-link to="/">
          <v-img
            alt="Vuetify Logo"
            class="shrink mr-2"
            contain
            src="@/assets/favicon-32x32.png"
            transition="scale-transition"
            width="40"
          />
        </router-link>
      </div>

      <v-spacer></v-spacer>

      <v-btn @click="logout()" v-if="isAuthenticated()" v-cloak>
        <span class="mr-2">Logout</span>
      </v-btn>
      <v-btn :to="{ path: '/login' }" v-if="!isAuthenticated()" v-cloak>
        <span class="mr-2">Login</span>
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
import Api from './lib/Api';
import Auth from './lib/Auth';

export default {
  name: 'App',

  computed: {
    isAuthenticated() {
      return Auth.isAuthenticated;
    },
  },

  methods: {
    logout() {
      Api.logout();
    },
  },

  data: () => ({
    //
  }),
};
</script>

<style>
[v-cloak] {
  display: none;
}
</style>
