<template>
  <div class="form-container">
    <AppNotification
      :message="notificationMessage"
      :type="notificationType"
      :show="notificationShow"
      :duration="2200"
    />
    <h2>Yeni Duyuru Ekle</h2>
    <form @submit.prevent="submitAnnouncement">
      <label for="title">Başlık:</label>
      <input id="title" v-model="title" type="text" required />

      <label for="content">İçerik:</label>
      <textarea id="content" v-model="content" required />

      <button type="submit">Duyuru Ekle</button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import apiClient from '@/utils/apiClients';
import AppNotification from '@/components/AppNotification.vue';
import { useMsal } from 'vue3-msal-plugin';

const title = ref('');
const content = ref('');
const mentorId = ref<number | null>(null);

const notificationMessage = ref('');
const notificationType = ref<'success' | 'error' | 'info'>('info');
const notificationShow = ref(false);

const { accounts } = useMsal();
const email = accounts.value[0].username;

function showNotification(
  message: string,
  type: 'success' | 'error' | 'info' = 'info'
) {
  notificationShow.value = false;
  notificationMessage.value = message;
  notificationType.value = type;
  setTimeout(() => {
    notificationShow.value = true;
  }, 10);
}

onMounted(async () => {
  try {
    const res = await apiClient.get(
      `/api/mentors/email/${encodeURIComponent(email)}`
    );
    mentorId.value = res.data.id;
  } catch (err) {
    console.error('Mentor ID alınamadı:', err);
    showNotification('Mentor bilgisi alınamadı.', 'error');
  }
});

const submitAnnouncement = async () => {
  if (!title.value || !content.value) {
    showNotification('Lütfen başlık ve içerik girin.', 'error');
    return;
  }

  if (!mentorId.value) {
    showNotification('Mentor ID bulunamadı.', 'error');
    return;
  }

  try {
    await apiClient.post('/api/announcements', {
      title: title.value,
      content: content.value,
      mentorId: mentorId.value,
    });

    showNotification('Duyuru başarıyla eklendi!', 'success');
    title.value = '';
    content.value = '';
  } catch (err) {
    showNotification('Duyuru eklenirken bir hata oluştu.', 'error');
    console.error(err);
  }
};
</script>

<style scoped>
.form-container {
  padding: 2rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}
h2 {
  margin-bottom: 1.5rem;
  color: #333;
}
form {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
  width: 100%;
  max-width: 450px;
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
textarea {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  box-sizing: border-box;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica,
    Arial, sans-serif;
  font-size: 1rem;
  font-weight: 400;
  color: #333;
}
textarea {
  min-height: 100px;
  resize: vertical;
}
button {
  margin-top: 1rem;
  padding: 12px;
  background-color: #242441;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 1.1rem;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s ease;
}
button:hover {
  background-color: #1e1e38;
}
@media (max-width: 600px) {
  .form-container {
    padding: 1rem;
  }
  form {
    padding: 1.5rem;
    box-shadow: none;
    border: 1px solid #eee;
  }
  h2 {
    font-size: 1.5rem;
  }
}
</style>
