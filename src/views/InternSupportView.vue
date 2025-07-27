<!-- src/views/InternSupportView.vue -->
<template>
  <div class="intern-support-page">
    <h1>Stajyer Destek</h1>

    <div class="form">
      <!-- 1. Satır: Stajyer Seçimi -->
      <div class="row">
        <div class="field full-width">
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
          <input
            class="name-input"
            v-model="hrName"
            @input="hrName = hrName.toUpperCase()"
          />
        </div>
        <div class="field">
          <label>İnsan Kaynakları Email:</label>
          <div class="email-input">
            <input v-model="hrLocal" @input="hrLocal = hrLocal.toLowerCase()" />
            <span>@etiya.com</span>
          </div>
        </div>
      </div>

      <!-- 3. Satır: IT Adı ve Email -->
      <div class="row">
        <div class="field">
          <label>Bilgi Teknolojileri Adı:</label>
          <input
            class="name-input"
            v-model="itName"
            @input="itName = itName.toUpperCase()"
          />
        </div>
        <div class="field">
          <label>Bilgi Teknolojileri Email:</label>
          <div class="email-input">
            <input v-model="itLocal" @input="itLocal = itLocal.toLowerCase()" />
            <span>@etiya.com</span>
          </div>
        </div>
      </div>

      <!-- 4. Satır: Eşleştir Butonu -->
      <div class="row">
        <button class="assign-btn" @click="assign">Eşleştir</button>
      </div>
    </div>

    <!-- Mevcut Atamalar Tablosu: sadece seçili intern varsa ve atama varsa -->
    <div
      v-if="selectedIntern !== null && assignments.length > 0"
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
const selectedIntern = ref<number | null>(null);

const hrName = ref('');
const hrLocal = ref('');
const itName = ref('');
const itLocal = ref('');

// Seçili intern değişince atamaları yükle veya temizle
watch(selectedIntern, async id => {
  if (id === null) {
    assignments.value = [];
  } else {
    const res = await api.get<Assignment[]>('/api/supervisors', {
      params: { internId: id },
    });
    assignments.value = res.data;
  }
});

onMounted(async () => {
  try {
    const email = msalApp.getActiveAccount()?.username || '';
    const { data: m } = await api.get<{ id: number }>(
      `/api/mentors/email/${encodeURIComponent(email)}`
    );
    const resp = await api.get<Intern[]>(`/api/interns/${m.id}/interns`);
    interns.value = resp.data;
    assignments.value = [];
  } catch {
    alert('Veri çekerken hata oluştu.');
  }
});

async function assign() {
  const hasHR = assignments.value.some(
    a => a.departmentName === 'İnsan Kaynakları'
  );
  const hasIT = assignments.value.some(
    a => a.departmentName === 'Bilgi Teknolojileri'
  );
  if (hasHR && hasIT) {
    return alert(
      'Bu stajyer için IK ve IT atamaları zaten tanımlı. Yeni atama yapamazsınız.'
    );
  }
  if (
    selectedIntern.value === null ||
    !hrName.value ||
    !hrLocal.value ||
    !itName.value ||
    !itLocal.value
  ) {
    return alert('Lütfen tüm alanları doldurun.');
  }

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
    const res = await api.get<Assignment[]>('/api/supervisors', {
      params: { internId: selectedIntern.value },
    });
    assignments.value = res.data;
    hrName.value = hrLocal.value = itName.value = itLocal.value = '';
    alert('Eşleştirme başarıyla tamamlandı.');
  } catch {
    alert('Eşleştirme sırasında hata oluştu.');
  }
}

async function deleteAssignment(id: number) {
  if (!confirm('Silmek istediğine emin misiniz?')) return;
  try {
    await api.delete(`/api/supervisors/${id}`);
    assignments.value = assignments.value.filter(x => x.id !== id);
    hrName.value = hrLocal.value = itName.value = itLocal.value = '';
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
.full-width {
  flex: 1 1 100%;
}
.field label {
  margin-bottom: 0.25rem;
  font-weight: 500;
}

select {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  background: white;
  appearance: none;
  font-size: 1rem;
}

.name-input {
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
  text-transform: uppercase;
}

.email-input {
  display: flex;
  border: 1px solid #ccc;
  border-radius: 4px;
  overflow: hidden;
}
.email-input input {
  padding: 0.5rem;
  border: none;
  flex: 1;
  text-transform: lowercase;
}
.email-input span {
  display: flex;
  align-items: center;
  padding: 0 0.6rem;
  background: #f0f0f0;
  border-left: 1px solid #ccc;
}

/* “Eşleştir” butonu */
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

/* Atamalar tablosu */
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

/* “Sil” butonu */
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
