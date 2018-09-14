<template>
  <nav>
    <div class="blue nav-wrapper">
      <ul>
        <li><router-link to="/">Home</router-link></li>
        <li><router-link to="/todos">Todos</router-link></li>
        <li><router-link to="/calendars">Calendars</router-link></li>
      </ul>
      <ul class="right">
        <li v-show="!isAuth"><router-link to="/register">Register</router-link></li>
        <li v-show="!isAuth"><router-link to="/login">Login</router-link></li>
        <li v-show="isAuth"><router-link to="/logout">Logout</router-link></li>
      </ul>
    </div>
  </nav>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'app-nav',
  computed: {
    ...mapGetters([
      'isAuth',
      'username',
    ]),
  },
  data() {
    return {};
  },
}
</script>

<style scoped>
</style>
