<template>
  <div class="staff-page">
    <h1 class="title">Senin İçin Buradayız</h1>

    <div v-if="supervisors.length === 0" class="empty-text">
      Henüz destek sorumlusu atanmadı.
    </div>

    <div class="card-container" v-else>
      <div
        class="card"
        v-for="person in supervisors"
        :key="person.supervisorEmail"
      >
        <div class="icon"><i class="fas fa-users"></i></div>
        <div class="dept">{{ person.departmentName }}</div>
        <div class="name">{{ person.supervisorName }}</div>
        <div class="email">{{ person.supervisorEmail }}</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '@/utils/apiClients';

interface Supervisor {
  departmentName: string;
  supervisorName: string;
  supervisorEmail: string;
}

const supervisors = ref<Supervisor[]>([]);

onMounted(async () => {
  const res = await api.get('/api/supervisors');
  supervisors.value = res.data;
});
</script>

<style scoped>
.staff-page {
  margin-left: 240px;
  padding: 30px;
}

.title {
  font-size: 28px;
  font-weight: bold;
  margin-bottom: 20px;
}

.empty-text {
  margin-top: 20px;
  color: #777;
}

.card-container {
  display: flex;
  flex-wrap: wrap;
  gap: 24px;
}

.card {
  background: white;
  padding: 16px;
  width: 220px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.icon {
  font-size: 30px;
  margin-bottom: 10px;
}

.dept {
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 6px;
}

.name {
  font-size: 15px;
}

.email {
  font-size: 13px;
  color: gray;
  word-break: break-word;
}
</style>
