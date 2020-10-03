<template>
  <q-page class="bg-light-green window-height window-width row justify-center items-center">
    <div class="column">
      <div class="row">
        <h5 class="text-h5 text-white q-my-md text-center full-width">MiMi Login</h5>
      </div>
      <div class="row">
        <q-card square bordered class="q-pa-lg shadow-1">
          <q-card-section>
            <q-form class="q-gutter-md">
              <q-input square filled v-model="username" type="text" label="Username" />
              <q-input square filled v-model="password" type="password" label="Password" />
            </q-form>
          </q-card-section>
          <q-card-actions class="q-px-md">
            <q-btn
              unelevated
              color="light-green-7"
              size="lg"
              class="full-width"
              label="Login"
              @click="submit"
            />

            <!-- <q-btn
              color="light-green-3"
              size="lg"
              class="full-width"
              label="Current"
              @click="current"
            /> -->
            <!-- <div>{{ isAuthenticated() }}</div> -->
          </q-card-actions>
          <q-card-section class="text-center q-pa-none">
            <p class="text-grey-6">Not reigistered? Created an Account</p>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script lang="ts">
import Vue from 'vue';
import Api from '../lib/api';
import Auth from '../lib/auth';

export default Vue.extend({
  name: 'Login',

  computed: {
    isAuthenticated() {
      return Auth.isAuthenticated;
    },
  },

  methods: {
    async submit() {
      try {
        const res = await Auth.login({ username: this.username, password: this.password });
        console.log('res', res);
      } catch (error) {
        console.error(error);
      }
    },

    async current() {
      try {
        const res = await Api.current();
        console.log('res', res);
      } catch (error) {
        console.error(error);
      }
    },
  },

  data() {
    return {
      leftDrawerOpen: false,
      username: '',
      password: '',
    };
  },
});
</script>
