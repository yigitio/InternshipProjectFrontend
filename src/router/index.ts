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
import MentorProfileView from '@/views/MentorProfileView.vue';

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
        path: 'mentorprofile',
        name: 'MentorProfile',
        component: MentorProfileView,
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
        title = 'mentor';
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
        if (exists) {
          return { name: 'MentorHome' };
        } else {
          // --- BURADAN İTİBAREN EKLEDİĞİMİZ OTO KAYIT KODU ---
          try {
            const displayName = account.name || '';
            const cleanedDisplayName = displayName.split('(')[0].trim();
            const nameParts = cleanedDisplayName.split(' ').filter(Boolean);
            let firstNames = '';
            let lastName = '';
            if (nameParts.length === 1) {
              // Tek kelimeyse hem ad hem soyad aynı
              firstNames = nameParts[0];
              lastName = nameParts[0];
            } else if (nameParts.length === 2) {
              // İki kelimeyse ilki ad, ikincisi soyad
              firstNames = nameParts[0];
              lastName = nameParts[1];
            } else {
              // Üç veya daha fazla kelimeyse, son kelime soyad
              lastName = nameParts[nameParts.length - 1];
              firstNames = nameParts.slice(0, -1).join(' ');
            }
            await api.post('/mentors', {
              name: firstNames,
              surname: lastName,
              email: email,
              phoneNumber: '', // Azure'dan alınamıyor, boş gönderiyoruz
            });
            console.log('Mentor otomatik olarak kaydedildi:', email);
          } catch (err) {
            console.error('Mentor otomatik kaydı başarısız:', err);
            // İstersen kullanıcıya uyarı gösterebilirsin
          }
          // Kayıttan sonra mentorhome'a yönlendir!
          return { name: 'MentorHome' };
        }
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
  const account = msalApp.getActiveAccount();
  const isAuth = !!account;
  // ID Token’da “roles” array’i var ve mentor rolü “2” ile geliyor
  const roles = ((account?.idTokenClaims as any)?.roles as string[]) || [];

  // 1) Eğer henüz login olunmadıysa her rota Login’e
  if (!isAuth && to.name !== 'Login') {
    return { name: 'Login' };
  }

  // 2) Login sayfasına erişmeye çalışan login’li kullanıcıyı
  //    rolüne göre ilgili ana sayfaya (dashboard) yolla
  if (to.name === 'Login' && isAuth) {
    // ▶️ MentorHome’a, değilse normal Home’a
    return roles.includes('2') ? { name: 'MentorHome' } : { name: 'Home' };
  }

  // 3) Mentor rolündeyken yanlışlıkla /home’a gidilmişse de
  //    otomatik olarak MentorHome’a at
  if (to.name === 'Home' && roles.includes('2')) {
    return { name: 'MentorHome' };
  }
});

export default router;
