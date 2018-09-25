<template>
  <div class="row center-align">
    <div class="col s12 m4 offset-m4">
      <h1 class="col s12 center">Login</h1>
      <form @submit.prevent="login({ username, password })">
        <div class="input-field col s12">
          <label for="username" class="active">Username</label>
          <input id="username" v-model="username" />
        </div>
        <div class="input-field col s12">
          <label for="password" class="active">Password</label>
          <input id="password" v-model="password" type="password" />
        </div>
        <button type="submit" class="waves-effect waves-light btn col s6 offset-s3">Login</button>
      </form>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'login',
  methods: {
    ...mapActions([
      'login',
    ]),
  },
  data() {
    return {
      username: '',
      password: '',
    }
  }
}
</script>

<style scoped>
</style>
