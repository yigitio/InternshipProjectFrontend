<!-- src/views/ReportView.vue -->
<template>
  <div class="home-layout">
    <AppSidebar />

    <div class="home-content">
      <div class="card">
        <h2 class="card-title">Stajyer Defter Bilgileri</h2>
        <div class="card-body">
          <p>
            Etiya, müşteri deneyimi odaklı ve yapay zeka destekli dijital
            dönüşüm çözümleri sunan global bir teknoloji şirketidir. Şirket, 3
            kıtada ve 7 ülkede faaliyet göstermekte olup 1600’den fazla
            çalışanıyla sektörde hizmet vermektedir.
          </p>
          <p>
            2004 yılında kurulan Etiya, birlikte başarmanın gücüne inanarak hem
            şirket içi ekiplerine hem müşterilerine hem de çevre ve topluma
            katkı sağlamak için çalışmalarını sürdürmektedir. Hedeflerini,
            sınırlarını ve karşılaştığı zorlukları her geçen gün aşarak
            durmaksızın ilerlemeyi misyon edinmiştir.
          </p>
          <p>
            Şirketin kadrosu, %39 kadın ve %61 erkek çalışan oranına sahiptir.
            Ortalama yaşın 31 olduğu Etiya’da genç ve dinamik bir ekip yapısı
            dikkat çekmektedir. Çok uluslu yapısıyla farklı lokasyonlarda etkin
            bir şekilde faaliyet gösteren şirket, teknolojiyi insan odaklı bir
            yaklaşımla birleştirmektedir.
          </p>

          <ul class="report-list">
            <li>
              <span class="label">Şirket Ünvanı:</span> Etiya Bilgi
              Teknolojileri Yazılım San ve Tic A.Ş.
            </li>
            <li><span class="label">Hesap:</span> 1670 - 6296510 TL</li>
            <li>
              <span class="label">IBAN:</span> TR64 0006 2001 6700 0006 2965 10
            </li>
            <li><span class="label">Şube:</span> Topkapı Ticari (Kodu: 286)</li>
            <li><span class="label">Meris No:</span> 0381044304100019</li>
            <li><span class="label">Vergi No:</span> 3810443041</li>
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
