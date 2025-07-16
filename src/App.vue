<script setup lang="ts">
import HelloWorld from './components/HelloWorld.vue';
import AssignmentList from './views/AssignmentList.vue';
import AboutView from './views/AboutView.vue';
import LoginView from './views/LoginView.vue';
import HomeView from './views/HomeView.vue';
import AppSidebar from '@/components/AppSidebar.vue';
/*import TheWelcome from "./components/TheWelcome.vue";*/

import { ref, onMounted } from 'vue';
import axios from 'axios';

// A reactive variable to store the message from the backend
const backendMessage = ref('Loading...');

// Define the routes for the application  -- delete this later
const routes = [
  // { path: "/mentor-tracking", component: MentorTracker },
  // { path: "/downloads", component: Downloads },
];

// This runs after the component is ready
onMounted(async () => {
  try {
    // Call your Java backend's endpoint
    const response = await axios.get(
      'http://localhost:8080/api/mentors/api/greeting'
    );
    backendMessage.value = response.data.message; // Update the variable
  } catch (error) {
    backendMessage.value = 'Failed to connect to backend.';
    console.error(error);
  }
});
</script>
<template>
  <router-view />
</template>

<style scoped>
/* İstersen global stil buraya yazabilirsin */
</style>
