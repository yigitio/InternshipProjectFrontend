<template>
  <div class="assignment-container">
    <h2>Görev Takibi</h2>

    <div v-if="isLoading" class="state-message">Yükleniyor...</div>
    <div v-else-if="error" class="state-message error">{{ error }}</div>

    <div v-else>
      <div class="filter-bar">
        <select v-model="filters.internName">
          <option value="">Stajyer (Tümü)</option>
          <option v-for="name in internNames" :key="name" :value="name">
            {{ name }}
          </option>
        </select>

        <select v-model="filters.status">
          <option value="">Statü (Tümü)</option>
          <option>To Do</option>
          <option>In Progress</option>
          <option>Completed</option>
        </select>

        <select v-model="filters.priority">
          <option value="">Öncelik (Tümü)</option>
          <option>Urgent</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
          <option>Optional</option>
        </select>

        <select v-model="filters.sort">
          <option value="assignedAt">Atanma Tarihi</option>
          <option value="dueDate">Bitiş Tarihi</option>
        </select>
        <select v-model="filters.size">
          <option :value="5">5</option>
          <option :value="15">15</option>
          <option :value="20">20</option>
        </select>
      </div>

      <div v-if="assignments.length === 0" class="state-message">
        Henüz atanmış bir görev bulunmuyor.
      </div>
      <div class="table-scroll">
        <table>
          <thead>
            <tr>
              <th>Görev Adı</th>
              <th>Açıklama</th>
              <th>Atanma</th>
              <th>Bitiş</th>
              <th>Öncelik</th>
              <th>Mentor</th>
              <th>Stajyer</th>
              <th>Durum</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="item in assignments" :key="item.id">
              <td>{{ item.assignmentName }}</td>
              <td>{{ item.assignmentDesc }}</td>
              <td>{{ formatDate(item.assignedAt) }}</td>
              <td>{{ formatDate(item.dueDate) }}</td>
              <td>{{ item.priority }}</td>
              <td>{{ item.mentorName }}</td>
              <td>{{ item.internName }}</td>
              <td>{{ item.status }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="pagination">
        <button @click="currentPage--" :disabled="currentPage === 0">◀</button>
        <span>Sayfa {{ currentPage + 1 }} / {{ totalPages }}</span>
        <button
          @click="currentPage++"
          :disabled="currentPage + 1 >= totalPages"
        >
          ▶
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue';
import { useMsal } from 'vue3-msal-plugin';
import { formatDate } from '@/utils/formatters';
import apiClient from '@/utils/apiClients';

interface Assignment {
  id: number;
  assignmentName: string;
  assignmentDesc: string;
  assignedAt: string;
  dueDate: string;
  priority: string;
  status: string;
  mentorName: string;
  internName: string;
}

const assignments = ref<Assignment[]>([]);
const allAssignments = ref<Assignment[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);
const currentPage = ref(0);
const totalPages = ref(0);

const mentorNames = ref<string[]>([]);
const internNames = ref<string[]>([]);

const { accounts } = useMsal();
const email = accounts.value[0].username;

const filters = reactive({
  status: '',
  priority: '',
  sort: 'assignedAt',
  size: 5,
  mentorName: '',
  internName: '',
});

const applyFiltersAndPagination = () => {
  let filtered = [...allAssignments.value];

  if (filters.status) {
    filtered = filtered.filter(a => a.status === filters.status);
  }
  if (filters.priority) {
    filtered = filtered.filter(a => a.priority === filters.priority);
  }
  if (filters.mentorName) {
    filtered = filtered.filter(a => a.mentorName === filters.mentorName);
  }
  if (filters.internName) {
    filtered = filtered.filter(a => a.internName === filters.internName);
  }

  filtered.sort((a, b) =>
    filters.sort === 'assignedAt'
      ? new Date(a.assignedAt).getTime() - new Date(b.assignedAt).getTime()
      : new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
  );

  totalPages.value = Math.ceil(filtered.length / filters.size);
  const start = currentPage.value * filters.size;
  const end = start + filters.size;
  assignments.value = filtered.slice(start, end);
};

const loadAssignments = async (mentorId: number, mentorFullName: string) => {
  try {
    isLoading.value = true;
    error.value = null;

    const fullRes = await apiClient.get('/api/assignments/paged', {
      params: {
        page: 0,
        size: 1000,
        mentorId,
      },
    });

    allAssignments.value = fullRes.data.content;
    mentorNames.value = Array.from(
      new Set(allAssignments.value.map(a => a.mentorName))
    );
    internNames.value = Array.from(
      new Set(
        allAssignments.value
          .filter(a => a.mentorName === mentorFullName)
          .map(a => a.internName)
      )
    );

    applyFiltersAndPagination();
  } catch (err) {
    console.error('Görevler alınırken hata:', err);
    error.value = 'Görevler yüklenirken bir hata oluştu.';
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  try {
    const mentorRes = await apiClient.get(`/api/mentors/email/${email}`);
    const mentorData = mentorRes.data;

    if (mentorData?.id) {
      const mentorFullName = mentorData.name + ' ' + mentorData.surname;
      filters.mentorName = mentorFullName;
      await loadAssignments(mentorData.id, mentorFullName);

      watch(
        [
          () => currentPage.value,
          () => filters.status,
          () => filters.priority,
          () => filters.sort,
          () => filters.mentorName,
          () => filters.internName,
          () => filters.size,
        ],
        applyFiltersAndPagination
      );
    } else {
      error.value = 'Mentor bilgisi bulunamadı.';
    }
  } catch (err) {
    error.value = 'Oturum bilgileri alınamadı.';
  }
});
</script>

<style scoped>
.assignment-container {
  padding: 2rem;
  flex-direction: column;
  font-family: sans-serif;
  width: 100%;
  box-sizing: border-box;
  overflow-y: auto; /* Scroll sadece içeride */
}
h2 {
  color: #2c3e50;
  margin-bottom: 1.5rem;
}
table {
  width: 100%;
  border-collapse: collapse;
}
thead {
  background-color: #242441;
  color: white;
}
th,
td {
  padding: 10px 12px;
  border: 1px solid #ddd;
  text-align: left;
}
tbody tr:nth-child(even) {
  background-color: #f8f9fa;
}
tbody tr:hover {
  background-color: #e9ecef;
}
.state-message {
  padding: 2rem;
  text-align: center;
  background-color: #f9f9f9;
  border-radius: 8px;
  font-size: 1.2rem;
  color: #555;
  margin-top: 1rem;
}
.error {
  background-color: #ffebee;
  color: #c62828;
}
.filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
}
.filter-bar select,
.filter-bar button {
  padding: 6px;
}
.pagination {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1.5rem;
}
.table-scroll {
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid #ddd;
}
</style>
