// src/router/index.ts
import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from 'vue-router';
import LoginView from '@/views/LoginView.vue';
import HomeView from '@/views/HomeView.vue';
import { msalApp } from '@/main';
import AssignmentForm from '@/views/AssignmentForm.vue';
import ProfileView from '@/views/ProfileView.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: () =>
      msalApp.getActiveAccount() ? { name: 'Home' } : { name: 'Login' },
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
    children: [
      {
        path: 'profile',
        name: 'Profile',
        component: ProfileView,
      },
    ],
    beforeEnter: () => {
      if (!msalApp.getActiveAccount()) {
        return { name: 'Login' };
      }
    },
  },
  {
    path: '/assignmentForm',
    name: 'AssignmentForm',
    component: AssignmentForm,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(to => {
  const isAuthenticated = !!msalApp.getActiveAccount();

  if (to.name !== 'Login' && !isAuthenticated) {
    return { name: 'Login' };
  }
  if (to.name === 'Login' && isAuthenticated) {
    return { name: 'Home' };
  }
});

export default router;
