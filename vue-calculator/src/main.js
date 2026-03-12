import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import authService from './utils/authService';

const app = createApp(App);

app.use(createPinia());
app.use(router);

authService.setupAxiosInterceptors(router);

app.mount('#app');