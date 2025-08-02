<!-- src/components/DashboardCard.vue -->
<template>
  <div class="dashboard-card">
    <h2 class="dashboard-title" v-if="title">{{ $t(title) }}</h2>
    <slot />
  </div>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

defineProps<{ title: string }>();
</script>

<style scoped>
.dashboard-card {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  background: white;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 0 40px rgba(36, 36, 65, 0.05);
}
.dashboard-title {
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 6px;
  margin-top: 6px;
}
</style>
