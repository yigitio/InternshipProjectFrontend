<template>
  <div class="login-container">
    <h2>Azure Login</h2>
    <button @click="signIn">Giriş Yap</button>
  </div>
</template>

<script lang="ts" setup>
import { inject } from 'vue';
import type { PublicClientApplication } from '@azure/msal-browser';

const msalInstance = inject<PublicClientApplication>('msalInstance');

const signIn = async () => {
  try {
    await msalInstance?.loginRedirect({
      scopes: ['user.read'],
    });
  } catch (err) {
    console.error('Login error:', err);
  }
};
</script>

<style scoped>
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 10vh;
}
button {
  padding: 10px 20px;
  font-size: 16px;
}
</style>
