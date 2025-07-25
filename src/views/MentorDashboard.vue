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
  gap: 12px;
  padding: 12px;
  max-width: 900px;
  margin: 0px;
  height: calc(100vh - 140px);
  min-height: 300px;
  box-sizing: border-box;
}

.card {
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  padding: 12px;
  height: 100%;
  display: flex;
  flex-direction: column;
}

@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    height: auto;
  }
}
</style>
