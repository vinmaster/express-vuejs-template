<script setup lang="ts">
import { reactive, ref } from 'vue';
import { isAuthenticated } from '../lib/State';
import Api from '../lib/Api';

let form = reactive({ username: '', password: '' });

async function onLogin() {
  console.log(form);
  await Api.login(form);
}

async function onRegister() {
  await Api.register({ ...form, email: 'test@example.com' });
}
</script>

<template>

<div class="container is-fluid">
  <h1 class="is-size-1">Login</h1>

  <form>
    <div class="field">
      <label class="label">Username</label>
      <div class="control">
        <input class="input" type="text" placeholder="Username" v-model="form.username" />
      </div>
    </div>

    <div class="field">
      <label class="label">Password</label>
      <div class="control">
        <input class="input" type="password" placeholder="Password" v-model="form.password" />
      </div>
    </div>
    <div class="field is-grouped">
      <div class="control">
        <button class="button is-info" type="submit" @click.prevent="onRegister">Register</button>
      </div>
      <div class="control">
        <button class="button is-primary" type="submit" @click.prevent="onLogin">Login</button>
      </div>
    </div>
  </form>
</div>
</template>

<style scoped>
a {
  color: #42b983;
}

label {
  margin: 0 0.5em;
  font-weight: bold;
}

code {
  background-color: #eee;
  padding: 2px 4px;
  border-radius: 4px;
  color: #304455;
}
</style>
