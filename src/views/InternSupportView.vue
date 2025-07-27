<!-- src/views/InternSupportView.vue -->
<template>
  <div class="intern-support-page">
    <h1>Stajyer Destek</h1>

    <div class="form">
      <div class="field">
        <label>Stajyer:</label>
        <select v-model="selectedIntern">
          <option disabled value="">-- Seçin --</option>
          <option v-for="intern in interns" :key="intern.id" :value="intern.id">
            {{ intern.name }} {{ intern.surname }}
          </option>
        </select>
      </div>

      <div class="field">
        <label>İnsan Kaynakları:</label>
        <select v-model="selectedHR">
          <option disabled value="">-- Seçin --</option>
          <option v-for="sup in hrList" :key="sup.id" :value="sup.id">
            {{ sup.supervisorName }}
          </option>
        </select>
      </div>

      <div class="field">
        <label>Bilgi Teknolojileri:</label>
        <select v-model="selectedIT">
          <option disabled value="">-- Seçin --</option>
          <option v-for="sup in itList" :key="sup.id" :value="sup.id">
            {{ sup.supervisorName }}
          </option>
        </select>
      </div>

      <button class="assign-btn" @click="assign">Eşleştir</button>
    </div>

    <div
      v-if="selectedIntern && assignments.length > 0"
      class="assignments-table"
    >
      <h3>Mevcut Atamalar</h3>
      <table>
        <thead>
          <tr>
            <th>Departman</th>
            <th>İsim</th>
            <th>Email</th>
            <th>İşlem</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="ass in assignments" :key="ass.id">
            <td>{{ ass.departmentName }}</td>
            <td>{{ ass.supervisorName }}</td>
            <td>{{ ass.supervisorEmail }}</td>
            <td>
              <button class="delete-btn" @click="deleteAssignment(ass.id)">
                Sil
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
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
const assignments = ref<any[]>([]);

const selectedIntern = ref<number | ''>('');
const selectedHR = ref<number | ''>('');
const selectedIT = ref<number | ''>('');

// Tekilleştirme (department + email)
function uniqueBy<T>(arr: T[], key: (item: T) => string): T[] {
  const seen = new Set();
  return arr.filter(item => {
    const k = key(item);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}
const hrList = computed(() =>
  uniqueBy(
    supervisors.value.filter(s => s.departmentName === 'İnsan Kaynakları'),
    s => `${s.supervisorEmail}_${s.departmentId}`
  )
);
const itList = computed(() =>
  uniqueBy(
    supervisors.value.filter(s => s.departmentName === 'Bilgi Teknolojileri'),
    s => `${s.supervisorEmail}_${s.departmentId}`
  )
);

watch(selectedIntern, async val => {
  if (!val) {
    assignments.value = [];
    return;
  }
  const { data } = await api.get('/api/supervisors', {
    params: { internId: val },
  });
  assignments.value = data;
});

onMounted(async () => {
  try {
    const account = msalApp.getActiveAccount();
    const email = account?.username ?? '';
    const { data: mentor } = await api.get<{ id: number }>(
      `/api/mentors/email/${encodeURIComponent(email)}`
    );
    const internsResp = await api.get<Intern[]>(
      `/api/interns/${mentor.id}/interns`
    );
    interns.value = internsResp.data;
    const supResp = await api.get<Supervisor[]>('/api/supervisors');
    supervisors.value = supResp.data;
  } catch (err) {
    console.error(err);
    alert('Veri çekerken hata oluştu.');
  }
});

async function assign() {
  if (!selectedIntern.value || !selectedHR.value || !selectedIT.value) {
    alert('Lütfen tüm alanları seçin.');
    return;
  }
  const hrSup = supervisors.value.find(s => s.id === selectedHR.value)!;
  const itSup = supervisors.value.find(s => s.id === selectedIT.value)!;

  try {
    await api.post('/api/supervisors', {
      internId: selectedIntern.value,
      supervisorDepartmentId: hrSup.departmentId,
      supervisorName: hrSup.supervisorName,
      supervisorEmail: hrSup.supervisorEmail,
    });
    await api.post('/api/supervisors', {
      internId: selectedIntern.value,
      supervisorDepartmentId: itSup.departmentId,
      supervisorName: itSup.supervisorName,
      supervisorEmail: itSup.supervisorEmail,
    });
    const { data } = await api.get('/api/supervisors', {
      params: { internId: selectedIntern.value },
    });
    assignments.value = data;
    alert('Eşleştirme başarıyla tamamlandı.');
    selectedHR.value = '';
    selectedIT.value = '';
  } catch (error) {
    console.error(error);
    alert('Eşleştirme sırasında hata oluştu.');
  }
}

async function deleteAssignment(id: number) {
  if (!confirm('Bu atamayı silmek istediğine emin misin?')) return;
  try {
    await api.delete(`/api/supervisors/${id}`);
    assignments.value = assignments.value.filter(a => a.id !== id);
  } catch (e) {
    alert('Silme sırasında hata oluştu.');
  }
}
</script>

<style scoped>
.intern-support-page {
  padding: 36px;
  text-align: center;
}

h1 {
  font-size: 2.4rem;
  color: #222c40;
  margin-bottom: 2.5rem;
  letter-spacing: 0.01em;
}

.form {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 120px;
  gap: 18px;
  max-width: 800px;
  margin: 0 auto 24px auto;
  align-items: end;
}

.field {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
label {
  margin-bottom: 6px;
  font-weight: bold;
  color: #374151;
  font-size: 1.08rem;
}
select {
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #bfc6d1;
  min-width: 160px;
  font-size: 1rem;
}
.assign-btn {
  padding: 11px 22px;
  background-color: #0052cc;
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1.08rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  transition: background 0.18s;
}
.assign-btn:hover {
  background-color: #003d99;
}

.assignments-table {
  margin: 2rem auto 0 auto;
  max-width: 700px;
  background: #fff;
  border-radius: 1rem;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  padding: 1.2rem 2rem 1.6rem 2rem;
}

.assignments-table h3 {
  color: #2c3e5e;
  font-size: 1.3rem;
  margin-bottom: 1rem;
  text-align: left;
}
.assignments-table table {
  width: 100%;
  border-collapse: collapse;
  font-size: 1.04rem;
}
.assignments-table th,
.assignments-table td {
  padding: 0.6rem 0.5rem;
  border-bottom: 1px solid #eee;
  text-align: left;
}
.assignments-table th {
  background: #f4f6fa;
  font-weight: 700;
  color: #4468ad;
}
.assignments-table button.delete-btn {
  background: #ff4d4d;
  color: #fff;
  border: none;
  padding: 6px 18px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.15s;
}
.assignments-table button.delete-btn:hover {
  background: #d11a2a;
}
</style>
