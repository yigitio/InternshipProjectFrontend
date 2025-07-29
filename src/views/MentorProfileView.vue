<template>
  <div class="profile-wrapper">
    <div class="profile-card">
      <button class="back-button" @click="goHome">← Ana Sayfaya Dön</button>
      <h2>👤 Profil Bilgileri</h2>
      <div class="profile-info">
        <p><strong>Ad Soyad:</strong> {{ mentor.name }} {{ mentor.surname }}</p>
        <p><strong>Email:</strong> {{ mentor.email }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useMsal } from 'vue3-msal-plugin';
import apiClient from '@/utils/apiClients';

// Vue Router kullanımı
const router = useRouter();

const mentor = ref({
  name: '',
  surname: '',
  email: '',
});

// Azure üzerinden login olan kullanıcının email adresini al
const { accounts } = useMsal();
const email = accounts.value[0].username;

onMounted(async () => {
  try {
    const res = await apiClient.get(`/api/mentors/email/${email}`);
    mentor.value = {
      name: res.data.name,
      surname: res.data.surname,
      email: res.data.email,
    };
  } catch (err) {
    console.error('Profil bilgisi alınamadı:', err);
  }
});

function goHome() {
  router.push({ name: 'MentorHome' });
}
</script>

<style scoped>
.profile-wrapper {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  padding-top: 40px;
  margin-left: 80px;
  height: 80vh;
  background-color: #fff;
  overflow: auto;
}

.profile-card {
  width: 100%;
  max-width: 750px;
  background: white;
  border-radius: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  padding: 32px;
  z-index: 1;
}

.profile-card h2 {
  font-size: 24px;
  font-family: sans-serif;
  margin-bottom: 24px;
  color: #333;
}

.profile-info p {
  font-size: 16px;
  font-family: sans-serif;
  margin-bottom: 12px;
  color: #222;
}

.back-button {
  background-color: white;
  border: 1px solid #ccc;
  padding: 8px 12px;
  border-radius: 6px;
  margin-bottom: 16px;
  cursor: pointer;
  font-size: 14px;
  color: #333;
  transition: background-color 0.2s ease;
}

.back-button:hover {
  background-color: #f5f5f5;
}
</style>
