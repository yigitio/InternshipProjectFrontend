<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios'; // <-- EKLENDİ
import {
  fetchAssignments,
  updateAssignment,
  type Assignment,
} from '@/utils/assignmentService';
import { useMsal } from 'vue3-msal-plugin';

// Reaktif değişkenler
const assignments = ref<Assignment[]>([]);
const isLoading = ref(true);
const error = ref<string | null>(null);
const { accounts } = useMsal();
const email = accounts.value[0].username;

const statusOptions = ['Pending', 'In Progress', 'Completed'];

// DÜZELTİLMİŞ FONKSİYON
const loadAssignments = async (internId: number) => {
  try {
    isLoading.value = true;
    error.value = null;
    const fetchedAssignments: Assignment[] = await fetchAssignments(internId);
    assignments.value = fetchedAssignments.map(assignment => {
      if (!assignment.status) {
        assignment.status = 'Pending';
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
    <h2>📋 Atanan Görevler</h2>

    <div v-if="isLoading">
      <p>Yükleniyor...</p>
    </div>

    <div v-else-if="error" class="error-message">
      <p>{{ error }}</p>
    </div>

    <div v-else>
      <div v-if="assignments.length === 0" class="empty-state">
        <p>Henüz atanmış bir görev bulunmuyor.</p>
      </div>

      <table v-else>
        <thead>
          <tr>
            <th>Görev Adı</th>
            <th>Açıklama</th>
            <th>Başlangıç Tarihi</th>
            <th>Bitiş Tarihi</th>
            <th>Önem Derecesi</th>
            <th>Mentor</th>
            <th>Statü</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in assignments" :key="item.id">
            <td>{{ item.assignmentName || 'N/A' }}</td>
            <td>{{ item.assignmentDesc }}</td>
            <td>{{ item.assignedAt }}</td>
            <td>
              {{
                item.dueDate
                  ? new Date(item.dueDate).toLocaleDateString()
                  : 'N/A'
              }}
            </td>
            <td>
              {{ item.priority }}
            </td>
            <td>
              {{ item.mentorName }}
            </td>
            <td>
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
/* Mevcut stil kodlarınız... */
.assignment-container {
  font-family: sans-serif;
  width: 100%;
  max-width: 1200px;
  margin: 2rem auto;
  padding: 1rem;
}
h2 {
  margin-bottom: 1.5rem;
  color: #242441;
}
table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}
thead {
  background-color: #a15c2d;
  color: #ecf0f1;
}
th,
td {
  padding: 12px 15px;
  border-bottom: 1px solid #4f4f4f;
  vertical-align: middle;
}
tbody tr {
  background-color: #f58220;
  transition: background-color 0.2s ease-in-out;
}
tbody tr:hover {
  background-color: #a15c2d;
}
.error-message,
.empty-state {
  background-color: #2a2a2a;
  padding: 20px;
  border-radius: 8px;
  text-align: center;
  color: #bdc3c7;
}

/* --- YENİ EKLENEN STİL --- */
select {
  background-color: #242441;
  color: white;
  border: 1px solid #7f8c8d;
  padding: 8px;
  border-radius: 5px;
  cursor: pointer;
  width: 100%;
  min-width: 120px;
}
select:focus {
  outline: none;
  border-color: #3498db;
}
/* ------------------------- */
</style>
