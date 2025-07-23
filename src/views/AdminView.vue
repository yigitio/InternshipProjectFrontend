<template>
  <div class="admin-container">
    <AppNotification
      :message="notificationMessage"
      :type="notificationType"
      :show="notificationShow"
      :duration="2200"
    />
    <div class="admin-card">
      <h1>⚙️ Admin Paneli</h1>
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
        Mevcut Eşleşmeler ({{ enrichedRelationsFiltered.length }})
      </h2>

      <div v-if="enrichedRelationsFiltered.length === 0">
        Hiçbir eşleşme bulunamadı.
      </div>

      <!-- EŞLEŞMELERİN COMPONENT HALİ -->
      <RelationList
        v-if="enrichedRelationsFiltered.length > 0"
        :relations="enrichedRelationsFiltered"
        @delete="deleteRelation"
        @edit="openEditPopup"
      />
    </div>
  </div>
  <div v-if="editPopupVisible" class="modal-overlay">
    <div class="modal-content">
      <h3>Düzenle</h3>
      <div v-if="editRelation">
        <p>
          <strong>Mentor Email:</strong> {{ editRelation.mentorEmail || '...' }}
        </p>
        <p>
          <strong>Stajyer Email:</strong>
          {{ editRelation.internEmail || '...' }}
        </p>
        <p>
          <strong>Başlangıç Tarihi:</strong>
          {{ editRelation.start_date || '...' }}
        </p>
        <p>
          <strong>Bitiş Tarihi:</strong>
          {{ editRelation.end_date || '...' }}
        </p>
        <label>
          <input
            type="checkbox"
            v-model="editRelation.is_active"
            :true-value="1"
            :false-value="0"
          />
          Aktif mi?
        </label>
        <div style="margin-top: 16px">
          <button @click="saveEditRelation">Kaydet</button>
          <button @click="closeEditPopup" style="margin-left: 8px">
            Kapat
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import AppNotification from '@/components/AppNotification.vue';
import RelationList from '@/components/RelationList.vue'; // EKLEDİK

const mentors = ref<any[]>([]);
const interns = ref<any[]>([]);
const relations = ref<any[]>([]);

const selectedMentor = ref<number | ''>('');
const selectedIntern = ref<number | ''>('');

// Bildirim state'i
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

// Relation'ları mentor ve stajyer adıyla zenginleştir
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

// SADECE is_active === 1 olanlar ve seçili mentor/stajyer filtresi
const enrichedRelationsFiltered = computed(() => {
  return enrichedRelations.value
    .filter(rel => rel.is_active === 1) // SADECE aktif olanlar (integer)
    .filter(rel => {
      const mentorMatch =
        selectedMentor.value === '' || rel.mentor_id === selectedMentor.value;
      const internMatch =
        selectedIntern.value === '' || rel.intern_id === selectedIntern.value;
      return mentorMatch && internMatch;
    })
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
});

const editPopupVisible = ref(false);
const editRelation = ref<any | null>(null);

function openEditPopup(rel: any) {
  // Email ve tarihleri mentor/intern arrayinden çek
  const mentor = mentors.value.find(m => m.id === rel.mentor_id);
  const intern = interns.value.find(i => i.id === rel.intern_id);
  // is_active her zaman integer olarak tutulacak
  let isActiveInteger = rel.is_active;
  if (typeof isActiveInteger === 'boolean') {
    isActiveInteger = rel.is_active ? 1 : 0;
  } else if (isActiveInteger === undefined || isActiveInteger === null) {
    isActiveInteger = 1;
  }
  editRelation.value = {
    ...rel,
    mentorEmail: mentor?.email || '',
    internEmail: intern?.email || '',
    start_date: rel.start_date || '',
    end_date: rel.end_date || '',
    is_active: isActiveInteger,
  };
  editPopupVisible.value = true;
}
function closeEditPopup() {
  editPopupVisible.value = false;
  editRelation.value = null;
}
async function saveEditRelation() {
  if (!editRelation.value) return;
  try {
    await axios.put(
      `http://localhost:8085/api/relations/${editRelation.value.relation_id}`,
      {
        relationId: editRelation.value.relation_id,
        internId: editRelation.value.intern_id,
        mentorId: editRelation.value.mentor_id,
        is_active: editRelation.value.is_active, // integer olarak gönderilecek
        // Diğer alanlar gerekiyorsa ekle
      }
    );
    await fetchRelations(); // Listeyi yenile
    closeEditPopup();
    showNotification('Güncelleme başarılı!', 'success');
  } catch (e) {
    showNotification('Güncelleme başarısız.', 'error');
  }
}

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
      // is_active alanı backend tarafında default 1 olarak atanıyor olabilir.
    });
    showNotification('Eşleştirme başarıyla yapıldı!', 'success');
    await fetchRelations();
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
    // Her zaman güncel veri için:
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

/* Popup stilleri ve diğerleri aynı kalabilir */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}
.modal-content {
  background: #fff;
  color: #242441;
  padding: 32px 24px;
  border-radius: 12px;
  min-width: 320px;
  max-width: 90vw;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.18);
}
</style>
