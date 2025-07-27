<template>
  <section class="staff-section">
    <h1 class="team-title">Senin İçin Buradayız</h1>
    <div class="team-cards">
      <div
        v-for="sup in supervisors"
        :key="sup.supervisorEmail"
        class="team-card"
      >
        <div
          class="avatar"
          :style="{ backgroundColor: colorOf(sup.departmentName) }"
        >
          {{ initials(sup.supervisorName) }}
        </div>
        <div class="card-body">
          <h3 class="card-dept">{{ sup.departmentName }}</h3>
          <p class="card-name">{{ sup.supervisorName }}</p>
          <p class="card-email">{{ sup.supervisorEmail }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import api from '@/utils/apiClients';
import { msalApp } from '@/main';

interface SupervisorDto {
  departmentName: string;
  supervisorName: string;
  supervisorEmail: string;
}

export default defineComponent({
  name: 'StaffView',
  setup() {
    const supervisors = ref<SupervisorDto[]>([]);

    onMounted(async () => {
      try {
        const account = msalApp.getActiveAccount();
        const email = account?.username ?? '';
        const { data: intern } = await api.get<{ id: number }>(
          '/api/interns/by-email',
          { params: { email } }
        );
        const { data } = await api.get<SupervisorDto[]>('/api/supervisors', {
          params: { internId: intern.id },
        });
        supervisors.value = data;
      } catch (err) {
        console.error('Supervisor fetch error:', err);
      }
    });

    const initials = (full: string) =>
      full
        .split(' ')
        .map(w => w[0])
        .join('')
        .toUpperCase();

    const colorOf = (dept: string) => {
      const d = dept.toLowerCase();
      if (d.includes('insan')) return '#FF8C42';
      if (d.includes('bilgi')) return '#005F99';
      if (d.includes('finance')) return '#4CAF50';
      return '#888';
    };

    return { supervisors, initials, colorOf };
  },
});
</script>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;600&display=swap');

.staff-section {
  background: #f9f9fa;
  padding: 4rem 1rem;
  text-align: center;
  font-family: 'Poppins', sans-serif;
  min-height: 100vh;
}

.team-title {
  font-size: 1.8rem;
  font-weight: 700;
  color: #242441;
  margin-bottom: 2.5rem;
  position: relative;
  display: inline-block;
  letter-spacing: -1px;
}
.team-title::after {
  content: '';
  display: block;
  width: 4rem;
  height: 4px;
  background: #ff8c42;
  margin: 0.5rem auto 0;
  border-radius: 2px;
}

.team-cards {
  display: flex;
  gap: 2.5rem;
  justify-content: center;
  flex-wrap: wrap;
  max-width: 900px;
  margin: 0 auto;
}

.team-card {
  position: relative;
  background: #fff;
  border-radius: 1.5rem;
  box-shadow: 0 4px 20px 0 rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.2s, transform 0.2s;
  min-width: 320px;
  max-width: 360px;
  min-height: 310px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 56px; /* Avatar alanı için boşluk */
  padding-bottom: 2.3rem;
  margin-top: 2.5rem;
}

.team-card:hover {
  transform: translateY(-4px) scale(1.025);
  box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.13);
}

.avatar {
  position: absolute;
  top: -46px;
  left: 50%;
  transform: translateX(-50%);
  width: 92px;
  height: 92px;
  border-radius: 50%;
  background: #005f99;
  border: 6px solid #fff;
  font-size: 2.3rem;
  font-weight: 700;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 18px 0 rgba(0, 0, 0, 0.18);
  z-index: 3;
}

.card-body {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 18px;
}

.card-dept {
  font-size: 1.22rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #242441;
  letter-spacing: -0.5px;
}

.card-name {
  font-size: 1.08rem;
  color: #333;
  margin-bottom: 0.3rem;
  font-weight: 500;
}

.card-email {
  font-size: 0.98rem;
  color: #6d6d6d;
  word-break: break-all;
  margin-top: 0.12rem;
  letter-spacing: 0.01em;
}

/* Mobilde daha derli toplu görünüm */
@media (max-width: 700px) {
  .team-cards {
    flex-direction: column;
    align-items: center;
    gap: 1.6rem;
  }
  .team-card {
    min-width: 92vw;
    max-width: 99vw;
    padding-left: 0.8rem;
    padding-right: 0.8rem;
  }
}
</style>
