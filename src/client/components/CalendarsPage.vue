<template>
  <div class="row">
    <h1 class="center">Calendars</h1>
    <div class="col s12 center">
      <a class="waves-effect waves-light btn" v-on:click="getCalendars">Get Calendars</a>
    </div>
    <div class="col s12 center">Calendars Table</div>
    <table class="center">
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="calendar in calendars">
          <td>{{ calendar.id }}</td>
          <td>{{ calendar.name }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'calendars',
  computed: {
    ...mapGetters([
      'calendars',
    ])
  },
  methods: {
    ...mapActions([
      'getCalendars',
    ])
  },
  data() {
    return {}
  }
}
</script>

<style scoped>
</style>
