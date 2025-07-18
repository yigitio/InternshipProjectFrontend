<template>
  <div class="admin-container">
    <div class="admin-card">
      <h1>👑 Admin Paneli</h1>
      <p>Mentor ve Stajyer Eşleştirme Ekranı</p>

      <!-- Eşleştirme Formu -->
      <div class="form-group">
        <label>Mentor:</label>
        <select v-model="selectedMentor">
          <option value="">Tümü</option>
          <option
            v-for="mentor in mentors"
            :key="mentor.mentor_id"
            :value="mentor.mentor_id"
          >
            {{ mentor.name }} {{ mentor.surname }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label>Stajyer:</label>
        <select v-model="selectedIntern">
          <option value="">Tümü</option>
          <option
            v-for="intern in interns"
            :key="intern.intern_id"
            :value="intern.intern_id"
          >
            {{ intern.name }} {{ intern.surname }}
          </option>
        </select>
      </div>

      <button class="assign-button" @click="assignMentor">Eşleştir</button>

      <hr class="divider" />

      <!-- Eşleşme Listesi -->
      <h2 class="list-title">
        Mevcut Eşleşmeler ({{ filteredRelations.length }})
      </h2>

      <div v-if="filteredRelations.length === 0">
        Hiçbir eşleşme bulunamadı.
      </div>

      <ul class="relation-list">
        <li
          v-for="rel in filteredRelations"
          :key="rel.id"
          class="relation-item"
        >
          {{ rel.mentorName }} ↔ {{ rel.internName }}
          <button class="delete-button" @click="deleteRelation(rel.id)">
            Sil
          </button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';

const mentors = ref<any[]>([]);
const interns = ref<any[]>([]);
const relations = ref<any[]>([]);

const selectedMentor = ref('');
const selectedIntern = ref('');

const filteredRelations = computed(() => {
  return relations.value.filter(rel => {
    const mentorMatch =
      selectedMentor.value === '' || rel.mentorId === selectedMentor.value;
    const internMatch =
      selectedIntern.value === '' || rel.internId === selectedIntern.value;
    return mentorMatch && internMatch;
  });
});

onMounted(async () => {
  try {
    const [mentorRes, internRes, relationRes] = await Promise.all([
      axios.get('http://localhost:8085/api/mentors'),
      axios.get('http://localhost:8085/api/interns'),
      axios.get('http://localhost:8085/api/relations'),
    ]);
    mentors.value = mentorRes.data;
    interns.value = internRes.data;
    relations.value = relationRes.data;
  } catch (err) {
    console.error('Veriler alınamadı:', err);
  }
});

async function assignMentor() {
  if (!selectedMentor.value || !selectedIntern.value) return;
  try {
    const res = await axios.post('http://localhost:8085/api/relations', {
      mentorId: selectedMentor.value,
      internId: selectedIntern.value,
    });
    alert('Eşleştirme başarıyla yapıldı!');
    relations.value.push(res.data);
    selectedMentor.value = '';
    selectedIntern.value = '';
  } catch (e) {
    alert('Eşleştirme sırasında hata oluştu.');
  }
}

async function deleteRelation(id: number) {
  try {
    await axios.delete(`http://localhost:8085/api/relations/${id}`);
    relations.value = relations.value.filter(rel => rel.id !== id);
  } catch (e) {
    alert('Silme başarısız.');
  }
}
</script>

<style scoped>
.admin-container {
  padding: 40px;
  background-color: #f4f6fa;
  min-height: 100vh;
  margin-left: 24px;
}

.admin-card {
  max-width: 700px;
  margin: auto;
  padding: 32px;
  background-color: #242441;
  border-radius: 16px;
  color: #fff;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

.admin-card h1 {
  font-size: 26px;
  margin-bottom: 24px;
  color: #ffc107;
}

.form-group {
  margin-bottom: 20px;
}

label {
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
}

select {
  width: 100%;
  padding: 8px;
  border-radius: 6px;
  border: none;
  font-size: 16px;
}

.assign-button {
  background-color: #ffc107;
  color: #242441;
  border: none;
  padding: 10px 20px;
  font-size: 16px;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.assign-button:hover {
  background-color: #e0ac00;
}

.divider {
  border: none;
  border-top: 1px solid #555;
  margin: 30px 0;
}

.list-title {
  margin-bottom: 12px;
  font-size: 18px;
  font-weight: 600;
  color: #ffc107;
}

.relation-list {
  list-style: none;
  padding: 0;
}

.relation-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #35365c;
  padding: 10px 16px;
  margin-bottom: 10px;
  border-radius: 8px;
}

.delete-button {
  background-color: #e53935;
  color: white;
  border: none;
  padding: 6px 12px;
  font-size: 14px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.delete-button:hover {
  background-color: #c62828;
}
</style>
