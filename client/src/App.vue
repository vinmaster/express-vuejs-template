<template>
  <q-layout view="lHh Lpr lFf" id="q-app">
    <q-header elevated class="bg-green">
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          @click="leftDrawerOpen = !leftDrawerOpen"
          aria-label="Menu"
          icon="menu"
        />

        <q-toolbar-title>
          <router-link style="color: white;" to="/">MiMi</router-link>
        </q-toolbar-title>

        <q-btn flat round><router-link style="color: white;" to="/login">Login</router-link></q-btn>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" show-if-above bordered content-class="bg-grey-2">
      <q-list>
        <q-item-label header>Navigation</q-item-label>
        <q-item clickable tag="a" href="/">
          <q-item-section avatar>
            <q-icon name="home" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Home</q-item-label>
            <q-item-label caption>Go to home page</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable tag="a" href="/">
          <q-item-section avatar>
            <q-icon name="lock" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Login</q-item-label>
            <q-item-label caption>Log into your account here</q-item-label>
          </q-item-section>
        </q-item>
        <!-- <q-item clickable tag="a" target="_blank" href="https://quasar.dev">
          <q-item-section avatar>
            <q-icon name="school" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Docs</q-item-label>
            <q-item-label caption>quasar.dev</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable tag="a" target="_blank" href="https://github.com/quasarframework/">
          <q-item-section avatar>
            <q-icon name="code" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Github</q-item-label>
            <q-item-label caption>github.com/quasarframework</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable tag="a" target="_blank" href="https://chat.quasar.dev">
          <q-item-section avatar>
            <q-icon name="chat" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Discord Chat Channel</q-item-label>
            <q-item-label caption>chat.quasar.dev</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable tag="a" target="_blank" href="https://forum.quasar.dev">
          <q-item-section avatar>
            <q-icon name="forum" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Forum</q-item-label>
            <q-item-label caption>forum.quasar.dev</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable tag="a" target="_blank" href="https://twitter.com/quasarframework">
          <q-item-section avatar>
            <q-icon name="rss_feed" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Twitter</q-item-label>
            <q-item-label caption>@quasarframework</q-item-label>
          </q-item-section>
        </q-item> -->
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view></router-view>
    </q-page-container>
  </q-layout>
</template>

<script lang="ts">
// @ts-ignore
import Api from './lib/api';
import Vue from 'vue';

export default Vue.extend({
  name: 'LayoutDefault',

  methods: {
    async submit() {
      try {
        const res = await Api.login({ username: this.username, password: this.password });
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

<style>
#q-app {
  height: 100vh;
}
</style>
