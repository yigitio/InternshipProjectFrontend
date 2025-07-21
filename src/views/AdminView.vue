<template>
  <div class="admin-container">
    <AppNotification
      :message="notificationMessage"
      :type="notificationType"
      :show="notificationShow"
      :duration="2200"
    />
    <div class="admin-card">
      <h1>👑 Admin Paneli</h1>
      <p>Mentor ve Stajyer Eşleştirme Ekranı</p>

      <!-- Eşleştirme Formu -->
      <div class="form-group">
        <label>Mentor:</label>
        <select v-model.number="selectedMentor">
          <option value="">Tümü</option>
          <option v-for="mentor in mentors" :key="mentor.id" :value="mentor.id">
            {{ mentor.name }} {{ mentor.surname }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label>Stajyer:</label>
        <select v-model.number="selectedIntern">
          <option value="">Tümü</option>
          <option v-for="intern in interns" :key="intern.id" :value="intern.id">
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
          :key="rel.relation_id"
          class="relation-item"
        >
          {{ rel.mentor_name }} ↔ {{ rel.intern_name }}
          <button
            class="delete-button"
            @click="deleteRelation(rel.relation_id)"
          >
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
import AppNotification from '@/components/AppNotification.vue';

const mentors = ref<any[]>([]);
const interns = ref<any[]>([]);
const relations = ref<any[]>([]);

const selectedMentor = ref<number | ''>('');
const selectedIntern = ref<number | ''>('');

// Notification state
const notificationMessage = ref('');
const notificationType = ref<'success' | 'error' | 'info'>('info');
const notificationShow = ref(false);
function showNotification(
  message: string,
  type: 'success' | 'error' | 'info' = 'info'
) {
  notificationShow.value = false; // Reset to allow retrigger
  notificationMessage.value = message;
  notificationType.value = type;
  // Use nextTick to ensure the DOM updates before showing again
  setTimeout(() => {
    notificationShow.value = true;
  }, 10);
}

const filteredRelations = computed(() => {
  return relations.value.filter(rel => {
    const mentorMatch =
      selectedMentor.value === '' || rel.mentorId === selectedMentor.value;
    const internMatch =
      selectedIntern.value === '' || rel.internId === selectedIntern.value;
    return mentorMatch && internMatch;
  });
});

const enrichedRelations = computed(() => {
  return relations.value.map(rel => {
    const mentor = mentors.value.find(
      m => String(m.id) === String(rel.mentor_id)
    );
    const intern = interns.value.find(
      i => String(i.id) === String(rel.intern_id)
    );
    return {
      ...rel,
      mentorName: mentor ? `${mentor.name} ${mentor.surname}` : '❓',
      internName: intern ? `${intern.name} ${intern.surname}` : '❓',
    };
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
    showNotification('Veriler alınamadı', 'error');
    console.error('Veriler alınamadı:', err);
  }
});

async function fetchRelations() {
  const relationRes = await axios.get('http://localhost:8085/api/relations');
  relations.value = relationRes.data;
}

async function assignMentor() {
  if (!selectedMentor.value || !selectedIntern.value) return;
  try {
    await axios.post('http://localhost:8085/api/relations', {
      mentorId: selectedMentor.value,
      internId: selectedIntern.value,
    });
    showNotification('Eşleştirme başarıyla yapıldı!', 'success');
    await fetchRelations(); // Always reload from backend
    selectedMentor.value = '';
    selectedIntern.value = '';
  } catch (e) {
    showNotification('Eşleştirme sırasında hata oluştu.', 'error');
  }
}

async function deleteRelation(id: number) {
  try {
    await axios.delete(`http://localhost:8085/api/relations/${id}`);
    relations.value = relations.value.filter(rel => rel.relation_id !== id);
    showNotification('Silme başarılı.', 'success');
    // Or, for always up-to-date data:
    // await fetchRelations();
  } catch (e) {
    showNotification('Silme başarısız.', 'error');
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
  color: #f58220;
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
  background-color: #f58220;
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
  color: #f58220;
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
  border-left: 6px solid #f58220;
  box-shadow: 0 2px 8px rgba(245, 130, 32, 0.08);
  transition: box-shadow 0.2s, border-color 0.2s;
}
.relation-item:hover {
  box-shadow: 0 4px 16px rgba(245, 130, 32, 0.18);
  border-left: 8px solid #f58220;
}
.relation-item span,
.relation-item strong {
  color: #f58220;
}
.delete-button {
  background-color: #e53935;
  color: white;
  border: 2px solid #f58220;
  padding: 6px 12px;
  font-size: 14px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s ease, border-color 0.2s;
  font-weight: bold;
}
.delete-button:hover {
  background-color: #f58220;
  color: #242441;
  border-color: #e53935;
}
</style>
