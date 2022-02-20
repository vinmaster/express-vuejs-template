<script setup lang="ts">
// This starter template is using Vue 3 <script setup> SFCs
// Check out https://v3.vuejs.org/api/sfc-script-setup.html#sfc-script-setup
import { isAuthenticated } from './lib/State';

function logout() {

}
</script>

<template>
  <nav class="navbar">
    <ul class="navbar-brand">
      <li class="navbar-item">
        <router-link to="/">
          <img alt="Vue Logo" src="./assets/logo.png" width="40" />
        </router-link>
      </li>
      <li class="navbar-item">
        <a @click="logout()" v-if="isAuthenticated()" v-cloak>Logout</a>
      </li>

      <li class="navbar-item">
        <router-link to="/login" v-if="!isAuthenticated()" v-cloak>Login</router-link>
      </li>
    </ul>
  </nav>
  <router-view></router-view>
</template>

<style>
#app {
  height: 100%;
}
</style>
