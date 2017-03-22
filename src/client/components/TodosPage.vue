<template>
  <div class="row">
    <h1 class="col s12 center">Todo list</h1>
    <div class="col s6 offset-s3">
      <input v-model="currentTodo" />
      <a class="btn" v-on:click="add">Add Todo</a>
    </div>
    <ul class="col s12 offset-s3">
      <li v-for="todo in todos">{{ todo }}</li>
    </ul>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'todos',
  computed: {
    ...mapGetters([
      'todos'
    ])
  },
  methods: {
    ...mapActions([
      'addTodo'
    ]),
    add() {
      this.addTodo(this.currentTodo)
    }
  },
  data() {
    return {
      currentTodo: 'New Item'
    }
  }
}
</script>

<style scoped>
</style>
