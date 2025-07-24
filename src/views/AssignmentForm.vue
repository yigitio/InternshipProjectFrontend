<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { addAssignment } from '@/utils/assignmentService';
import { useMsal } from 'vue3-msal-plugin';
import AppNotification from '@/components/AppNotification.vue';
import { formatDate } from '@/utils/formatters';

// --- Reaktif Değişkenler ---
const interns = ref<{ id: number; name: string }[]>([]);
const currentMentor = ref<{ id: number; name: string } | null>(null);
const router = useRouter();
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

// --- Form Seçenekleri ve Varsayılan Değerler ---
const priorityOptions = ['Urgent', 'High', 'Medium', 'Low', 'Optional'];
// Başlangıç tarihini bugünün tarihi olarak ayarlar (YYYY-MM-DD formatında)
const today = new Date().toISOString().split('T')[0];

// Form verileri
const form = ref({
  internId: 0,
  mentorId: 0,
  assignmentName: '',
  assignmentDesc: '',
  dueDate: '',
  priority: 'Optional',
  assignedAt: today, // Başlangıç tarihi otomatik olarak bugün
  completedAt: '',
  status: 'To Do',
});

// Sayfa yüklendiğinde mevcut mentor ve ona bağlı stajyerleri çeker
onMounted(async () => {
  try {
    // Mentor bilgisini email ile al
    const mentorRes = await axios.get(
      `http://localhost:8080/api/mentors/email/${email}`
    );
    const mentorData = mentorRes.data;

    currentMentor.value = {
      id: mentorData.id,
      name: mentorData.name + ' ' + mentorData.surname,
    }; // Formdaki mentorId'yi otomatik olarak o anki mentorun ID'si yap

    form.value.mentorId = mentorData.id; // Mentora bağlı stajyerleri çek

    if (mentorData.id) {
      const internRes = await axios.get(
        // Bu URL'in backend'inizle uyumlu olduğundan emin olun
        `http://localhost:8080/api/interns/${mentorData.id}/interns`
      );
      interns.value = internRes.data.map((i: any) => ({
        id: i.id,
        name: i.name + ' ' + i.surname,
      }));
    }
  } catch (error) {
    console.error('Veri çekilirken bir hata oluştu:', error);
  }
});

// Yeni görev ekleme fonksiyonu
const submitAssignment = async () => {
  try {
    await addAssignment(form.value);
    showNotification('Görev başarıyla eklendi!', 'success');
    // İsteğe bağlı: Başarılı eklemeden sonra formu temizleyebilir veya başka bir sayfaya yönlendirebilirsiniz.
    // router.push('/mentor-dashboard');
  } catch (err) {
    showNotification('Görev eklenirken bir hata oluştu.', 'error');
  }
};
</script>

<template>
  <div class="form-container">
    <AppNotification
      :message="notificationMessage"
      :type="notificationType"
      :show="notificationShow"
      :duration="2200"
    />
    <h2>Yeni Görev Ekle</h2>
    <form @submit.prevent="submitAssignment">
      <label for="mentor">Mentor:</label>
      <input id="mentor" :value="currentMentor?.name" type="text" disabled />

      <label for="intern">Stajyer:</label>
      <select id="intern" v-model="form.internId" required>
        <option value="0" disabled>Lütfen bir stajyer seçiniz</option>
        <option v-for="intern in interns" :key="intern.id" :value="intern.id">
          {{ intern.name }}
        </option>
      </select>

      <label for="assignmentName">Görev Adı:</label>
      <input
        id="assignmentName"
        v-model="form.assignmentName"
        type="text"
        required
      />

      <label for="assignmentDesc">Açıklama:</label>
      <textarea id="assignmentDesc" v-model="form.assignmentDesc"></textarea>

      <label for="priority">Öncelik:</label>
      <select id="priority" v-model="form.priority">
        <option v-for="option in priorityOptions" :key="option" :value="option">
          {{ option }}
        </option>
      </select>

      <label for="assignedAt">Atanma Tarihi:</label>
      <input id="assignedAt" v-model="form.assignedAt" type="text" disabled />

      <label for="dueDate">Hedeflenen Bitiş Tarihi:</label>
      <input id="dueDate" v-model="form.dueDate" type="date" />

      <button type="submit">Görev Ekle</button>
    </form>
  </div>
</template>

<style scoped>
/* --- KAPSAYICI STİLLERİ --- */
.form-container {
  padding: 2rem; /* Geniş ekranlarda kenar boşluğu */
  display: flex;
  flex-direction: column;
  align-items: center; /* Formu yatayda ortalar */
}

/* --- BAŞLIK STİLİ --- */
h2 {
  margin-bottom: 1.5rem;
  color: #333;
}

/* --- FORM STİLLERİ (Masaüstü için temel) --- */
form {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  width: 100%; /* Genişliğini kapsayıcısına göre ayarlar */
  max-width: 450px; /* Maksimum genişlik */
  background-color: #ffffff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

label {
  font-weight: bold;
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #555;
}

input,
select,
textarea {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem; /* iOS'ta otomatik zoom'u engellemek için 16px (1rem) idealdir */
  width: 100%;
  box-sizing: border-box; /* Padding ve border'ın genişliğe dahil olmasını sağlar */
}

input:disabled {
  background-color: #e9ecef;
  cursor: not-allowed;
}

textarea {
  min-height: 100px;
  resize: vertical;
}

button {
  margin-top: 1rem;
  padding: 12px;
  background-color: #242441; /* Ana renk */
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

button:hover {
  background-color: #242441;
}

/* --- MOBİL UYUMLULUK (MEDIA QUERY) --- */
/* Ekran genişliği 600px veya daha az olduğunda bu stiller uygulanır */
@media (max-width: 600px) {
  .form-container {
    padding: 1rem; /* Mobil için kenar boşluğunu azalt */
  }

  form {
    padding: 1.5rem; /* Form içi boşluğu azalt */
    box-shadow: none; /* Mobilde gölgeyi kaldır */
    border: 1px solid #eee;
  }

  h2 {
    font-size: 1.5rem; /* Başlık fontunu biraz küçült */
  }
}
</style>
