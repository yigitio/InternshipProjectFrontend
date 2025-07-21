<template>
  <div class="card">
    <h2 class="text-lg font-bold mb-2">{{ title }}</h2>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

defineProps<{ title: string }>();
</script>

<style scoped>
.dashboard-card {
  height: 100%;
  display: grid;
  flex-direction: column;
  justify-content: flex-start;
  background: white;
  border-radius: 10px;
  padding: 16px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
}
</style>
