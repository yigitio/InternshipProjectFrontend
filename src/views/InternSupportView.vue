<!-- src/views/InternSupportView.vue -->
<template>
  <div class="intern-support-page">
    <h1>Stajyer Destek</h1>

    <div class="form">
      <!-- 1. Satır: Stajyer Seçimi -->
      <div class="row">
        <div class="field">
          <label>Stajyer:</label>
          <select v-model="selectedIntern">
            <option disabled value="">-- SEÇİN --</option>
            <option
              v-for="intern in interns"
              :key="intern.id"
              :value="intern.id"
            >
              {{ intern.name }} {{ intern.surname }}
            </option>
          </select>
        </div>
      </div>

      <!-- 2. Satır: IK Adı ve Email -->
      <div class="row">
        <div class="field">
          <label>İnsan Kaynakları Adı:</label>
          <input v-model="hrName" @input="hrName = hrName.toUpperCase()" />
        </div>
        <div class="field">
          <label>İK Email (@etiya.com):</label>
          <div class="email-input">
            <input v-model="hrLocal" @input="hrLocal = hrLocal.toUpperCase()" />
            <span>@etiya.com</span>
          </div>
        </div>
      </div>

      <!-- 3. Satır: IT Adı ve Email -->
      <div class="row">
        <div class="field">
          <label>Bilgi Teknolojileri Adı:</label>
          <input v-model="itName" @input="itName = itName.toUpperCase()" />
        </div>
        <div class="field">
          <label>IT Email (@etiya.com):</label>
          <div class="email-input">
            <input v-model="itLocal" @input="itLocal = itLocal.toUpperCase()" />
            <span>@etiya.com</span>
          </div>
        </div>
      </div>

      <!-- 4. Satır: Eşleştir Butonu -->
      <div class="row">
        <button class="assign-btn" @click="assign">Eşleştir</button>
      </div>
    </div>

    <!-- Mevcut Atamalar Tablosu -->
    <div v-if="selectedIntern && assignments.length" class="assignments-table">
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
          <tr v-for="a in assignments" :key="a.id">
            <td>{{ a.departmentName }}</td>
            <td>{{ a.supervisorName }}</td>
            <td>{{ a.supervisorEmail }}</td>
            <td>
              <button class="delete-btn" @click="deleteAssignment(a.id)">
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
import { ref, watch, onMounted } from 'vue';
import { msalApp } from '@/main';
import api from '@/utils/apiClients';

interface Intern {
  id: number;
  name: string;
  surname: string;
}
interface Assignment {
  id: number;
  departmentName: string;
  supervisorName: string;
  supervisorEmail: string;
}

const interns = ref<Intern[]>([]);
const assignments = ref<Assignment[]>([]);
const selectedIntern = ref<number | ''>('');
const hrName = ref(''),
  hrLocal = ref('');
const itName = ref(''),
  itLocal = ref('');

watch(selectedIntern, async id => {
  assignments.value = id
    ? (await api.get('/api/supervisors', { params: { internId: id } })).data
    : [];
});

onMounted(async () => {
  try {
    const email = msalApp.getActiveAccount()?.username || '';
    const { data: m } = await api.get<{ id: number }>(
      `/api/mentors/email/${encodeURIComponent(email)}`
    );
    interns.value = (await api.get(`/api/interns/${m.id}/interns`)).data;
  } catch {
    alert('Veri çekerken hata oluştu.');
  }
});

async function assign() {
  if (
    !selectedIntern.value ||
    !hrName.value ||
    !hrLocal.value ||
    !itName.value ||
    !itLocal.value
  )
    return alert('Lütfen tüm alanları doldurun.');
  const hrEmail = `${hrLocal.value}@etiya.com`;
  const itEmail = `${itLocal.value}@etiya.com`;
  try {
    await api.post('/api/supervisors', {
      internId: selectedIntern.value,
      supervisorDepartmentId: 1,
      supervisorName: hrName.value,
      supervisorEmail: hrEmail,
    });
    await api.post('/api/supervisors', {
      internId: selectedIntern.value,
      supervisorDepartmentId: 2,
      supervisorName: itName.value,
      supervisorEmail: itEmail,
    });
    assignments.value = (
      await api.get('/api/supervisors', {
        params: { internId: selectedIntern.value },
      })
    ).data;
    hrName.value = hrLocal.value = itName.value = itLocal.value = '';
    alert('Eşleştirme başarıyla tamamlandı.');
  } catch {
    alert('Eşleştirme sırasında hata oluştu.');
  }
}

async function deleteAssignment(id: number) {
  if (!confirm('Silmek istediğine emin misin?')) return;
  try {
    await api.delete(`/api/supervisors/${id}`);
    assignments.value = assignments.value.filter(x => x.id !== id);
  } catch {
    alert('Silme sırasında hata oluştu.');
  }
}
</script>

<style scoped>
.intern-support-page {
  max-width: 800px;
  margin: 2rem auto;
  padding: 1rem;
}
h1 {
  text-align: center;
  margin-bottom: 1.5rem;
}

.form {
  display: grid;
  gap: 1rem;
}
.row {
  display: flex;
  gap: 1rem;
}
.field {
  flex: 1;
  display: flex;
  flex-direction: column;
}
.field label {
  margin-bottom: 0.25rem;
  font-weight: 500;
}
input,
select {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  text-transform: uppercase;
}
.email-input {
  display: flex;
}
.email-input span {
  display: flex;
  align-items: center;
  padding: 0 0.6rem;
  background: #f0f0f0;
  border: 1px solid #ccc;
  border-left: none;
  border-radius: 0 4px 4px 0;
}
.assign-btn {
  background: #0052cc;
  color: #fff;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 4px;
  cursor: pointer;
}
.assign-btn:hover {
  background: #003d99;
}

.assignments-table {
  background: #fff;
  padding: 1rem;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  margin-top: 1.5rem;
}
.assignments-table table {
  width: 100%;
  border-collapse: collapse;
}
th,
td {
  padding: 0.6rem;
  border-bottom: 1px solid #eee;
  text-align: left;
}
th {
  background: #f7f9fc;
  font-weight: 600;
}
.delete-btn {
  background: #ff4d4d;
  color: #fff;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  cursor: pointer;
}
.delete-btn:hover {
  background: #d11a2a;
}
</style>
