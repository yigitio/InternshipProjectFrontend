// src/router/index.ts
import {
  createRouter,
  createWebHistory,
  type RouteRecordRaw,
} from 'vue-router';
import { msalApp } from '@/main';

import LoginView from '@/views/LoginView.vue';
import HomeView from '@/views/HomeView.vue';
import ProfileView from '@/views/ProfileView.vue';
import ReportView from '@/views/ReportView.vue';
import AdminView from '@/views/AdminView.vue'; // 👈 eklendi
import MentorHomeView from '@/views/MentorHomeView.vue';
import AssignmentForm from '@/views/AssignmentForm.vue';
import AssignmentList from '@/views/AssignmentList.vue';
import InternView from '@/views/InternView.vue';
import MentorView from '@/views/MentorView.vue';
import CreateAccount from '@/views/CreateAccount.vue';
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
    path: '/mentorhome',
    name: 'MentorHome',
    component: MentorHomeView,
    children: [
      {
        path: 'profile',
        name: 'Profile',
        component: ProfileView,
      },
      {
        path: '/assignmentForm',
        name: 'AssignmentForm',
        component: AssignmentForm,
      },
    ],
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

      { path: 'profile', name: 'Profile', component: ProfileView },
      { path: 'report', name: 'Report', component: ReportView },
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
    beforeEnter: () => {
      if (!msalApp.getActiveAccount()) {
        return { name: 'Login' };
      }
    },
  },
  {
    path: '/assignmentList',
    name: 'AssignmentList',
    component: AssignmentList,
    beforeEnter: () => {
      if (!msalApp.getActiveAccount()) {
        return { name: 'Login' };
      }
    },
  },
  // ====================================
  // Kayıt form rotaları:
  {
    path: '/register/intern',
    name: 'RegisterIntern',
    component: InternView,
    beforeEnter: () => {
      if (!msalApp.getActiveAccount()) {
        return { name: 'Login' };
      }
    },
  },
  {
    path: '/register',
    name: 'RegisterCreateAccount',
    component: CreateAccount,
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
