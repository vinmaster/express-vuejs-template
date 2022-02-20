<script setup lang="ts">
import { Todo } from '../models/Todo';

// const props = defineProps({ modelValue: Todo, i: Number; })
// const emit = defineEmits(['update:modelValue', 'remove'])
const props = defineProps<{modelValue: Todo; i: number;}>();
const emit = defineEmits<{
  (e: 'update:modelValue', modelValue: Todo): void
  (e: 'remove', i: number): void
}>()
</script>

<template>
<li class="notification is-info is-light" style="user-select: none;">
  <button class="delete" @click="emit('remove', i)"></button>
  <input type="checkbox" 
    :id="'checkbox' + i" 
    v-model="props.modelValue.isDone" 
  >
  <label :for="'checkbox' + i" :style="{ textDecoration: props.modelValue.isDone ? 'line-through' : 'none' }">
    {{ props.modelValue.text }}
  </label>
</li>
</template>
