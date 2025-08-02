<!-- src/views/ReportView.vue -->
<template>
  <div class="home-layout">
    <AppSidebar />

    <div class="home-content">
      <div class="card">
        <h2 class="card-title">{{ $t('reportView.title') }}</h2>
        <div class="card-body">
          <p>{{ $t('reportView.p1') }}</p>
          <p>{{ $t('reportView.p2') }}</p>
          <p>{{ $t('reportView.p3') }}</p>

          <ul class="report-list">
            <li>
              <span class="label">{{ $t('reportView.fields.company') }}</span>
              Etiya Bilgi Teknolojileri Yazılım San ve Tic A.Ş.
            </li>
            <li>
              <span class="label">{{ $t('reportView.fields.account') }}</span>
              1670 - 6296510 TL
            </li>
            <li>
              <span class="label">{{ $t('reportView.fields.iban') }}</span>
              TR64 0006 2001 6700 0006 2965 10
            </li>
            <li>
              <span class="label">{{ $t('reportView.fields.branch') }}</span>
              Topkapı Ticari (Kodu: 286)
            </li>
            <li>
              <span class="label">{{ $t('reportView.fields.meris') }}</span>
              0381044304100019
            </li>
            <li>
              <span class="label">{{ $t('reportView.fields.tax') }}</span>
              3810443041
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import AppSidebar from '@/components/AppSidebar.vue';
</script>

<style scoped>
.home-layout {
  display: flex;
  flex-direction: row;
  height: 80vh;
  box-sizing: border-box;
}

.home-content {
  display: flex;
  justify-content: flex-start; /* sola hizalama */
  align-items: flex-start; /* yukarı hizalama */
  padding: 24px;
  margin-left: 0px;
  width: 100%;
  box-sizing: border-box;
  background: white; /* Gri arka planı kaldırdık */
}

.card {
  background: #ffffff;
  border-radius: 12px;
  padding: 24px;
  max-width: 800px; /* Daha küçük pencere */
  width: 100%;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
  margin-top: 24px;
  margin-left: 0px; /* sola yaslı */
}

.card-title {
  font-size: 1.6rem;
  margin-bottom: 20px;
  color: #222;
}

.card-body p {
  margin-bottom: 0.9rem;
  line-height: 1.6;
  color: #444;
  font-size: 1rem;
  font-family: sans-serif;
}

.report-list {
  list-style: none;
  padding: 0;
  margin-top: 1.5rem;
  font-family: sans-serif;
}
.report-list li {
  margin-bottom: 0.75rem;
  font-size: 0.95rem;
  display: flex;
  flex-wrap: wrap;
}
.report-list .label {
  min-width: 90px;
  font-weight: 600;
  color: #000;
}

/* Mobil uyum */
@media (max-width: 1024px) {
  .home-content {
    margin-left: 0;
    padding: 16px;
  }
  .card {
    padding: 20px;
    max-width: 95vw;
  }
}
@media (max-width: 768px) {
  .home-layout {
    flex-direction: column;
  }
  .home-content {
    padding: 12px;
  }
  .card {
    padding: 16px;
    max-width: 100%;
  }
}
</style>
