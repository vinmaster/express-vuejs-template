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

      <v-btn :to="{ path: '/login' }">
        <span class="mr-2">Login</span>
      </v-btn>
    </v-app-bar>

    <v-main>
      <router-view></router-view>
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App',

  data: () => ({
    //
  }),
};
</script>
