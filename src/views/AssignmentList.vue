<script setup lang="ts">
import { ref, reactive, onMounted, watch } from 'vue';
import {
  fetchAssignmentsPaged,
  updateAssignment,
  type Assignment,
} from '@/utils/assignmentService';
import { useMsal } from 'vue3-msal-plugin';
import { formatDate } from '@/utils/formatters';
import apiClient from '@/utils/apiClients';

const assignments = ref<Assignment[]>([]);
const totalPages = ref(0);
const isLoading = ref(true);
const error = ref<string | null>(null);

const { accounts } = useMsal();
const email = accounts.value[0].username;

const currentPage = ref(0);
const filters = reactive({
  status: '',
  sort: 'assignedAt',
  size: 5,
});

const statusOptions = ['To Do', 'In Progress', 'Completed'];
const sortOptions = [
  { label: 'Atanma Tarihi', value: 'assignedAt' },
  { label: 'Bitiş Tarihi', value: 'dueDate' },
];

// Modal kontrolü
const showModal = ref(false);
const selectedAssignment = ref<Assignment | null>(null);
const previousStatus = ref<string>('');

// Modal üzerinden onaylama akışı
const handleStatusChange = (assignment: Assignment) => {
  if (assignment.status === 'Completed') {
    selectedAssignment.value = assignment;
    showModal.value = true;
  } else {
    updateStatusDirectly(assignment);
  }
};

const updateStatusDirectly = async (assignment: Assignment) => {
  if (!assignment.id) return;
  try {
    await updateAssignment(assignment.id, { status: assignment.status });
    window.location.reload(); // ✅ PieChart + Dashboard assignment'ları tekrar çeker
  } catch (err) {
    console.error('Statü güncellenirken hata:', err);
    alert('Statü güncellenemedi.');
  }
};

const confirmCompletion = () => {
  if (selectedAssignment.value) {
    updateStatusDirectly(selectedAssignment.value);
    selectedAssignment.value = null;
    showModal.value = false;
  }
};

const cancelCompletion = () => {
  if (selectedAssignment.value) {
    selectedAssignment.value.status = previousStatus.value;
    selectedAssignment.value = null;
    showModal.value = false;
  }
};

const loadAssignments = async (internId: number) => {
  try {
    isLoading.value = true;
    error.value = null;

    const response = await fetchAssignmentsPaged({
      internId,
      page: currentPage.value,
      size: filters.size,
      sort: filters.sort,
      status: filters.status,
    });

    assignments.value = response.content;
    totalPages.value = response.totalPages;
  } catch (err) {
    console.error('Görevler çekilirken hata:', err);
    error.value = 'Görevler yüklenemedi.';
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  try {
    const res = await apiClient.get(`/api/interns/by-email?email=${email}`);
    const internId = res.data?.id;
    if (internId) {
      await loadAssignments(internId);
      watch(
        [
          () => currentPage.value,
          () => filters.status,
          () => filters.sort,
          () => filters.size,
        ],
        () => loadAssignments(internId)
      );
    } else {
      error.value = 'Stajyer bilgisi alınamadı.';
    }
  } catch (err) {
    error.value = 'Kullanıcı bilgisi alınamadı.';
  }
});
</script>

<template>
  <div class="assignment-container">
    <h2>Görev Takibi</h2>

    <div class="filter-bar">
      <select v-model="filters.status">
        <option value="">Statü (Tümü)</option>
        <option v-for="s in statusOptions" :key="s" :value="s">{{ s }}</option>
      </select>

      <select v-model="filters.sort">
        <option v-for="o in sortOptions" :key="o.value" :value="o.value">
          {{ o.label }}
        </option>
      </select>

      <select v-model="filters.size">
        <option :value="5">5</option>
        <option :value="15">15</option>
        <option :value="20">20</option>
      </select>
    </div>

    <div v-if="isLoading" class="state-message">Yükleniyor...</div>
    <div v-else-if="error" class="state-message error">{{ error }}</div>

    <div v-else>
      <div v-if="assignments.length === 0" class="state-message">
        Henüz atanmış görev yok.
      </div>

      <div class="table-scroll" v-else>
        <table>
          <thead>
            <tr>
              <th>Görev Adı</th>
              <th>Açıklama</th>
              <th>Atanma</th>
              <th>Bitiş</th>
              <th>Öncelik</th>
              <th>Mentor</th>
              <th>Statü</th>
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
              <td>
                <select
                  v-model="item.status"
                  @focus="previousStatus = item.status || ''"
                  @change="handleStatusChange(item)"
                  :disabled="item.status === 'Completed'"
                  :title="
                    item.status === 'Completed'
                      ? 'Bu görev tamamlandı ve artık değiştirilemez.'
                      : ''
                  "
                >
                  <option v-for="s in statusOptions" :key="s" :value="s">
                    {{ s }}
                  </option>
                </select>
              </td>
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

    <!-- ✅ MODAL -->
    <div v-if="showModal" class="modal-overlay">
      <div class="modal-content">
        <p>
          Bu görevi <strong>tamamlandı</strong> olarak işaretlemek
          istediğinizden emin misiniz?
        </p>
        <div class="modal-buttons">
          <button @click="confirmCompletion">Evet</button>
          <button @click="cancelCompletion">Vazgeç</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.assignment-container {
  padding: 2rem;
  font-family: sans-serif;
  width: 100%;
  box-sizing: border-box;
}
h2 {
  color: #2c3e50;
  margin-bottom: 1.5rem;
}
.filter-bar {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
}
.filter-bar select {
  padding: 6px;
}
.table-scroll {
  max-height: 400px;
  overflow-y: auto;
  border: 1px solid #ddd;
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
  padding: 12px 18px;
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
.pagination {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
}

/* MODAL */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-content {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  text-align: center;
  max-width: 400px;
  width: 100%;
}
.modal-buttons {
  margin-top: 1.5rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
}
.modal-buttons button {
  padding: 0.5rem 1.2rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: bold;
}
.modal-buttons button:first-child {
  background-color: #242441;
  color: white;
}
.modal-buttons button:last-child {
  background-color: #e0e0e0;
}
</style>
