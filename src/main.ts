import { createApp } from 'vue';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import * as directives from './directives';
import '@/styles/index.css';
import App from './App.vue';
import router from './router';
import store from './store';

// 实例
const app = createApp(App);
// 注册elementplus图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
// 自定义权限指令
for (const [key, directive] of Object.entries(directives)) {
  app.directive(key, directive);
}
app.use(router).use(store).mount('#app');
