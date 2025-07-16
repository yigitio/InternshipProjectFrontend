import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

import AboutView from '../views/AboutView.vue';
import LoginView from '../views/LoginView.vue';
import AssignmentList from '../views/AssignmentList.vue';
import AssignmentForm from '../views/AssignmentForm.vue';
import HomeView from '../views/HomeView.vue';
import ProgramsView from '../views/ProgramsView.vue';
import ReportView from '../views/ReportView.vue';
import GoalsView from '../views/GoalsView.vue';
import InternView from '../views/InternView.vue';
import MentorView from '../views/MentorView.vue';
import OfficeView from '../views/OfficeView.vue';
import StaffView from '../views/StaffView.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/about',
    name: 'about',
    component: AboutView,
  },
  {
    path: '/',
    name: 'login',
    component: LoginView,
  },
  {
    path: '/home',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/assignmentlist',
    name: 'assignmentlist',
    component: AssignmentList,
  },
  {
    path: '/assignment/new',
    name: 'AssignmentForm',
    component: AssignmentForm,
  },
  {
    path: '/programs',
    name: 'programs',
    component: ProgramsView,
  },
  {
    path: '/report',
    name: 'report',
    component: ReportView,
  },
  {
    path: '/goals',
    name: 'goals',
    component: GoalsView,
  },
  {
    path: '/office',
    name: 'office',
    component: OfficeView,
  },
  {
    path: '/staff',
    name: 'staff',
    component: StaffView,
  },
  {
    path: '/intern',
    name: 'intern',
    component: InternView,
  },
  {
    path: '/mentor',
    name: 'mentor',
    component: MentorView,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;
