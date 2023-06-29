import { createApp } from 'vue';
import '@/styles/index.css';
import App from './App.vue';
import router from './router';
import store from './store';

// 实例
const app = createApp(App);
app.use(router).use(store).mount('#app');
