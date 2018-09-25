<template>
  <div id="app">
    <app-nav></app-nav>
    <alert id="alert" v-bind:alerts="alerts"></alert>
    <router-view></router-view>
  </div>
</template>

<script>
import Nav from 'components/Nav'
import { mapGetters } from 'vuex'

export default {
  name: 'app',
  components: {
    'app-nav': Nav,
  },
  computed: {
    ...mapGetters([
      'alerts',
      'calendars',
    ]),
  },
}
</script>

<style>
html, body {
  height: 100%;
  margin: 0px;
}

#app {
  height: 100%;
}

#alert {
  margin-top: 20px;
}
</style>
