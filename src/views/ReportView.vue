<!-- src/views/ReportView.vue -->
<template>
  <div class="home-layout">
    <AppSidebar />

    <div class="home-content">
      <div class="card">
        <h2 class="card-title">Stajyer Rapor Bilgileri</h2>
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
  min-height: 100vh;
}

.home-content {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
  min-height: 100vh;
  background: #f9f9f9;
  margin-left: 160px;
  width: 100%;
  box-sizing: border-box;
}

.back-button:hover {
  background: #f0f0f0;
}

/* Kart stili */
.card {
  background: #ffffff;
  border-radius: 12px;
  padding: 32px;
  max-width: 800px;
  width: 100%;
  margin: 0 auto;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.08);
}

/* Başlık */
.card-title {
  font-size: 1.8rem;
  margin-bottom: 24px;
  color: #222;
}

/* Metin paragrafları */
.card-body p {
  margin-bottom: 1rem;
  line-height: 1.6;
  color: #444;
  font-size: 1.05rem;
}

/* Liste */
.report-list {
  list-style: none;
  padding: 0;
  margin-top: 1.5rem;
}
.report-list li {
  margin-bottom: 0.75rem;
  font-size: 1rem;
  display: flex;
  flex-wrap: wrap;
}
.report-list .label {
  min-width: 140px;
  font-weight: 600;
  color: #000;
}

/* Responsive */
@media (max-width: 1024px) {
  .home-content {
    margin-left: 0;
    padding: 16px;
  }
  .card {
    padding: 24px 16px;
    max-width: 95vw;
  }
}

@media (max-width: 768px) {
  .home-layout {
    flex-direction: column;
  }
  .home-content {
    margin-left: 0;
    padding: 12px;
    min-height: auto;
  }
  .card {
    padding: 16px 8px;
    max-width: 100vw;
  }
  .card-title {
    font-size: 1.3rem;
  }
  .card-body p {
    font-size: 0.98rem;
  }
  .report-list .label {
    min-width: 100px;
    font-size: 0.98rem;
  }
}

@media (max-width: 480px) {
  .card {
    padding: 8px 2px;
    border-radius: 6px;
  }
  .card-title {
    font-size: 1.1rem;
  }
  .report-list .label {
    min-width: 80px;
    font-size: 0.92rem;
  }
  .report-list li {
    font-size: 0.92rem;
  }
}
</style>
