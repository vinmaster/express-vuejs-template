<template>
  <div class="row">
    <h1 class="col s12 center">{{ title }}</h1>
    <div class="input-field col s6 offset-s3">
      <input v-on:input="changeTitle($event.target.value)" v-bind:value="title" />
      <label class="active">Change title: </label>
    </div>
    <span class="col s12 center">{{ subtext }}</span>
    <div class="input-field col s6 offset-s3">
      <input v-model="subtext" />
      <label class="active">Change subtext: </label>
    </div>
    <a class="waves-effect waves-light btn col s6 offset-s3" v-on:click="serverChangeSubtext">Server change subtext</a>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'home',
  computed: {
    ...mapGetters([
      'title',
    ]),
    ...mapGetters({
      storeSubtext: 'subtext'
    }),
    subtext: {
      get() { return this.storeSubtext },
      set(value) { this.changeSubtext(value) }
    }
  },
  methods: {
    ...mapActions([
      'changeTitle',
      'changeSubtext',
    ]),
    serverChangeSubtext() {
      this.$socket.emit("sendText", { text: this.subtext })
    }
  },
  socket: {
    events: {
      sendText(msg) {
        this.changeSubtext(msg)
      },
      connect() {
        console.log('socket connected')
      },
      disconnect() {
        console.log('socket disconnected')
      },
      CONNECTED(data) {
        console.log('socket CONNECTED', data)
      },
      DISCONNECTED(data) {
        console.log('socket DISCONNECTED', data)
      },
      error(err) { console.error(err) }
    }
  },
  data() {
    return {}
  }
}
</script>

<style scoped>
</style>
