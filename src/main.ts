import { createApp } from 'vue';
import App from './App.vue';
import msalPlugin from './plugins/msal'; // kendi yazdığın msal plugin

const app = createApp(App);
app.use(msalPlugin);
app.mount('#app');
