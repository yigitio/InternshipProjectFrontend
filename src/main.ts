// src/main.ts
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import { msalPlugin, msalInstance } from 'vue3-msal-plugin';
import type { Configuration } from '@azure/msal-browser';
import { msalConfig } from '@/utils/authConfig';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '@fortawesome/fontawesome-free/css/all.css'; // <--- BU ÇOK ÖNEMLİ

// 1) MSAL instance oluştur ve globalThis’e ata
const msalApp = msalInstance(msalConfig as Configuration);
(globalThis as any).msalApp = msalApp;

// 2) Uygulamayı ayağa kaldır
async function bootstrap() {
  // A) MSAL initialize & varsa önceki hesabı aktif et
  await msalApp.initialize();
  const existing = msalApp.getAllAccounts();
  if (existing.length > 0) {
    msalApp.setActiveAccount(existing[0]);
  }

  // B) Vue app
  const app = createApp(App);
  app.use(router);
  app.use(msalPlugin, msalApp);
  app.mount('#app');
}

// 3) Başlat
bootstrap();

// 4) Router ve diğer dosyalar import edebilsin diye export et
export { msalApp };
