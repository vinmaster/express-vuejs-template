<template>
  <div id="app">
    <nav>
      <div class="blue nav-wrapper">
        <ul>
          <li><router-link to="/">Home</router-link></li>
          <li><router-link to="/todos">Todos</router-link></li>
          <li><router-link to="/calendars">Calendars</router-link></li>
        </ul>
      </div>
    </nav>
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app'
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
