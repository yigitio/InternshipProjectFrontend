<template>
  <div class="profile-wrapper">
    <div class="profile-card">
      <button class="back-button" @click="goHome">
        ← {{ $t('internProfile.back') }}
      </button>
      <h2>👤 {{ $t('internProfile.title') }}</h2>
      <div class="profile-info">
        <p>
          <strong>{{ $t('internProfile.name') }}:</strong> {{ intern.name }}
          {{ intern.surname }}
        </p>
        <p>
          <strong>{{ $t('internProfile.email') }}:</strong> {{ intern.email }}
        </p>
        <p>
          <strong>{{ $t('internProfile.university') }}:</strong>
          {{ intern.university }}
        </p>
        <p>
          <strong>{{ $t('internProfile.department') }}:</strong>
          {{ intern.department }}
        </p>
        <p>
          <strong>{{ $t('internProfile.mentor') }}:</strong>
          {{ intern.mentorName }}
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useMsal } from 'vue3-msal-plugin';
import apiClient from '@/utils/apiClients';

const router = useRouter();

const intern = ref({
  name: '',
  surname: '',
  email: '',
  university: '',
  department: '',
  mentorName: '',
});

const { accounts } = useMsal();
const email = accounts.value[0].username;

onMounted(async () => {
  try {
    const res = await apiClient.get(`/api/interns/by-email?email=${email}`);
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
  margin-bottom: 24px;
  color: #333;
}

.profile-info p {
  font-family: sans-serif;
  font-size: 16px;
  margin-bottom: 12px;
  color: #222;
}

.back-button {
  font-family: sans-serif;
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
  font-family: sans-serif;
  background-color: #f5f5f5;
}
</style>
