import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from 'vue-router';
import LoginView from '@/views/LoginView.vue';
import HomeView from '@/views/HomeView.vue';
import { msalApp } from '@/main';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    // Kök URL’ye girince Auth’a bak, varsa Home, yoksa Login
    redirect: () => {
      return msalApp.getActiveAccount() ? { name: 'Home' } : { name: 'Login' };
    },
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
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
