// src/main.ts
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

import { msalPlugin, msalInstance } from 'vue3-msal-plugin';
import type {
  Configuration,
  AuthenticationResult,
  EventMessage,
} from '@azure/msal-browser';
import { EventType } from '@azure/msal-browser';

import { msalConfig } from './utils/authConfig';

// ————————————————
// 1) msalInstance’in beklediği parametre tipini al
type PluginConfig = Parameters<typeof msalInstance>[0];

// 2) msalConfig’i PluginConfig’e cast edip instance oluştur
const msalApp = msalInstance(msalConfig as unknown as PluginConfig);

// ————————————————
// ASYNC olarak initialize işlemi
(async () => {
  await msalApp.initialize(); // ✅ MSAL initialize edildi

  // 3) Sayfa yenilendiğinde hali hazırda login edilmişse hesabı aktif et
  const existingAccounts = msalApp.getAllAccounts();
  if (existingAccounts.length > 0) {
    msalApp.setActiveAccount(existingAccounts[0]);
  }

  // 4) Login başarılı olduğunda aktif hesabı güncelle
  msalApp.addEventCallback((event: EventMessage) => {
    if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
      const result = event.payload as AuthenticationResult;
      msalApp.setActiveAccount(result.account);
    }
  });

  // 5) Vue uygulamasını ayağa kaldır
  const app = createApp(App);
  app.use(router);
  app.use(msalPlugin, msalApp);
  app.mount('#app');
})();

export { msalApp };
