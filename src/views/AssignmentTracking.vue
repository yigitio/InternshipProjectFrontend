<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useMsal } from 'vue3-msal-plugin';
import AppNotification from '@/components/AppNotification.vue';
import { formatDate } from '@/utils/formatters';
import apiClient from '@/utils/apiClients';

// Backend'den gelecek Assignment nesnesinin tip tanımı
interface Assignment {
  id: number;
  assignmentName: string;
  assignmentDesc: string;
  assignedAt: string;
  startedAt: string;
  dueDate: string;
  status: 'To Do' | 'In Progress' | 'Completed';
  internName: string; // Stajyerin adı
  completedAt: string; // Bitiş tarihini tutmak için
  mentorName: string; // Mentorun adı
}

const assignments = ref<Assignment[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);

const { accounts } = useMsal();
const email = accounts.value[0].username;
const notificationMessage = ref('');
const notificationType = ref<'success' | 'error' | 'info'>('info');
const notificationShow = ref(false);
function showNotification(
  message: string,
  type: 'success' | 'error' | 'info' = 'info'
) {
  notificationShow.value = false; // Retrigger için sıfırla
  notificationMessage.value = message;
  notificationType.value = type;
  setTimeout(() => {
    notificationShow.value = true;
  }, 10);
}

const loadAssignments = async (mentorId: number) => {
  try {
    isLoading.value = true;
    const response = await apiClient.get<Assignment[]>(
      `/api/assignments/by-mentor/${mentorId}`
    );
    assignments.value = response.data;
    showNotification('Güncelleme başarılı!', 'success');
  } catch (err) {
    showNotification('Güncelleme başarısız.', 'error');
  } finally {
    isLoading.value = false;
  }
};

onMounted(async () => {
  try {
    // Önce mentorun ID'sini email ile alıyoruz
    const mentorRes = await apiClient.get(`/api/mentors/email/${email}`);
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
    <AppNotification
      :message="notificationMessage"
      :type="notificationType"
      :show="notificationShow"
      :duration="2200"
    />
    <h2>Görev Takibi</h2>

    <div v-if="isLoading" class="state-message">Yükleniyor...</div>

    <div v-else-if="error" class="state-message error">{{ error }}</div>

    <div v-else>
      <div v-if="assignments.length === 0" class="state-message">
        Stajyerlerinize atanmış herhangi bir görev bulunmuyor.
      </div>
      <table v-else>
        <thead>
          <tr>
            <th>Atanma Tarihi</th>
            <th>Hedeflenen Bitiş Tarihi</th>
            <th>Stajyer Adı</th>
            <th>Mentor Adı</th>
            <th>Görev Adı</th>
            <th>Açıklama</th>
            <th>Başlangıç Tarihi</th>
            <th>Tamamlanma Tarihi</th>
            <th>Statü</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="assignment in assignments" :key="assignment.id">
            <td data-label="Atanma Tarihi">
              {{ formatDate(assignment.assignedAt) }}
            </td>
            <td data-label="Hedeflenen Bitiş Tarihi">
              {{ formatDate(assignment.dueDate) }}
            </td>
            <td data-label="Stajyer Adı">{{ assignment.internName }}</td>
            <td data-label="Mentor Adı">{{ assignment.mentorName }}</td>
            <td data-label="Görev Adı">{{ assignment.assignmentName }}</td>
            <td data-label="Açıklama">{{ assignment.assignmentDesc }}</td>
            <td data-label="Başlangıç Tarihi">
              {{
                assignment.status === 'In Progress' ||
                assignment.status === 'Completed'
                  ? formatDate(assignment.startedAt)
                  : '-'
              }}
            </td>
            <td data-label="Tamamlanma Tarihi">
              {{
                assignment.status === 'Completed'
                  ? formatDate(assignment.completedAt)
                  : '-'
              }}
            </td>
            <td data-label="Statü">{{ assignment.status }}</td>
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
  width: 100%;
  box-sizing: border-box;
}

h2 {
  color: #2c3e50;
  margin-bottom: 1.5rem;
}

table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

thead {
  background-color: #242441;
  color: white;
}

th,
td {
  padding: 12px 15px;
  border: 1px solid #ddd;
  text-align: left;
}

tbody tr {
  transition: background-color 0.2s ease;
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

/* --- MOBİL UYUMLULUK (MEDIA QUERY) --- */
/* Ekran genişliği 768px veya daha az olduğunda bu stiller uygulanır */
@media (max-width: 768px) {
  thead {
    /* Başlık satırını mobilde gizliyoruz çünkü başlıkları kartların içine taşıyacağız */
    display: none;
  }

  tr {
    /* Her satırı bir kart gibi göster */
    display: block;
    margin-bottom: 1rem;
    border: 1px solid #ddd;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  }

  td {
    /* Hücreleri alt alta sırala */
    display: block;
    text-align: right; /* Veriyi sağa yasla */
    position: relative;
    padding-left: 50%; /* Başlık için solda yer aç */
    border-bottom: 1px solid #eee;
  }

  td:last-child {
    border-bottom: none;
  }

  /* Bu kısım sihrin gerçekleştiği yer */
  td::before {
    /* data-label içeriğini başlık olarak hücrenin başına ekle */
    content: attr(data-label);
    position: absolute;
    left: 15px; /* Soldan boşluk */
    width: 45%;
    padding-right: 10px;
    white-space: nowrap;
    text-align: left; /* Başlığı sola yasla */
    font-weight: bold;
    color: #242441;
  }
}
</style>
