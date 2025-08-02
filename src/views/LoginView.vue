<template>
  <div class="login-wrapper">
    <div class="login-card">
      <img
        src="@/assets/lantern_main_logo.png"
        alt="Etiya"
        class="etiya-logo"
      />
      <img
        src="@/assets/lighthouse-logo.png"
        alt="Lighthouse"
        class="lighthouse-img"
      />
      <h1>{{ $t('loginView.title') }}</h1>
      <p class="subtitle">{{ $t('loginView.subtitle') }}</p>
      <button class="login-button" @click="login">
        {{ $t('loginView.button') }}
      </button>
      <div class="app-version">{{ APP_VERSION }}</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useMsal } from 'vue3-msal-plugin';
import { loginRequest } from '@/utils/authConfig';
import { useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import { APP_VERSION } from '@/utils/version';

const { instance } = useMsal();
const router = useRouter();
const { handlePostLogin } = useAuth();

async function login() {
  try {
    const resp = await instance.loginPopup(loginRequest);
    instance.setActiveAccount(resp.account);
    router.push({ name: 'Register' });
    await handlePostLogin();
  } catch (e) {
    console.error('Login hatası:', e);
  }
}
</script>

<style scoped>
.login-wrapper {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #201b51, #242441);
}
.login-card {
  background-color: #ffffff;
  width: 360px;
  padding: 32px 24px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.25);
  text-align: center;
  border-radius: 16px;
}
.etiya-logo {
  width: 200px;
  margin-bottom: 16px;
}
.lighthouse-img {
  width: 100%;
  border-radius: 8px;
  margin-bottom: 20px;
}
h1 {
  font-size: 22px;
  margin-bottom: 8px;
  font-weight: 700;
  color: #1e1e1e;
}
.subtitle {
  font-size: 14px;
  color: #555;
  margin-bottom: 24px;
}
.login-button {
  width: 100%;
  padding: 12px;
  font-size: 16px;
  color: white;
  background-color: #242441;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s ease;
}
.login-button:hover {
  background-color: #1e1e3f;
}
.app-version {
  margin-top: 16px;
  font-size: 13px;
  color: #888;
  text-align: center;
  letter-spacing: 1px;
}
</style>
