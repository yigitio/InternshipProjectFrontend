<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { msalApp } from '@/main';
import AppSidebar from '@/components/AppSidebar.vue';
import type { AccountInfo } from '@azure/msal-browser';

const router = useRouter();
const showMenu = ref(false);
const isMsalReady = ref(false);

const account = ref<AccountInfo | null>(null);

onMounted(() => {
  const active = msalApp.getActiveAccount();
  if (active) {
    account.value = active;
    isMsalReady.value = true;
  }
});

const isAdmin = computed(() => {
  const roles = (account.value?.idTokenClaims as any)?.roles || [];
  return roles.includes('3');
});

async function handleLogout() {
  if (!isMsalReady.value || !account.value) {
    console.warn('MSAL instance not ready or no active account.');
    return;
  }

  try {
    await msalApp.logoutPopup();

    // Çıkış sonrası local state sıfırlanmalı
    account.value = null;
    isMsalReady.value = false;

    router.push({ name: 'Login' });
  } catch (error) {
    console.error('Logout error:', error);
    alert('Çıkış yapılamadı!');
  }
}
</script>

<template>
  <div class="home-layout">
    <AppSidebar />

    <div class="home-content">
      <!-- SAĞ ÜST DAİRE PROFİL FOTOĞRAFI -->
      <div
        class="profile-container"
        @mouseenter="showMenu = true"
        @mouseleave="showMenu = false"
      >
        <img src="@/assets/avatar.png" alt="Profile" class="profile-img" />
        <div v-if="showMenu" class="dropdown-menu">
          <router-link to="/home/profile">👤 Profil</router-link>
          <router-link v-if="isAdmin" to="/home/admin">👑 Admin</router-link>
          <a href="#" @click.prevent="handleLogout">🚪 Çıkış Yap</a>
        </div>
      </div>

      <!-- Sayfa içeriği -->
      <div class="main-view">
        <router-view />
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-layout {
  display: flex;
}

/* Sidebar sonrası içerik */
.home-content {
  flex-grow: 1;
  margin-left: 220px;
  position: relative;
  min-height: 100vh;
}

/* SAĞ ÜST PROFİL ALANI */
.profile-container {
  position: absolute;
  top: 12px;
  right: 16px;
}

.profile-img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #1abc9c;
  cursor: pointer;
}

.dropdown-menu {
  position: absolute;
  right: 0;
  top: 40px;
  background: white;
  box-shadow: 0 0 8px rgba(0, 0, 0, 0.2);
  border-radius: 6px;
  overflow: hidden;
  min-width: 140px;
  z-index: 999;
}

.dropdown-menu a,
.dropdown-menu router-link {
  display: block;
  padding: 10px;
  color: #333;
  text-decoration: none;
  transition: background 0.2s;
}

.dropdown-menu a:hover,
.dropdown-menu router-link:hover {
  background-color: #f0f0f0;
}

.main-view {
  padding: 20px;
}
</style>
