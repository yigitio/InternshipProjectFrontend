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
import AssignmentList from '@/views/AssignmentList.vue';
import ReportView from '@/views/ReportView.vue';
import AdminView from '@/views/AdminView.vue'; // 👈 eklendi

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
      {
        path: '/report',
        name: 'Report',
        component: ReportView,
      },
      {
        path: '/assignmentList',
        name: 'AssignmentList',
        component: AssignmentList,
      },
      {
        path: 'admin', // 👈 Admin sayfası
        name: 'Admin',
        component: AdminView,
        beforeEnter: () => {
          const account = msalApp.getActiveAccount();
          const roleClaim = account?.idTokenClaims?.roles?.[0];
          if (roleClaim !== '3') {
            return { name: 'Home' };
          }
        },
      },
    ],
    beforeEnter: () => {
      if (!msalApp.getActiveAccount()) {
        return { name: 'Login' };
      }
    },
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
