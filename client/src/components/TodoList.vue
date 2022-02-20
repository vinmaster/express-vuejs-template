<script setup lang="ts">
import { computed, Ref, ref } from 'vue';
import { Todo } from '../models/Todo';
import TodoItem from './TodoItem.vue';

defineProps<{ title: string; }>();
type FilterType = 'all' | 'active' | 'completed';

const input = ref('');
const filter: Ref<FilterType> = ref('all');
const todos: Ref<Todo[]> = ref([]);
const filteredTodos = computed(() => {
  if (filter.value === 'all') return todos.value;
  else if (filter.value === 'active') return todos.value.filter(t => !t.isDone);
  else return todos.value.filter(t => t.isDone);
})
const activeTodosCount = computed(() => todos.value.filter(t => !t.isDone).length);

function add() {
  if (!input.value) return;
  todos.value.push({ text: input.value, isDone: false });
  input.value = '';
}

function remove(index: number) {
  todos.value.splice(index, 1);
}
</script>

<template>
  <div class="container is-flex is-flex-direction-column is-justify-content-center mb-2" style="max-width: 500px;">
    <h1 class="has-text-centered">{{ title }} - Showing {{ filter }} ({{ activeTodosCount }} left)</h1>

    <div class="container is-fluid control mb-2">
      <label class="radio">
        <input type="radio" name="filter" value="all" v-model="filter" />
        All
      </label>
      <label class="radio">
        <input type="radio" name="filter" value="active" v-model="filter" />
        Active
      </label>
      <label class="radio">
        <input type="radio" name="filter" value="completed" v-model="filter" />
        Completed
      </label>
    </div>

    <input class="input mb-2" type="text" placeholder="Add new" @keyup.enter="add" v-model="input" />
    <button class="button is-primary" type="button" @click="add">Add</button>

    <div class="mb-4"></div>

    <ul>
      <TodoItem
        v-for="(todo, i) in filteredTodos" 
        :key="i" 
        v-model="filteredTodos[i]" 
        :i="i"
        @remove="remove"
      ></TodoItem>
      <!-- <li v-for="(todo, i) in filteredTodos" 
        :key="i" 
        class="notification is-info is-light" 
        style="user-select: none;"
      >
        <button class="delete" @click="remove(i)"></button>
        <input type="checkbox" 
          :id="'checkbox' + i" 
          v-model="todo.isDone" 
        >
        <label :for="'checkbox' + i" :style="{ textDecoration: todo.isDone ? 'line-through' : 'none' }">
          {{ todo.text }}
        </label>
      </li> -->
    </ul>
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
