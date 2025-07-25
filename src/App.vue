<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue';
import AssignmentList from './views/AssignmentList.vue';
import AboutView from './views/AboutView.vue';
import LoginView from './views/LoginView.vue';
import HomeView from './views/HomeView.vue';
import AppSidebar from '@/components/AppSidebar.vue';
import MentorHomeView from '@/views/MentorHomeView.vue';
import OfficeView from '@/views/OfficeView.vue';
/*import TheWelcome from "./components/TheWelcome.vue";*/

import { ref, onMounted } from 'vue';

// A reactive variable to store the message from the backend
const backendMessage = ref('Loading...');

// Define the routes for the application  -- delete this later
const routes = [
  // { path: "/mentor-tracking", component: MentorTracker },
  // { path: "/downloads", component: Downloads },
];
</script>
<template>
  <router-view />
</template>

<style scoped>
html,
body,
#app {
  margin: 0;
  padding: 0;
  height: 100%;
}
</style>
