<template>
  <div class="sidebar-container">
    <!-- Logo bölümü -->
    <router-link to="/home" class="logo-link">
      <img src="@/assets/logo.png" alt="Logo" class="logo" />
    </router-link>

    <!-- Menü -->
    <nav class="sidebar">
      <router-link to="/assignmentlist">Yapılacaklar</router-link>
      <router-link to="/programs">İndirilecek Program Listesi</router-link>
      <router-link to="/report">Stajyer Rapor Bilgileri</router-link>
      <router-link to="/goals">Haftalık Hedefler</router-link>
      <router-link to="/office">Ofis Bilgileri</router-link>
      <router-link to="/staff">Çalışan Bilgileri</router-link>
    </nav>
  </div>
</template>

<style scoped>
.sidebar-container {
  width: 220px;
  min-height: 100vh;
  background-color: #242444;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  padding: 20px;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.2);
}

.logo-link {
  margin-bottom: 20px;
  text-align: center;
  display: block;
}

.logo {
  max-width: 150px;
  max-height: 80px;
  object-fit: contain;
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
</style>
