<template>
  <div class="home-layout">
    <MentorAppSidebar :isAdmin="isAdmin ? '3' : ''" />

    <div class="home-content">
      <div class="main-view">
        <!-- SAĞ ÜST PROFİL FOTOĞRAFI -->
        <div
          class="profile-container"
          @mouseenter="showMenu = true"
          @mouseleave="showMenu = false"
        >
          <img src="@/assets/avatar.png" alt="Profile" class="profile-img" />
          <div v-if="showMenu" class="dropdown-menu">
            <router-link to="/mentorhome/mentorprofile"
              >👤 {{ $t('home.profile') }}</router-link
            >
            <a href="#" @click.prevent="handleLogout"
              >🚪 {{ $t('home.logout') }}</a
            >
          </div>
        </div>

        <!-- Dinamik Sayfa Bileşeni -->
        <router-view v-slot="{ Component }">
          <div v-if="Component">
            <component :is="Component" />
          </div>
          <div v-else class="dashboard-wrapper">
            <MentorDashboard />
          </div>
        </router-view>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { msalApp } from '@/main';
import type { AccountInfo } from '@azure/msal-browser';

import MentorAppSidebar from '@/components/MentorAppSidebar.vue';
import MentorDashboard from '@/views/MentorDashboard.vue';

const router = useRouter();
const { locale } = useI18n();
const showMenu = ref(false);
const account = ref<AccountInfo | null>(null);
const isMsalReady = ref(false);

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

function handleLogout() {
  msalApp.logout();
}
</script>

<style scoped>
.home-layout {
  display: flex;
  height: 95vh;
  overflow: hidden;
}

.home-content {
  flex-grow: 1;
  margin-left: 220px;
  position: relative;
  background: white;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  box-sizing: border-box;
  overflow: hidden;
}

.main-view {
  position: relative;
  padding: 20px;
  width: 100%;
  max-width: 1000px;
  height: 100vh;
  overflow-y: scroll; /* Scroll açık */

  /* Scroll barı gizle */
  scrollbar-width: none; /* Firefox */
}
.main-view::-webkit-scrollbar {
  display: none; /* Chrome, Safari */
}

.profile-container {
  position: fixed;
  top: 12px;
  right: 16px;
  z-index: 1000;
}

.profile-img {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #242441;
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

.dashboard-wrapper {
  max-width: 1200px;
  margin: 0 auto;
  padding: 40px 20px;
}
</style>
