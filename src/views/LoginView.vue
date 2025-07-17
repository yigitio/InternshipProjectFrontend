<template>
  <div class="login-page">
    <h1>Azure AD Giriş</h1>
    <button @click="login">Giriş Yap</button>
  </div>
</template>

<script setup lang="ts">
import { useMsal } from 'vue3-msal-plugin';
import { loginRequest } from '@/utils/authConfig';
import { useRouter } from 'vue-router';

const { instance } = useMsal();
const router = useRouter();

async function login() {
  try {
    // Popup ile login
    const resp = await instance.loginPopup(loginRequest);
    // Başarılıysa hesabı aktif et
    instance.setActiveAccount(resp.account);
    // Home sayfasına git
    router.push({ name: 'Home' });
  } catch (e) {
    console.error('Login hatası:', e);
  }
}
</script>

<style scoped>
.login-page {
  text-align: center;
  margin-top: 100px;
}
button {
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
}
</style>
