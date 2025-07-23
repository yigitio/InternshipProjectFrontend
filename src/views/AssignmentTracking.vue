<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useMsal } from 'vue3-msal-plugin';

// Backend'den gelecek Assignment nesnesinin tip tanımı
interface Assignment {
  id: number;
  assignmentName: string;
  assignmentDesc: string;
  assignedAt: string;
  dueDate: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  internName: string; // Stajyerin adı
  completedAt: string; // Bitiş tarihini tutmak için
  mentorName: string; // Mentorun adı
}

const assignments = ref<Assignment[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);

const { accounts } = useMsal();
const email = accounts.value[0].username;

// Tarih formatlama için yardımcı fonksiyon
const formatDate = (dateString: string) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('tr-TR'); // tr-TR formatı gg.aa.yyyy
};

const loadAssignments = async (mentorId: number) => {
  try {
    isLoading.value = true;
    const response = await axios.get<Assignment[]>(
      `/api/assignments/by-mentor/${mentorId}`
    );
    assignments.value = response.data;
  } catch (err) {
    console.error('Görevler çekilirken hata oluştu:', err);
    error.value = 'Görevler yüklenemedi.';
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  try {
    // Önce mentorun ID'sini email ile alıyoruz
    const mentorRes = await axios.get(`/api/mentors/email/${email}`);
    const mentorData = mentorRes.data;

    if (mentorData && mentorData.id) {
      await loadAssignments(mentorData.id);
    } else {
      error.value = 'Mentor bilgisi bulunamadı.';
      isLoading.value = false;
    }
  } catch (err) {
    error.value = 'Oturum bilgileri alınamadı.';
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="tracking-container">
    <h2>Stajyer Görev Takibi</h2>

    <div v-if="isLoading" class="state-message">Yükleniyor...</div>

    <div v-else-if="error" class="state-message error">{{ error }}</div>

    <div v-else>
      <div v-if="assignments.length === 0" class="state-message">
        Stajyerlerinize atanmış herhangi bir görev bulunmuyor.
      </div>
      <table v-else>
        <thead>
          <tr>
            <th>Stajyer Adı</th>
            <th>Mentor Adı</th>
            <th>Görev Adı</th>
            <th>Açıklama</th>
            <th>Başlangıç Tarihi</th>
            <th>Bitiş Tarihi</th>
            <th>Statü</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="assignment in assignments" :key="assignment.id">
            <td>{{ assignment.internName }}</td>
            <td>{{ assignment.mentorName }}</td>
            <td>{{ assignment.assignmentName }}</td>
            <td>{{ assignment.assignmentDesc }}</td>
            <td>
              {{
                assignment.status === 'In Progress'
                  ? formatDate(assignment.assignedAt)
                  : '-'
              }}
            </td>
            <td>
              {{
                assignment.status === 'Completed'
                  ? formatDate(assignment.completedAt)
                  : '-'
              }}
            </td>
            <td>{{ assignment.status }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped>
.tracking-container {
  padding: 2rem;
  font-family: sans-serif;
}
table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
}
thead {
  background-color: #34495e;
  color: white;
}
th,
td {
  padding: 12px;
  border: 1px solid #ddd;
  text-align: left;
}
tbody tr:nth-child(even) {
  background-color: #f2f2f2;
}
.state-message {
  padding: 2rem;
  text-align: center;
  background-color: #f9f9f9;
  border-radius: 8px;
  font-size: 1.2rem;
  color: #555;
}
.error {
  background-color: #ffebee;
  color: #c62828;
}
</style>
