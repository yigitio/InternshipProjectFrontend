<template>
  <div class="dashboard-grid">
    <!-- PieChart -->
    <DashboardCard title="Assignment Durumu" class="card-pie">
      <PieChart :data="assignmentStats[email]" v-if="assignmentStats[email]" />
      <p v-else>Henüz bir assignment atanmadı.</p>
    </DashboardCard>

    <!-- Greeting -->
    <DashboardCard title="" class="card-greeting">
      <div class="greeting-box">{{ greetingMessage }}</div>
    </DashboardCard>

    <!-- Duyurular -->
    <DashboardCard title="Duyurular" class="card-announcement">
      <div class="announcement-table-scroll">
        <table class="announcement-table" v-if="announcements.length">
          <thead>
            <tr>
              <th>Duyuru</th>
              <th>Tarih</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="a in announcements" :key="a.createdAt">
              <td>
                <button class="announcement-title-btn" @click="togglePopup(a)">
                  {{ a.title }}
                </button>
              </td>
              <td>{{ formatDate(a.createdAt) }}</td>
            </tr>
          </tbody>
        </table>

        <!-- Popup gösterimi -->
        <div v-if="selectedAnnouncement" class="popup-overlay">
          <div class="popup-content">
            <h4>{{ selectedAnnouncement.title }}</h4>
            <p>{{ selectedAnnouncement.content }}</p>
            <button @click="closePopup" class="popup-close">Kapat</button>
          </div>
        </div>

        <p v-else-if="!announcements.length">
          Şu anda herhangi bir duyuru yok.
        </p>
      </div>
    </DashboardCard>

    <!-- Yapılacaklar -->
    <DashboardCard title="Yapılacaklar" class="card-todo">
      <div class="table-scroll">
        <table
          class="assignment-table"
          v-if="
            assignments.filter(a => a.status.toLowerCase() !== 'completed')
              .length
          "
        >
          <thead>
            <tr>
              <th>Görev</th>
              <th>Atanma</th>
              <th>Öncelik</th>
              <th>Durum</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="a in assignments.filter(
                a => a.status.toLowerCase() !== 'completed'
              )"
              :key="a.id"
            >
              <td>{{ a.assignmentName }}</td>
              <td>{{ formatDate(a.assignedAt) }}</td>
              <td>
                <span
                  :class="['priority-dot', a.priority.toLowerCase()]"
                ></span>
                {{ a.priority }}
              </td>
              <td>{{ a.status }}</td>
            </tr>
          </tbody>
        </table>
        <p v-else>Henüz görev atanmadı ya da tüm görevler tamamlandı.</p>
      </div>
    </DashboardCard>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useMsal } from 'vue3-msal-plugin';
import PieChart from '@/components/PieChart.vue';
import DashboardCard from '@/components/DashboardCard.vue';
import apiClient from '@/utils/apiClients';

interface Assignment {
  id: number;
  assignmentName: string;
  assignmentDesc: string;
  status: string;
  priority: string;
  dueDate: string;
  assignedAt: string;
  completedAt: string;
  internId: number;
  internName: string;
  mentorId: number;
  mentorName: string;
}

interface Announcement {
  title: string;
  content: string;
  createdAt: string;
}

const { accounts } = useMsal();
const email = accounts.value[0].username;

const assignmentStats = ref<Record<string, { name: string; value: number }[]>>(
  {}
);
const assignments = ref<Assignment[]>([]);
const greetingMessage = ref('');
const internName = ref('');
const announcements = ref<Announcement[]>([]);
const selectedAnnouncement = ref<Announcement | null>(null);

const togglePopup = (a: Announcement) => {
  selectedAnnouncement.value = a;
};

const closePopup = () => {
  selectedAnnouncement.value = null;
};

onMounted(async () => {
  const hour = new Date().getHours();
  const baseGreeting =
    hour < 12 ? 'Günaydın' : hour < 18 ? 'İyi günler' : 'İyi akşamlar';

  try {
    const internRes = await apiClient.get(
      `/api/interns/by-email?email=${email}`
    );
    internName.value = internRes.data.name;
    greetingMessage.value = `${baseGreeting}, ${internName.value}! ${
      hour < 18 ? '🌤️' : '🌙'
    }`;
  } catch (err) {
    console.error('İsim alınamadı:', err);
    greetingMessage.value = `${baseGreeting}! 🌤️`;
  }

  try {
    const res = await apiClient.get<Announcement[]>(
      `/api/announcements/recent?email=${email}`
    );
    announcements.value = res.data.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (err) {
    console.error('Duyurular alınamadı:', err);
  }

  try {
    const res = await apiClient.get('/api/assignments/stats');
    const transformed = Object.fromEntries(
      Object.entries(res.data).map(([email, stats]) => {
        const chartData = Object.entries(stats as Record<string, number>).map(
          ([name, value]) => ({ name, value })
        );
        return [email, chartData];
      })
    );
    assignmentStats.value = transformed;
  } catch (err) {
    console.error('Assignment stats alınamadı:', err);
  }

  try {
    const res = await apiClient.get(`/api/assignments/intern?email=${email}`);

    assignments.value = res.data.sort((a: Assignment, b: Assignment) => {
      return (
        new Date(b.assignedAt).getTime() - new Date(a.assignedAt).getTime()
      );
    });
  } catch (err) {
    console.error('Atanan görevler alınamadı:', err);
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
    'pie greeting'
    'pie announcement'
    'todo todo';
  gap: 12px;
  padding: 12px;
  max-width: 1100px;
  margin: auto;
  box-sizing: border-box;
}

/* Grid bölgeleri */
.card-pie {
  grid-area: pie;
}
.card-greeting {
  grid-area: greeting;
}
.card-announcement {
  grid-area: announcement;
}
.card-todo {
  grid-area: todo;
}

/* Greeting kutusu */
.greeting-box {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
}

/* Duyurular scroll */
.announcement-scroll {
  margin-top: 8px;
  max-height: 150px;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: #c1c1c1 transparent;
}
.announcement-scroll::-webkit-scrollbar {
  width: 6px;
}
.announcement-scroll::-webkit-scrollbar-thumb {
  background-color: #c1c1c1;
  border-radius: 4px;
}
.announcement-scroll ul {
  list-style: none;
  padding-left: 0;
}
.announcement-scroll li {
  margin-bottom: 6px;
  font-size: 0.95rem;
}

/* Tablo stil */
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

/* Scroll alanı sadece tabloya */
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

/* Priority renkleri */
.priority-dot {
  display: inline-block;
  width: 10px;
  height: 10px;
  margin-right: 6px;
  border-radius: 50%;
  vertical-align: middle;
}
.priority-dot.urgent {
  background-color: red;
}
.priority-dot.high {
  background-color: orange;
}
.priority-dot.medium {
  background-color: gold;
}
.priority-dot.low {
  background-color: green;
}
.priority-dot.optional {
  background-color: lightgray;
}
.priority-dot.normal {
  background-color: #5c6bc0;
}
.announcement-table-scroll {
  overflow-y: auto;
  max-height: 150px;
  border-top: 1px solid #eee;
  margin-top: 10px;
  padding-right: 6px;
  scrollbar-width: thin;
  scrollbar-color: #c1c1c1 transparent;
}

.announcement-table-scroll::-webkit-scrollbar {
  width: 6px;
}
.announcement-table-scroll::-webkit-scrollbar-thumb {
  background-color: #c1c1c1;
  border-radius: 4px;
}

.announcement-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}

.announcement-table th,
.announcement-table td {
  padding: 10px;
  border-bottom: 1px solid #ddd;
  text-align: left;
}

.announcement-row:hover {
  background-color: #f8f8f8;
  cursor: pointer;
}
.announcement-title-btn {
  background: none;
  border: none;
  color: #242441;
  text-decoration: underline;
  cursor: pointer;
  padding: 0;
  font-size: 0.95rem;
}

/* Popup dışı alan */
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

/* Popup içeriği */
.popup-content {
  background: white;
  border-radius: 8px;
  padding: 20px;
  width: 300px;
  max-width: 90%;
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.2);
  animation: fadeIn 0.2s ease;
}

.popup-content h4 {
  margin-top: 0;
  font-size: 1.1rem;
  margin-bottom: 8px;
}

.popup-close {
  margin-top: 12px;
  background: #242441;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.assignment-table td:first-child {
  white-space: normal;
  word-break: break-word;
  max-width: 200px;
}
</style>
