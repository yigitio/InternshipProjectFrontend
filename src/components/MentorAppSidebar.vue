<template>
  <div class="sidebar-container">
    <!-- Logo bölümü -->
    <router-link to="/mentorhome" class="logo-link">
      <img src="@/assets/logo.png" alt="Logo" class="logo" />
    </router-link>

    <nav class="sidebar">
      <router-link to="/assignmentForm">Görev İşlemleri</router-link>
      <router-link to="/assignmentTracking">Görev Takibi</router-link>
      <router-link to="/mentorhome/announcement">Duyuru İşlemleri</router-link>
      <router-link v-if="isAdmin === '3'" to="/mentorhome/admin">
        Admin Paneli
      </router-link>
      <!-- Hakkında butonu en alta -->
    </nav>

    <!-- Hakkında ve versiyon -->
    <div class="sidebar-bottom">
      <router-link to="/mentorhome/about" class="about-link"
        >Hakkında</router-link
      >
      <div class="sidebar-version">v1.0.1</div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ isAdmin: string }>();
</script>

<style scoped>
.sidebar-container {
  width: 220px;
  height: 100vh;
  background: #242441;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  padding: 20px 20px 20px 0;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
  overflow-y: auto;
}

/* Logo */
.logo-link {
  margin-bottom: 20px;
  text-align: center;
  display: block;
  padding-left: 20px;
}
.logo {
  max-width: 150px;
  max-height: 80px;
  object-fit: contain;
}

/* Menü alanı */
.sidebar {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  padding-left: 20px;
}

/* Menü öğeleri */
.sidebar a {
  color: white;
  text-decoration: none;
  padding: 10px 14px;
  background-color: transparent;
  margin-bottom: 8px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
  font-weight: 500;
  transition: background-color 0.2s ease;
}

.sidebar a:hover {
  background-color: rgba(255, 255, 255, 0.15);
}

/* Aktif (seçili) link */
.sidebar a.router-link-exact-active {
  background-color: rgba(255, 255, 255, 0.3);
}

/* Scrollbar özelleştirmesi */
.sidebar-container::-webkit-scrollbar {
  width: 6px;
}
.sidebar-container::-webkit-scrollbar-thumb {
  background-color: rgba(255, 255, 255, 0.3);
  border-radius: 10px;
}
.sidebar-bottom {
  margin-top: auto;
  padding-bottom: 30px;
  display: flex;
  flex-direction: column;
  align-items: flex-start; /* Sola hizala */
  padding-left: 20px;
}
/* Hakkında butonu */
.about-link {
  color: white;
  text-decoration: none;
  padding: 10px 14px;
  background-color: transparent;
  margin-bottom: 8px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 15px;
  font-weight: 500;
  transition: background-color 0.2s ease;
  width: 84%; /* EKLENDİ: diğer öğelerle hizalanması için */
}

.about-link:hover {
  background-color: rgba(255, 255, 255, 0.15);
}

/* Aktif (seçili) 'Hakkında' linki için */
.about-link.router-link-exact-active {
  background-color: rgba(255, 255, 255, 0.3);
}

/* Versiyon */
.sidebar-version {
  width: 100%;
  position: absolute;
  bottom: 16px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 13px;
  color: #ccc;
  letter-spacing: 1px;
  text-align: center;
}
</style>
