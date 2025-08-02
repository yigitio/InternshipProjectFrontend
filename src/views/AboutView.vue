<template>
  <div class="about-container">
    <h1>{{ $t('about.title') }}</h1>
    <div class="about-content">
      <p>{{ $t('about.p1') }}</p>
      <p>{{ $t('about.p2') }}</p>
      <p>{{ $t('about.p3') }}</p>
    </div>
  </div>
</template>

<style scoped>
.about-container {
  max-width: 600px;
  margin: 40px auto;
  background: #fff;
  color: #242441;
  padding: 28px 24px;
  border-radius: 18px;
  box-shadow: 0 4px 22px rgba(50, 40, 70, 0.11);
  max-height: calc(100vh - 80px); /* Ekran taşmasını engeller */
  overflow-y: auto; /* Fazla içerik olursa kaydırır ama genelde gerek kalmaz */
}

.about-container h1 {
  color: #242441;
  font-size: 26px;
  margin-bottom: 24px;
  text-align: center;
  font-weight: 700;
}

.about-content p {
  margin-bottom: 16px;
  font-size: 16px;
  line-height: 1.6;
}
</style>
