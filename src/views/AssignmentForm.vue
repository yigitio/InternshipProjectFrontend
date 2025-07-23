<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
// addAssignment'ı service dosyanızdan aldığınızı varsayıyorum, bu doğru bir yaklaşım.
import { addAssignment } from '@/utils/assignmentService';
import { useMsal } from 'vue3-msal-plugin';
const interns = ref<{ id: number; name: string }[]>([]);
const currentMentor = ref<{ id: number; name: string } | null>(null);
const router = useRouter();

// --- YENİ EKLENEN KISIM ---
// Dropdown menüsünde gösterilecek öncelik seçenekleri
const priorityOptions = ['Urgent', 'High', 'Medium', 'Normal'];
const today = new Date().toISOString().split('T')[0];
// -------------------------

// Form verileri
const form = ref({
  internId: 0,
  mentorId: 0,
  assignmentName: '',
  assignmentDesc: '',
  dueDate: '',
  priority: 'Normal', // <-- Varsayılan bir değer atandı
  assignedAt: today,
  completedAt: '',
  status: 'Pending',
});

const { accounts } = useMsal();
const email = accounts.value[0].username;

// Sayfa yüklendiğinde intern ve mentorları çek
onMounted(async () => {
  try {
    const mentorRes = await axios.get(
      `http://localhost:8080/api/mentors/email/${email}`
    );
    const mentorData = mentorRes.data;

    currentMentor.value = {
      id: mentorData.id,
      name: mentorData.name + ' ' + mentorData.surname,
    };

    // Formdaki mentorId'yi otomatik olarak o anki mentorun ID'si yap
    form.value.mentorId = mentorData.id;

    // 3. Adım: Mentor ID'sini kullanarak sadece o mentora bağlı stajyerleri çek.
    if (mentorData.id) {
      const internRes = await axios.get(
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

// Yeni görev ekle
const submitAssignment = async () => {
  try {
    // form.value artık seçilen priority bilgisini de içerecek
    await addAssignment(form.value);
    alert('Görev başarıyla eklendi!');
  } catch (err) {
    console.error(err);
    alert('Görev eklenirken hata oluştu.');
  }
};
</script>

<template>
  <div>
    <h2>Yeni Görev Ekle</h2>
    <form @submit.prevent="submitAssignment">
      <label>Stajyer:</label>
      <select v-model="form.internId" required>
        <option value="">Seçiniz</option>
        <option v-for="intern in interns" :key="intern.id" :value="intern.id">
          {{ intern.name }}
        </option>
      </select>

      <label>Mentor:</label>
      <input :value="currentMentor?.name" type="text" disabled />

      <label>Görev Adı:</label>
      <input v-model="form.assignmentName" type="text" required />

      <label>Açıklama:</label>
      <textarea v-model="form.assignmentDesc"></textarea>

      <label>Öncelik:</label>
      <select v-model="form.priority">
        <option v-for="option in priorityOptions" :key="option" :value="option">
          {{ option }}
        </option>
      </select>
      <label>Başlama Tarihi:</label>
      <input v-model="form.assignedAt" type="text" disabled />

      <label>Bitiş Tarihi:</label>
      <input v-model="form.dueDate" type="date" />

      <button type="submit">Görev Ekle</button>
    </form>
  </div>
</template>

<style scoped>
form {
  display: flex;
  flex-direction: column;
  gap: 0.7rem;
  max-width: 400px;
}

/* Tüm form elemanlarının benzer görünmesi için eklendi */
input,
select,
textarea {
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 1rem;
}
</style>
