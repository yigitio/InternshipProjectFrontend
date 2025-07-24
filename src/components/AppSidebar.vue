<!-- src/components/AppSidebar.vue -->
<template>
  <div class="sidebar-container">
    <!-- Logo bölümü -->
    <router-link to="/home" class="logo-link">
      <img src="@/assets/logo.png" alt="Logo" class="logo" />
    </router-link>

    <!-- Menü -->
    <nav class="sidebar">
      <router-link to="/assignmentlist">Atanan Görevler</router-link>
      <router-link to="/programs">İndirilecek Program Listesi</router-link>
      <router-link to="/report">Stajyer Rapor Bilgileri</router-link>
      <router-link to="/goals">Haftalık Hedefler</router-link>
      <router-link to="/office">Ofis Bilgileri</router-link>
      <router-link to="/staff">Çalışan Bilgileri</router-link>
    </nav>

    <!-- Versiyon rozetini en alta ekliyoruz -->
    <div class="sidebar-version">v1.0.0</div>
  </div>
</template>

<script setup lang="ts">
// (no changes needed here)
</script>

<style scoped>
.sidebar-container {
  width: 220px;
  height: 100vh; /* kesin tam yükseklik */
  background-color: #242444;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  padding: 20px 20px 20px 0; /* sola padding=0, diğerleri 20px */
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.2);
  box-sizing: border-box; /* kesin hesaplamalar için */
}

.logo-link {
  margin-bottom: 20px;
  text-align: center;
  display: block;
  padding-left: 20px; /* sola biraz boşluk, ama container’ın keyfi padding’i yok */
}

.logo {
  max-width: 150px;
  max-height: 80px;
  object-fit: contain;
}

.sidebar {
  flex: 1 1 auto;
  display: flex;
  flex-direction: column;
  padding-left: 20px; /* menü öğelerine sol boşluk */
}

.sidebar a {
  color: white;
  text-decoration: none;
  padding: 8px;
  background-color: #34495e;
  margin-bottom: 10px;
  border-radius: 4px;
  display: block;
}

.sidebar a.router-link-exact-active {
  background-color: #1abc9c;
}

/* Version badge */
.sidebar-version {
  position: absolute;
  bottom: 16px;
  left: 16px;
  font-size: 13px;
  color: #888;
  letter-spacing: 1px;
}
</style>
