<template>
  <div class="dashboard-grid">
    <!-- Greeting -->
    <DashboardCard title="" class="card-greeting">
      <div class="greeting-box">{{ greetingMessage }}</div>
    </DashboardCard>

    <!-- Stajyerler -->
    <DashboardCard title="Stajyerler" class="card-interns">
      <div class="table-scroll">
        <p>Stajyer listesi burada gösterilecek.</p>
      </div>
    </DashboardCard>

    <!-- Atanmış Görevler -->
    <DashboardCard title="Atanmış Görevler" class="card-assigned">
      <div class="table-scroll">
        <p>Atanmış görevler burada listelenecek.</p>
      </div>
    </DashboardCard>

    <!-- Mesajlar -->
    <DashboardCard title="Mesajlar" class="card-messages">
      <div class="table-scroll">
        <p>Mesaj kutusu burada olacak.</p>
      </div>
    </DashboardCard>
  </div>
</template>

<script setup lang="ts">
import DashboardCard from '@/components/DashboardCard.vue';
import { ref, onMounted } from 'vue';
import apiClient from '@/utils/apiClients';
import { useMsal } from 'vue3-msal-plugin';

const mentorName = ref('');
const greetingMessage = ref('');
const { accounts } = useMsal();
const email = accounts.value[0].username;

onMounted(async () => {
  const hour = new Date().getHours();
  const baseGreeting =
    hour < 12 ? 'Günaydın' : hour < 18 ? 'İyi günler' : 'İyi akşamlar';

  try {
    const mentorRes = await apiClient.get(`/api/mentors/email/${email}`);
    mentorName.value = mentorRes.data.name;
    greetingMessage.value = `${baseGreeting}, ${mentorName.value}! ${
      hour < 18 ? '🌤️' : '🌙'
    }`;
  } catch (err) {
    console.error('İsim alınamadı:', err);
    greetingMessage.value = `${baseGreeting}! 🌤️`;
  }
});
</script>

<style scoped>
.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto 1fr 1fr;
  grid-template-areas:
    'greeting greeting'
    'interns assigned'
    'messages messages';
  gap: 12px;
  padding: 12px;
  max-width: 1100px;
  margin: auto;
  box-sizing: border-box;
}

.card-greeting {
  grid-area: greeting;
}
.card-interns {
  grid-area: interns;
}
.card-assigned {
  grid-area: assigned;
}
.card-messages {
  grid-area: messages;
}

.greeting-box {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
}

.table-scroll {
  overflow-y: auto;
  max-height: 170px;
  border-top: 1px solid #eee;
  margin-top: 10px;
  padding-right: 6px;
  scrollbar-width: thin;
  scrollbar-color: #c1c1c1 transparent;
}
.table-scroll::-webkit-scrollbar {
  width: 6px;
}
.table-scroll::-webkit-scrollbar-thumb {
  background-color: #c1c1c1;
  border-radius: 4px;
}

@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    grid-template-areas:
      'greeting'
      'interns'
      'assigned'
      'messages';
  }
}
</style>
