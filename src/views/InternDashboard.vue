<template>
  <div class="dashboard-grid">
    <!-- PieChart -->
    <DashboardCard title="Assignment Durumu">
      <template
        v-if="
          assignmentStats &&
          assignmentStats[email] &&
          assignmentStats[email].length
        "
      >
        <PieChart :data="assignmentStats[email]" />
      </template>
      <template v-else>
        <p>Henüz bir assignment atanmadı.</p>
      </template>
    </DashboardCard>

    <!-- Greeting -->
    <DashboardCard title=" ">
      <div class="greeting-box">{{ greetingMessage }}</div>
    </DashboardCard>

    <!-- Yapılacaklar -->
    <DashboardCard title="Yapılacaklar" class="assignment-full-card">
      <div class="table-scroll">
        <table class="assignment-table" v-if="assignments.length">
          <thead>
            <tr>
              <th>Öncelik</th>
              <th>Görev</th>
              <th>Atanma</th>
              <th>Durum</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="a in assignments" :key="a.id">
              <td>
                <span
                  :class="['priority-dot', a.priority.toLowerCase()]"
                ></span>
                {{ a.priority }}
              </td>
              <td>{{ a.assignmentName }}</td>
              <td>{{ formatDate(a.assignedAt) }}</td>
              <td>{{ a.status }}</td>
            </tr>
          </tbody>
        </table>
        <p v-else>Henüz görev atanmadı.</p>
      </div>
    </DashboardCard>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useMsal } from 'vue3-msal-plugin';
import PieChart from '@/components/PieChart.vue';
import DashboardCard from '@/components/DashboardCard.vue';

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

const { accounts } = useMsal();
const email = accounts.value[0].username;

const assignmentStats = ref<Record<string, { name: string; value: number }[]>>(
  {}
);
const assignments = ref<Assignment[]>([]);
const greetingMessage = ref('');

onMounted(async () => {
  const hour = new Date().getHours();
  greetingMessage.value =
    hour < 12
      ? 'Günaydın! ☀️'
      : hour < 18
      ? 'İyi günler! 🌤️'
      : 'İyi akşamlar! 🌙​';

  try {
    const res = await axios.get('http://localhost:8080/api/assignments/stats');
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
    const res = await axios.get(
      `http://localhost:8080/api/assignments/intern?email=${email}`
    );

    assignments.value = res.data.sort((a: Assignment, b: Assignment) => {
      return (
        new Date(a.assignedAt).getTime() - new Date(b.assignedAt).getTime()
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

.greeting-box {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  font-size: 1.2rem;
  font-weight: 600;
  color: #333;
}

.assignment-full-card {
  grid-column: span 2;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.table-scroll {
  overflow-y: auto;
  max-height: 250px;
  border-top: 1px solid #eee;
  margin-top: 10px;
  padding-right: 6px;
  scrollbar-width: thin;
  scrollbar-color: #c1c1c1 transparent;
}

/* Scrollbar görünümü: Webkit */
.table-scroll::-webkit-scrollbar {
  width: 6px;
}
.table-scroll::-webkit-scrollbar-thumb {
  background-color: #c1c1c1;
  border-radius: 4px;
}
.table-scroll::-webkit-scrollbar-track {
  background: transparent;
}

/* Responsive tablo sarmalayıcı */
.table-scroll table {
  min-width: 100%;
}

/* Mobil için responsive grid */
@media (max-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr;
    grid-template-rows: auto;
    height: auto;
  }

  .assignment-full-card {
    grid-column: span 1;
  }

  .table-scroll {
    max-height: none;
    overflow-x: auto;
  }

  .assignment-table {
    min-width: 600px;
  }
}
</style>
