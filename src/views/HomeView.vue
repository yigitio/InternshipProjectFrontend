<template>
  <div class="home-layout">
    <AppSidebar />

    <div class="home-content">
      <!-- Üst bar -->
      <div class="topbar">
        <router-link to="/profile" class="profile-button">
          <img src="@/assets/avatar.png" alt="Profile" />
        </router-link>
      </div>

      <!-- İçerik -->
      <div class="main-view">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import AppSidebar from '@/components/AppSidebar.vue';
</script>

<style scoped>
.home-layout {
  display: flex;
}

.home-content {
  flex-grow: 1;
  margin-left: 220px;
  display: flex;
  flex-direction: column;
}

.topbar {
  height: 60px;
  background-color: #f5f5f5;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  padding: 0 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.profile-button img {
  width: 42px;
  height: 42px;
  border-radius: 12px; /* kare köşeli ama yuvarlatılmış */
  object-fit: cover;
  border: 2px solid #1abc9c;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.profile-button img:hover {
  transform: scale(1.05);
}
</style>
