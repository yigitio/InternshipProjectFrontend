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
import '@fortawesome/fontawesome-free/css/all.min.css';

const routes: RouteRecordRaw[] = [
  // kök → Login yoksa Login, varsa Register akışına
  {
    path: '/',
    redirect: () =>
      msalApp.getActiveAccount() ? { name: 'Register' } : { name: 'Login' },
  },

  // — Public sayfalar —
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

      // Tek declare
      let title = '';
      // Normal akış: Graph API’den çek
      try {
        title = (await fetchJobTitle()).toLowerCase();
      } catch {
        title = 'intern'; // fallback
      }

      // — TEST için zorla mentor akışını görmek istersen uncomment et:
      //title = 'mentor';

      if (title.includes('intern')) {
        // İntern adayı → DB sorgula
        const { data: exists } = await api.get<boolean>('/interns/exists', {
          params: { email },
        });
        if (!exists) {
          // kayıt yoksa form
          return { name: 'RegisterIntern', query: { email } };
        }
        // kayıtlı intern → Home
        return { name: 'Home' };
      } else {
        // Mentor adayı → DB sorgula
        const { data: exists } = await api.get<boolean>('/mentors/exists', {
          params: { email },
        });
        if (!exists) {
          // 1) Parantez içi ibareleri at
          const rawName = account.name ?? '';
          const cleanName = rawName.replace(/\s*\(.*\)$/, '');

          // 2) Boşluklardan böl, boş string’leri çıkar
          const parts = cleanName.split(' ').filter(p => p.trim() !== '');

          // 3) Fallback olarak: sonudur = son parça, isim = gerisi
          const fallbackLast = parts.length > 1 ? parts[parts.length - 1] : '';
          const fallbackFirst =
            parts.length > 1
              ? parts.slice(0, parts.length - 1).join(' ')
              : parts[0] ?? '';

          // 4) Önce token claim’lerinden dene, yoksa fallback
          const claims = account.idTokenClaims as {
            given_name?: string;
            family_name?: string;
            mobile_phone?: string;
          };
          const firstName = claims.given_name ?? fallbackFirst;
          const lastName = claims.family_name ?? fallbackLast;

          // 5) Mentor kaydını oluştur
          await api.post('/mentors', {
            name: firstName,
            surname: lastName,
            email,
            phoneNumber: claims.mobile_phone ?? '',
          });
        }
        // mentor dashboard’a
        return { name: 'MentorHome' };
      }
    },
  },

  // — Kayıt form sayfaları (artık public değil) —
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
      // TEST için:
      //title = 'mentor';

      if (!title.includes('intern')) {
        // mentor formu göremez
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
      // TEST için:
      //title = 'mentor';

      if (title.includes('intern')) {
        // internler NotIntern formunu göremez
        return { name: 'Home' };
      }
      return true;
    },
  },

  // — Dashboards —
  {
    path: '/home',
    name: 'Home',
    component: HomeView,
    children: [
      { path: '/report', name: 'Report', component: ReportView },
      { path: 'profile', name: 'Profile', component: ProfileView },
      {
        path: '/assignmentlist',
        name: 'AssignmentList',
        component: AssignmentList,
      },
      { path: '/office', name: 'Office', component: OfficeView },
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
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// global guard: public’ı atla, değilse login+register+dash koruması
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

  // 4) Direkt /home veya /mentorhome URL bypass’ını engelle
  const email = account.username;
  let title = '';
  try {
    title = (await fetchJobTitle()).toLowerCase();
  } catch {
    title = 'intern';
  }

  // TEST için zorla mentor branch’ine girmek istersen uncomment et:
  //title = 'mentor';

  if (to.name === 'Home' && !title.includes('intern')) {
    return { name: 'MentorHome' };
  }
  if (to.name === 'MentorHome' && title.includes('intern')) {
    return { name: 'Home' };
  }

  return true;
});

export default router;
