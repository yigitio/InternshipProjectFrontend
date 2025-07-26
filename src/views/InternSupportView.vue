<!-- src/views/InternSupportView.vue -->
<template>
  <div class="intern-support-page">
    <h1>Stajyer Destek</h1>

    <div class="form">
      <!-- 1) Sadece o mentorun stajyerleri -->
      <div class="field">
        <label>Stajyer:</label>
        <select v-model="selectedIntern">
          <option disabled value="">-- Seçin --</option>
          <option v-for="intern in interns" :key="intern.id" :value="intern.id">
            {{ intern.name }} {{ intern.surname }}
          </option>
        </select>
      </div>

      <!-- 2) Etiket “İnsan Kaynakları” -->
      <div class="field">
        <label>İnsan Kaynakları:</label>
        <select v-model="selectedHR">
          <option disabled value="">-- Seçin --</option>
          <option v-for="sup in hrList" :key="sup.id" :value="sup.id">
            {{ sup.supervisorName }}
          </option>
        </select>
      </div>

      <!-- 3) Etiket “Bilgi Teknolojileri” -->
      <div class="field">
        <label>Bilgi Teknolojileri:</label>
        <select v-model="selectedIT">
          <option disabled value="">-- Seçin --</option>
          <option v-for="sup in itList" :key="sup.id" :value="sup.id">
            {{ sup.supervisorName }}
          </option>
        </select>
      </div>

      <button @click="assign">Eşleştir</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { msalApp } from '@/main';
import api from '@/utils/apiClients';

interface Intern {
  id: number;
  name: string;
  surname: string;
}
interface Supervisor {
  id: number;
  supervisorName: string;
  supervisorEmail: string;
  departmentId: number;
  departmentName: string;
}

const interns = ref<Intern[]>([]);
const supervisors = ref<Supervisor[]>([]);

const selectedIntern = ref<number | ''>('');
const selectedHR = ref<number | ''>('');
const selectedIT = ref<number | ''>('');

onMounted(async () => {
  try {
    // 1) Aktif mentorun email’ini al
    const account = msalApp.getActiveAccount();
    const email = account?.username ?? '';

    // 2) Mentor’ın ID’sini backend’den çek
    const { data: mentor } = await api.get<{ id: number }>(
      `/api/mentors/email/${encodeURIComponent(email)}`
    );

    // 3) Sadece o mentorun stajyerlerini al
    const internsResp = await api.get<Intern[]>(
      `/api/interns/${mentor.id}/interns`
    );
    interns.value = internsResp.data;

    // 4) Tüm IK/IT listesi
    const supResp = await api.get<Supervisor[]>('/api/supervisors');
    supervisors.value = supResp.data;
  } catch (err) {
    console.error(err);
    alert('Veri çekerken hata oluştu.');
  }
});

// Türkçe departman adlarına göre filtre
const hrList = computed(() =>
  supervisors.value.filter(s => s.departmentName === 'İnsan Kaynakları')
);
const itList = computed(() =>
  supervisors.value.filter(s => s.departmentName === 'Bilgi Teknolojileri')
);

async function assign() {
  if (!selectedIntern.value || !selectedHR.value || !selectedIT.value) {
    alert('Lütfen tüm alanları seçin.');
    return;
  }

  const hrSup = supervisors.value.find(s => s.id === selectedHR.value)!;
  const itSup = supervisors.value.find(s => s.id === selectedIT.value)!;

  try {
    // IK ataması
    await api.post('/api/supervisors', {
      internId: selectedIntern.value,
      supervisorDepartmentId: hrSup.departmentId,
      supervisorName: hrSup.supervisorName,
      supervisorEmail: hrSup.supervisorEmail,
    });
    // IT ataması
    await api.post('/api/supervisors', {
      internId: selectedIntern.value,
      supervisorDepartmentId: itSup.departmentId,
      supervisorName: itSup.supervisorName,
      supervisorEmail: itSup.supervisorEmail,
    });

    alert('Eşleştirme başarıyla tamamlandı.');
    selectedIntern.value = '';
    selectedHR.value = '';
    selectedIT.value = '';
  } catch (error) {
    console.error(error);
    alert('Eşleştirme sırasında hata oluştu.');
  }
}
</script>

<style scoped>
.intern-support-page {
  padding: 24px;
}
.form {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  max-width: 600px;
}
.field {
  display: flex;
  flex-direction: column;
}
label {
  margin-bottom: 4px;
  font-weight: bold;
}
select {
  padding: 8px;
  border-radius: 4px;
  border: 1px solid #ccc;
}
button {
  grid-column: span 2;
  padding: 10px;
  background-color: #0052cc;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
button:hover {
  background-color: #003d99;
}
</style>
