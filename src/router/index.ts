// src/router/index.ts
import {
  createRouter,
  createWebHistory,
  RouterView,
  type RouteRecordRaw,
  type RouteLocationNormalized,
} from 'vue-router';
import { msalApp } from '@/main';
import api from '@/utils/apiClients';
import { fetchJobTitle } from '@/utils/graphClient';
import LoginView from '@/views/LoginView.vue';
import HomeView from '@/views/HomeView.vue';
import InternView from '@/views/InternView.vue';
import CreateAccount from '@/views/CreateAccount.vue';
import MentorHomeView from '@/views/MentorHomeView.vue';
import MentorProfileView from '@/views/MentorProfileView.vue';
import AdminView from '@/views/AdminView.vue';
import ReportView from '@/views/ReportView.vue';
import ProfileView from '@/views/ProfileView.vue';
import AssignmentList from '@/views/AssignmentList.vue';
import AssignmentForm from '@/views/AssignmentForm.vue';
import AssignmentTracking from '@/views/AssignmentTracking.vue';
import OfficeView from '@/views/OfficeView.vue';
import StaffView from '@/views/StaffView.vue';
import MentorAnnouncementForm from '@/views/MentorAnnouncementForm.vue';
import InternSupportView from '@/views/InternSupportView.vue';
import '@fortawesome/fontawesome-free/css/all.min.css';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    redirect: () =>
      msalApp.getActiveAccount() ? { name: 'Register' } : { name: 'Login' },
  },
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: { public: true },
  },
  {
    path: '/register',
    name: 'Register',
    component: RouterView,
    meta: { public: true },
    beforeEnter: async (
      to: RouteLocationNormalized,
      from: RouteLocationNormalized
    ) => {
      const account = msalApp.getActiveAccount();
      if (!account) {
        return { name: 'Login' };
      }
      const email = account.username;
      let title = '';
      try {
        title = (await fetchJobTitle()).toLowerCase();
      } catch {
        title = 'intern';
      }
      // if (title === 'mentor') title = 'mentor'; // TEST için zorla mentor akışı
      if (title.includes('intern')) {
        const { data: exists } = await api.get<boolean>('/api/interns/exists', {
          params: { email },
        });
        if (!exists) {
          return { name: 'RegisterIntern', query: { email } };
        }
        return { name: 'Home' };
      } else {
        const { data: exists } = await api.get<boolean>('/api/mentors/exists', {
          params: { email },
        });
        if (!exists) {
          const rawName = account.name ?? '';
          const cleanName = rawName.replace(/\s*\(.*\)$/, '');
          const parts = cleanName.split(' ').filter(p => p.trim() !== '');
          const fallbackLast = parts.length > 1 ? parts[parts.length - 1] : '';
          const fallbackFirst =
            parts.length > 1
              ? parts.slice(0, parts.length - 1).join(' ')
              : parts[0] ?? '';
          const claims = account.idTokenClaims as {
            given_name?: string;
            family_name?: string;
            mobile_phone?: string;
          };
          const firstName = claims.given_name ?? fallbackFirst;
          const lastName = claims.family_name ?? fallbackLast;
          await api.post('/api/mentors', {
            name: firstName,
            surname: lastName,
            email,
            phoneNumber: claims.mobile_phone ?? '',
          });
        }
        return { name: 'MentorHome' };
      }
    },
  },
  {
    path: '/register/intern',
    name: 'RegisterIntern',
    component: InternView,
    beforeEnter: async (to, from) => {
      const account = msalApp.getActiveAccount();
      if (!account) return { name: 'Login' };
      let title = '';
      try {
        title = (await fetchJobTitle()).toLowerCase();
      } catch {
        title = 'intern';
      }
      if (!title.includes('intern')) {
        return { name: 'Home' };
      }
      return true;
    },
  },
  {
    path: '/register/not-intern',
    name: 'NotIntern',
    component: CreateAccount,
    beforeEnter: async (to, from) => {
      const account = msalApp.getActiveAccount();
      if (!account) return { name: 'Login' };
      let title = '';
      try {
        title = (await fetchJobTitle()).toLowerCase();
      } catch {
        title = 'intern';
      }
      if (title.includes('intern')) {
        return { name: 'Home' };
      }
      return true;
    },
  },
  {
    path: '/home',
    name: 'Home',
    component: HomeView,
    children: [
      { path: '/report', name: 'Report', component: ReportView },
      { path: 'profile', name: 'Profile', component: ProfileView },
      {
        path: 'about',
        name: 'InternAbout',
        component: () => import('@/views/AboutView.vue'),
      },
      {
        path: '/assignmentlist',
        name: 'AssignmentList',
        component: AssignmentList,
      },
      { path: '/office', name: 'Office', component: OfficeView },
      { path: '/staff', name: 'Staff', component: StaffView },
    ],
  },
  {
    path: '/mentorhome',
    name: 'MentorHome',
    component: MentorHomeView,
    children: [
      {
        path: 'mentorprofile',
        name: 'MentorProfile',
        component: MentorProfileView,
      },
      {
        path: 'admin',
        name: 'Admin',
        component: AdminView,
        beforeEnter: () => {
          const account = msalApp.getActiveAccount();
          if (!account) return { name: 'Login' };
          const roles = (account.idTokenClaims as any)?.roles || [];
          if (!roles.includes('3')) return { name: 'MentorHome' };
          return true;
        },
      },
      {
        path: '/assignmentform',
        name: 'AssignmentForm',
        component: AssignmentForm,
      },
      {
        path: '/assignmenttracking',
        name: 'AssignmentTracking',
        component: AssignmentTracking,
      },
      {
        path: 'announcement',
        name: 'MentorAnnouncementForm',
        component: MentorAnnouncementForm,
      },
      {
        path: 'intern-support',
        name: 'InternSupport',
        component: InternSupportView,
      },
      {
        path: 'about',
        name: 'MentorAbout',
        component: () => import('@/views/AboutView.vue'),
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// GLOBAL GUARD — GÜNCEL VE DOĞRU HALİ
router.beforeEach(async (to, from) => {
  // 1) Public rotalar hep açık
  if ((to.meta as any).public) {
    return true;
  }

  // 2) Henüz login değilse Login’e
  const account = msalApp.getActiveAccount();
  if (!account) {
    return { name: 'Login' };
  }

  // 3) Login sayfasına gelen auth’lıyı Register akışına fırlat
  if (to.name === 'Login') {
    return { name: 'Register' };
  }

  // 4) Direkt /home veya /mentorhome URL bypass’ını engelle + CHILD ROUTES!
  const email = account.username;
  let title = '';
  try {
    title = (await fetchJobTitle()).toLowerCase();
  } catch {
    title = 'intern';
  }

  // Internlerin mentorhome ve altlarını görmesi engellenir
  if (to.path.startsWith('/mentorhome') && title.includes('intern')) {
    return { name: 'Home' };
  }
  // Mentor olmayanların home ve altlarını görmesi engellenir
  if (to.path.startsWith('/home') && !title.includes('intern')) {
    return { name: 'MentorHome' };
  }

  return true;
});

export default router;
