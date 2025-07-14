<script setup lang="ts">
import HelloWorld from "./components/HelloWorld.vue";
import AssignmentList from "./views/AssignmentList.vue";
/*import TheWelcome from "./components/TheWelcome.vue";*/

import { ref, onMounted } from "vue";
import axios from "axios";

// A reactive variable to store the message from the backend
const backendMessage = ref("Loading...");

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
      "http://localhost:8080/api/mentors/api/greeting"
    );
    backendMessage.value = response.data.message; // Update the variable
  } catch (error) {
    backendMessage.value = "Failed to connect to backend.";
    console.error(error);
  }
});
</script>

<template>
  <div>
    <h1>Vue.js Frontend</h1>
    <p>{{ backendMessage }}</p>
  </div>
  <div>
    <h1>Vue.js Frontend</h1>
    <p>{{ backendMessage }}</p>
  </div>

  <header>
    <img
      alt="Vue logo"
      class="logo"
      src="./assets/logo.png"
      width="125"
      height="125"
    />

    <div class="wrapper">
      <HelloWorld msg="You did it!" />
    </div>
  </header>

  <main>
    <TheWelcome />
  </main>
</template>

<style scoped>
header {
  line-height: 1.5;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
