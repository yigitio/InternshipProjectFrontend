<template>
  <div class="dashboard-grid">
    <!-- Greeting -->
    <DashboardCard title="" class="card-greeting">
      <div class="greeting-box">{{ greetingMessage }}</div>
    </DashboardCard>

    <!-- Mesajlar -->
    <DashboardCard title="Mesajlar" class="card-messages">
      <div class="table-scroll">
        <p>Mesaj kutusu burada olacak.</p>
      </div>
    </DashboardCard>

    <!-- Atanmış Görevler -->
    <DashboardCard title="Atanmış Görevler" class="card-assigned">
      <div class="table-scroll">
        <p>Atanmış görevler burada listelenecek.</p>
      </div>
    </DashboardCard>

    <!-- Stajyerler -->
    <DashboardCard title="Stajyerler" class="card-interns">
      <div class="table-scroll">
        <table class="assignment-table" v-if="interns.length">
          <thead>
            <tr>
              <th>Ad Soyad</th>
              <th>Email</th>
              <th>Üniversite</th>
              <th>Bölüm</th>
              <th>Başlangıç</th>
              <th>Bitiş</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="intern in interns" :key="intern.id">
              <td>{{ intern.name }} {{ intern.surname }}</td>
              <td>{{ intern.email }}</td>
              <td>{{ intern.university }}</td>
              <td>{{ intern.department }}</td>
              <td>{{ formatDate(intern.startDate) }}</td>
              <td>{{ formatDate(intern.endDate) }}</td>
            </tr>
          </tbody>
        </table>
        <p v-else>Henüz stajyer bilgisi bulunamadı.</p>
      </div>
    </DashboardCard>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import DashboardCard from '@/components/DashboardCard.vue';
import apiClient from '@/utils/apiClients';
import { useMsal } from 'vue3-msal-plugin';

interface Intern {
  id: number;
  name: string;
  surname: string;
  email: string;
  university: string;
  department: string;
  startDate: string;
  endDate: string;
}

const interns = ref<Intern[]>([]);
const mentorName = ref('');
const greetingMessage = ref('');
const mentorId = ref<number | null>(null);
const { accounts } = useMsal();
const email = accounts.value[0].username;

onMounted(async () => {
  const hour = new Date().getHours();
  const baseGreeting =
    hour < 12 ? 'Günaydın' : hour < 18 ? 'İyi günler' : 'İyi akşamlar';

  try {
    const mentorRes = await apiClient.get(`/api/mentors/email/${email}`);
    mentorName.value = mentorRes.data.name;
    mentorId.value = mentorRes.data.id;

    greetingMessage.value = `${baseGreeting}, ${mentorName.value}! ${
      hour < 18 ? '🌤️' : '🌙'
    }`;
  } catch (err) {
    console.error('Mentor bilgisi alınamadı:', err);
    greetingMessage.value = `${baseGreeting}! 🌤️`;
  }

  try {
    if (mentorId.value !== null) {
      const internsRes = await apiClient.get(
        `/api/interns/${mentorId.value}/interns`
      );
      interns.value = internsRes.data;
    }
  } catch (err) {
    console.error('Stajyerler alınamadı:', err);
  }
});

const formatDate = (date: string) => new Date(date).toLocaleDateString('tr-TR');
</script>

<style scoped>
.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto 1fr auto;
  grid-template-areas:
    'greeting greeting'
    'messages assigned'
    'interns interns';
  gap: 12px;
  padding: 12px;
  max-width: 1100px;
  margin: auto;
  box-sizing: border-box;
}

.card-greeting {
  grid-area: greeting;
}
.card-messages {
  grid-area: messages;
}
.card-assigned {
  grid-area: assigned;
}
.card-interns {
  grid-area: interns;
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
  max-height: 220px;
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

.assignment-table {
  width: 100%;
  border-collapse: collapse;
}
.assignment-table th,
.assignment-table td {
  padding: 10px;
  font-size: 13px;
  border-bottom: 1px solid #ddd;
  text-align: left;
}

@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
    grid-template-areas:
      'greeting'
      'messages'
      'assigned'
      'interns';
  }
}
</style>
