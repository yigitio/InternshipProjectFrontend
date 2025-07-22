// src/main.ts
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import { msalPlugin, msalInstance } from 'vue3-msal-plugin';
import type { Configuration } from '@azure/msal-browser';
import { msalConfig } from '@/utils/authConfig';

// 1) MSAL instance oluştur
const msalApp = msalInstance(msalConfig as Configuration);
(globalThis as any).msalApp = msalApp;
// 2) Tek bir bootstrap fonksiyonu
async function bootstrap() {
  // A) MSAL initialize & mevcut hesabı aktif et
  await msalApp.initialize();

  const existingAccounts = msalApp.getAllAccounts();
  if (existingAccounts.length > 0) {
    msalApp.setActiveAccount(existingAccounts[0]);
  }
  // B) Sadece oturumu başlat, yönlendirmeleri router yapsın!
  // Otomatik intern/mentor exists sorgusu, kayıt oluşturma YOK!

  // D) Vue uygulamasını ayağa kaldır
  const app = createApp(App);
  app.use(router);
  app.use(msalPlugin, msalApp);
  app.mount('#app');
}

// Async bootstrap çağrısı
bootstrap();

export { msalApp };
