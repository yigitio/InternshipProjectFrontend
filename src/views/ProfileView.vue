<template>
  <div class="profile-wrapper">
    <div class="profile-card">
      <button class="back-button" @click="goHome">← Ana Sayfaya Dön</button>
      <h2>👤 Profil Bilgileri</h2>
      <div class="profile-info">
        <p><strong>Ad Soyad:</strong> {{ intern.name }} {{ intern.surname }}</p>
        <p><strong>Email:</strong> {{ intern.email }}</p>
        <p><strong>Üniversite:</strong> {{ intern.university }}</p>
        <p><strong>Bölüm:</strong> {{ intern.department }}</p>
        <p><strong>Mentor:</strong> {{ intern.mentorName }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useMsal } from 'vue3-msal-plugin';

// Vue Router kullanımı
const router = useRouter();

// Intern bilgileri
const intern = ref({
  name: '',
  surname: '',
  email: '',
  university: '',
  department: '',
  mentorName: '',
});

// Azure üzerinden login olan kullanıcının email adresini al
const { accounts } = useMsal();
const email = accounts.value[0].username;

// Sayfa yüklendiğinde backend'den intern bilgilerini çek
onMounted(async () => {
  try {
    const res = await axios.get(
      `http://localhost:8080/api/interns/email/${email}`
    );
    intern.value = {
      name: res.data.name,
      surname: res.data.surname,
      email: res.data.email,
      university: res.data.university,
      department: res.data.department,
      mentorName: res.data.mentorName,
    };
  } catch (err) {
    console.error('Profil bilgisi alınamadı:', err);
  }
});

function goHome() {
  router.push({ name: 'Home' });
}
</script>

<style scoped>
.profile-wrapper {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 40px 20px;
  margin-left: 220px; /* ❗ Sidebar genişliği kadar boşluk bırak */
  min-height: 100vh;
  background-color: #fff;
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
  margin-bottom: 24px;
  color: #333;
}

.profile-info p {
  font-size: 16px;
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
