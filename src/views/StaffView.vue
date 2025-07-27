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
          class="card-header"
          :style="{ backgroundColor: colorOf(sup.departmentName) }"
        ></div>
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
import api from '@/utils/apiClients'; // axios yerine kendi api'niz
import { msalApp } from '@/main'; // Eğer MSAL kullanıyorsan

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
        // 1. Aktif kullanıcının email'ini çek (MSAL ile)
        const account = msalApp.getActiveAccount();
        const email = account?.username ?? '';

        // 2. Backend'den bu email'e karşılık gelen intern'in id'sini al
        const { data: intern } = await api.get<{ id: number }>(
          '/api/interns/by-email',
          {
            params: { email },
          }
        );

        // 3. Sadece bu intern'e atanan sorumluları çek
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
      if (d.includes('insan')) return '#FF8C42'; // turuncu
      if (d.includes('bilgi')) return '#005F99'; // koyu mavi
      if (d.includes('finance')) return '#4CAF50'; // yeşil
      return '#888'; // diğerler için gri
    };

    return { supervisors, initials, colorOf };
  },
});
</script>

<style scoped>
/* Stil kodların aynen kalabilir */
.staff-section {
  background: #ffffff;
  padding: 4rem 1rem;
  text-align: center;
}
.team-title {
  font-size: 1.25rem;
  color: #242441;
  margin-bottom: 3rem;
  position: relative;
  display: inline-block;
}
.team-title::after {
  content: '';
  display: block;
  width: 6rem;
  height: 4px;
  background: #ff8c42;
  margin: 0.5rem auto 0;
  border-radius: 2px;
}
.team-cards {
  display: grid;
  gap: 2rem;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  max-width: 1000px;
  margin: 0 auto;
}
.team-card {
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.08);
  overflow: hidden;
  transition: transform 0.2s, box-shadow 0.2s;
}
.team-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
}
.card-header {
  height: 6px;
  width: 100%;
}
.avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  margin: -32px auto 0;
  font-size: 1.25rem;
  font-weight: bold;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  position: relative;
  z-index: 1;
}
.card-body {
  padding: 1.5rem 1rem 2rem;
}
.card-dept {
  font-size: 1.5rem;
  font-weight: 600;
  color: #005f99;
  margin-bottom: 0.75rem;
}
.card-name {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: #333;
}
.card-email {
  font-size: 1rem;
  color: #666;
}
</style>
