import {
  createRouter,
  createWebHistory,
  RouterView,
  type RouteRecordRaw,
} from 'vue-router';
import { msalApp } from '@/main';
import api from '@/utils/apiClients';
import { fetchJobTitle } from '@/utils/graphClient';

import LoginView from '@/views/LoginView.vue';
import HomeView from '@/views/HomeView.vue';
import InternView from '@/views/InternView.vue';
import CreateAccount from '@/views/CreateAccount.vue';
import AdminView from '@/views/AdminView.vue';
import ReportView from '@/views/ReportView.vue';
import ProfileView from '@/views/ProfileView.vue';
import AssignmentList from '@/views/AssignmentList.vue';
import MentorHomeView from '@/views/MentorHomeView.vue';
import AssignmentForm from '@/views/AssignmentForm.vue';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: () =>
      msalApp.getActiveAccount() ? { name: 'Home' } : { name: 'Login' },
  },
  { path: '/login', name: 'Login', component: LoginView },
  {
    path: '/mentorhome',
    name: 'MentorHome',
    component: MentorHomeView,
    children: [
      {
        path: 'profile',
        name: 'MentorProfile',
        component: ProfileView,
      },
      {
        path: '/assignmentform',
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
        path: 'admin',
        name: 'Admin',
        component: AdminView,
        beforeEnter: () => {
          const account = msalApp.getActiveAccount();
          if (!account) return { name: 'Login' };
          const roles = (account.idTokenClaims as any)?.roles || [];
          if (!roles.includes('3')) return { name: 'Home' };
          return true;
        },
      },
      {
        path: '/report',
        name: 'Report',
        component: ReportView,
        beforeEnter: () =>
          !msalApp.getActiveAccount() ? { name: 'Login' } : true,
      },
      {
        path: 'profile',
        name: 'Profile',
        component: ProfileView,
        beforeEnter: () =>
          !msalApp.getActiveAccount() ? { name: 'Login' } : true,
      },
      {
        path: '/assignmentlist',
        name: 'AssignmentList',
        component: AssignmentList,
        beforeEnter: () =>
          !msalApp.getActiveAccount() ? { name: 'Login' } : true,
      },
    ],
  },
  {
    path: '/register',
    name: 'Register',
    component: RouterView,
    async beforeEnter() {
      const account = msalApp.getActiveAccount();
      if (!account) return { name: 'Login' };

      let title = '';
      try {
        title = (await fetchJobTitle()).toLowerCase();
        console.log("KULLANICININ TITLE'I:", title);
        //title = 'mentor';
      } catch (e) {
        console.error('JobTitle alınamadı:', e);
        return { name: 'Home' };
      }

      const email = account.username;
      // Eğer title içinde intern varsa
      if (title.includes('intern')) {
        // Bu kişi stajyer
        const { data: exists } = await api.get<boolean>('/interns/exists', {
          params: { email },
        });
        return exists
          ? { name: 'Home' }
          : { name: 'RegisterIntern', query: { email } };
      } else {
        // Bu kişi stajyer DEĞİL, mentor adayı
        const { data: exists } = await api.get<boolean>('/mentors/exists', {
          params: { email },
        });
        return exists
          ? { name: 'Home' }
          : { name: 'NotIntern', query: { email } };
      }
    },
  },
  {
    path: '/register/intern',
    name: 'RegisterIntern',
    component: InternView,
    beforeEnter: () => (!msalApp.getActiveAccount() ? { name: 'Login' } : true),
  },
  {
    path: '/register/not-intern',
    name: 'NotIntern',
    component: CreateAccount,
    beforeEnter: () => (!msalApp.getActiveAccount() ? { name: 'Login' } : true),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach(to => {
  const isAuth = !!msalApp.getActiveAccount();
  if (to.name !== 'Login' && !isAuth) return { name: 'Login' };
  if (to.name === 'Login' && isAuth) return { name: 'Home' };
});

export default router;
