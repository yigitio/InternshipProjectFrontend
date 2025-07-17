<template>
  <div class="login-page">
    <h1>Azure AD Giriş</h1>
    <button @click="login">Giriş Yap</button>
  </div>
</template>

<script setup lang="ts">
import { useMsal } from 'vue3-msal-plugin';
import { loginRequest } from '@/utils/authConfig';

const { instance } = useMsal();

function login() {
  instance.loginRedirect(loginRequest);
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
