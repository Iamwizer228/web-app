<script setup lang="ts">
import { onMounted } from 'vue'
import Todo from './components/ToDo.vue'

onMounted(() => {
  if (!localStorage.tasks) {
    localStorage.tasks = '[]'
  }
})
</script>

<template>
  <div id="app">
    <Todo />
  </div>
</template>

<style></style>
