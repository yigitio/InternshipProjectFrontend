import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from 'vue-router';
import LoginView from '@/views/LoginView.vue';
import HomeView from '@/views/HomeView.vue';
import RedirectView from '@/views/RedirectView.vue';
import { msalApp } from '@/main';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Login',
    component: LoginView,
  },
  {
    path: '/redirect',
    name: 'Redirect',
    component: RedirectView, // ← artık burada bir component var
    beforeEnter: async () => {
      await msalApp.handleRedirectPromise();
      const acct = msalApp.getAllAccounts()[0];
      if (acct) {
        msalApp.setActiveAccount(acct);
        return { name: 'Home' };
      }
      return { name: 'Login' };
    },
  },
  {
    path: '/home',
    name: 'Home',
    component: HomeView,
    beforeEnter: () => {
      if (!msalApp.getActiveAccount()) {
        return { name: 'Login' };
      }
    },
  },
];

export default createRouter({
  history: createWebHistory(),
  routes,
});
