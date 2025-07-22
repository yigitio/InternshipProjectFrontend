<template>
  <div class="dashboard-grid">
    <DashboardCard title="Stajyerler"></DashboardCard>
    <DashboardCard title="Atanmış Görevler"></DashboardCard>
    <DashboardCard title="Tamamlananlar"></DashboardCard>
    <DashboardCard title="Mesajlar"></DashboardCard>
  </div>
</template>

<script setup lang="ts">
import DashboardCard from '@/components/DashboardCard.vue';
</script>

<style scoped>
.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, 1fr);
  gap: 20px;
  height: 80vh;
  box-sizing: border-box;
  padding: 10px;
  font-size: 12px;
}

.card {
  display: flex;
  flex-direction: column;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.08);
  background-color: #fff;
  overflow: hidden;
  height: 100%;
}

@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    height: auto;
  }
}
</style>
