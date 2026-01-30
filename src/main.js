// Import createApp from Vue
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

// Create a Vue app instance
const app = createApp(App);

// Use the router
app.use(router);

// Mount the app to the DOM
app.mount('#app');