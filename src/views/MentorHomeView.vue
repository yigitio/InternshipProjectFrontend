<template>
  <div class="home-layout">
    <MentorAppSidebar />

    <div class="home-content">
      <!-- SAĞ ÜST DAİRE PROFİL FOTOĞRAFI -->
      <div
        class="profile-container"
        @mouseenter="showMenu = true"
        @mouseleave="showMenu = false"
      >
        <img src="@/assets/avatar.png" alt="Profile" class="profile-img" />
        <div v-if="showMenu" class="dropdown-menu">
          <router-link to="/mentorhome/mentorprofile">👤 Profil</router-link>
          <router-link v-if="isAdmin" to="/mentorhome/admin"
            >⚙️ Admin Paneli</router-link
          >
          <a href="#" @click.prevent="handleLogout">🚪 Çıkış Yap</a>
        </div>
      </div>

      <!-- Sayfa içeriği -->
      <div class="main-view">
        <MentorDashboard />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import MentorAppSidebar from '@/components/MentorAppSidebar.vue';
import MentorDashboard from '@/views/MentorDashboard.vue';
import { ref, computed } from 'vue';
import { msalApp } from '@/main';
const showMenu = ref(false);

const account = msalApp.getActiveAccount();
const roles = ((account?.idTokenClaims as any)?.roles as string[]) || [];
const isAdmin = computed(() => roles.includes('3')); // '3' admin rolü ise

function handleLogout() {
  // Logout işlemini burada yönetiyorsan aynen bırak
  msalApp.logout();
}
</script>

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
  border-radius: 50%; /* TAMAMEN CIRCLE */
  object-fit: cover;
  border: 2px solid #1abc9c;
  cursor: pointer;
}

/* Hover ile açılan menü */
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
