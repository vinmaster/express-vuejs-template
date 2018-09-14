<template>
  <div class="row center-align">
    <div class="col s12 m6 offset-m3">
      <h1 class="col s12 center">Register</h1>
      <alert v-bind:alerts="alerts"></alert>
      <form @submit.prevent="register({ username, password, passwordConfirmation })">
        <div class="input-field col s12">
          <label for="username" class="active">Username</label>
          <input id="username" v-model="username" />
        </div>
        <div class="input-field col s12">
          <label for="password" class="active">Password</label>
          <input id="password" v-model="password" type="password" />
        </div>
        <div class="input-field col s12">
          <label for="password-confirmation" class="active">Password Confirmation</label>
          <input id="password-confirmation" v-model="passwordConfirmation" type="password" />
        </div>
        <button type="submit" class="waves-effect waves-light btn col s6 offset-s3">Register</button>
      </form>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Alert from './Alert'

export default {
  name: 'register',
  components: {
    'alert': Alert,
  },
  computed: {
    ...mapGetters([
      'alerts',
    ]),
  },
  methods: {
    ...mapActions([
      'register',
    ]),
  },
  data() {
    return {
      username: '',
      password: '',
      passwordConfirmation: '',
    }
  }
}
</script>

<style scoped>
</style>
