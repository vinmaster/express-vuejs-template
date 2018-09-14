<template>
  <div id="app">
    <app-nav></app-nav>
    <router-view></router-view>
  </div>
</template>

<script>
import Nav from 'components/Nav'

export default {
  name: 'app',
  components: {
    'app-nav': Nav,
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
</style>
