<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios'; // <-- EKLENDİ
import {
  fetchAssignments,
  updateAssignment,
  type Assignment,
} from '@/utils/assignmentService';
import { useMsal } from 'vue3-msal-plugin';
import { formatDate } from '@/utils/formatters';

// Reaktif değişkenler
const assignments = ref<Assignment[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);
const { accounts } = useMsal();
const email = accounts.value[0].username;

const statusOptions = ['To Do', 'In Progress', 'Completed'];

// DÜZELTİLMİŞ FONKSİYON
const loadAssignments = async (internId: number) => {
  try {
    isLoading.value = true;
    error.value = null;
    const fetchedAssignments: Assignment[] = await fetchAssignments(internId);
    assignments.value = fetchedAssignments.map(assignment => {
      if (!assignment.status) {
        assignment.status = 'To Do';
      }
      return assignment;
    });
  } catch (err) {
    console.error('Görevler çekilirken bir hata oluştu:', err);
    error.value =
      'Görevler yüklenirken bir sorun oluştu. Lütfen daha sonra tekrar deneyin.';
  } finally {
    isLoading.value = false;
  }
};

// Bu fonksiyonunuz zaten doğruydu
const handleStatusChange = async (assignment: Assignment) => {
  if (typeof assignment.id === 'undefined' || assignment.id === null) {
    console.error("Görev ID'si tanımsız, güncelleme yapılamaz.");
    alert('Geçersiz görev IDsi nedeniyle işlem yapılamadı.');
    return;
  }
  try {
    await updateAssignment(assignment.id, assignment);
  } catch (err) {
    console.error('Görev durumu güncellenirken hata oluştu:', err);
    alert('Durum güncellenirken bir hata oluştu. Değişiklikler geri alınacak.'); // Hata durumunda listeyi yeniden yüklemek için ID'yi bilmemiz gerekir.
    // Bu kısmı basitleştirebilir veya mevcut ID'yi saklayabilirsiniz.
    // Şimdilik sadece sayfayı yenilemesini isteyebiliriz.
    window.location.reload();
  }
};

// DÜZELTİLMİŞ onMounted
onMounted(async () => {
  try {
    const internRes = await axios.get(
      `http://localhost:8080/api/interns/email/${email}`
    );
    const internData = internRes.data;
    if (internData && internData.id) {
      loadAssignments(internData.id);
    } else {
      error.value = 'Oturum açan kullanıcıya ait stajyer bilgisi bulunamadı.';
      isLoading.value = false;
    }
  } catch (err) {
    console.error('Stajyer bilgileri çekilirken hata oluştu:', err);
    error.value =
      'Stajyer bilgileri alınamadı, bu nedenle görevler listelenemiyor.';
    isLoading.value = false;
  }
});
</script>

<template>
  <div class="assignment-container">
    <h2>Atanan Görevler</h2>

    <div v-if="isLoading" class="state-message">Yükleniyor...</div>

    <div v-else-if="error" class="state-message error">{{ error }}</div>

    <div v-else>
      <div v-if="assignments.length === 0" class="state-message">
        Henüz atanmış bir görev bulunmuyor.
      </div>

      <table v-else>
        <thead>
          <tr>
            <th>Görev Adı</th>
            <th>Açıklama</th>
            <th>Atanma Tarihi</th>
            <th>Hedeflenen Bitiş Tarihi</th>
            <th>Önem Derecesi</th>
            <th>Mentor</th>
            <th>Statü</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in assignments" :key="item.id">
            <td data-label="Görev Adı">{{ item.assignmentName || 'N/A' }}</td>
            <td data-label="Açıklama">{{ item.assignmentDesc }}</td>
            <td data-label="Atanma Tarihi">
              {{ formatDate(item.assignedAt) }}
            </td>
            <td data-label="Hedeflenen Bitiş Tarihi">
              {{ formatDate(item.dueDate) }}
            </td>
            <td data-label="Önem Derecesi">{{ item.priority }}</td>
            <td data-label="Mentor">{{ item.mentorName }}</td>
            <td data-label="Statü">
              <select v-model="item.status" @change="handleStatusChange(item)">
                <option
                  v-for="status in statusOptions"
                  :key="status"
                  :value="status"
                >
                  {{ status }}
                </option>
              </select>
            </td>
          </tr>
        </tbody>
      </table>
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
