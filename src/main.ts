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
import api, { axiosInstance } from '@/utils/apiClients';

// ——————————————————————
// 1) MSAL instance oluştur ve initialize et
// PluginConfig tipi, msalInstance fonksiyonunun beklediği parametre tipidir
type PluginConfig = Parameters<typeof msalInstance>[0];
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

// Bootstrap fonksiyonu ile async initialization ve yönlendirme akışını yönetiyoruz
async function bootstrap() {
  // 2) MSAL kütüphanesini initialize et
  await msalApp.initialize();

  // 3) Sayfa yenilendiğinde hali hazırda login edilmişse hesabı aktif et
  const existingAccounts = msalApp.getAllAccounts();
  if (existingAccounts.length > 0) {
    msalApp.setActiveAccount(existingAccounts[0]);
  }

  // 4) LOGIN_SUCCESS eventi gerçekleştiğinde aktifi güncelle ve kayıt akışını başlat
  msalApp.addEventCallback(async (event: EventMessage) => {
    if (event.eventType === EventType.LOGIN_SUCCESS && event.payload) {
      const result = event.payload as AuthenticationResult;
      msalApp.setActiveAccount(result.account);
      const email = result.account.username;

      try {
        // Intern kaydı var mı?
        const { data: interns } = await axiosInstance.get(
          `/interns/exists?email=${email}`
        );
        if (interns.length > 0) {
          router.replace({ name: 'Home' });
        } else {
          // Yoksa yeni intern kaydı oluşturup kayıt formuna
          await api.post('/interns', { email, role: 'Intern' });
          router.replace({ name: 'RegisterIntern' });
        }
      } catch (err) {
        console.error('Kayıt akışı hatası:', err);
      }
    }
  });

  // 5) Redirect tabanlı auth akışı tamamlandığında işle
  try {
    const resp = await msalApp.handleRedirectPromise();
    if (resp?.account) {
      msalApp.setActiveAccount(resp.account);
      const email = resp.account.username;
      const { data: interns } = await api.get(`/interns?email=${email}`);
      if (interns.length > 0) {
        router.replace({ name: 'Home' });
      } else {
        await api.post('/interns', { email, role: 'Intern' });
        router.replace({ name: 'RegisterIntern' });
      }
    }
  } catch (err) {
    console.error('Redirect sonrası akış hatası:', err);
  }

  // 6) Vue uygulamasını ayağa kaldır
  const app = createApp(App);
  app.use(router);
  app.use(msalPlugin, msalApp);
  app.mount('#app');
}

// Async bootstrap çağrısı
bootstrap();
export { msalApp };
