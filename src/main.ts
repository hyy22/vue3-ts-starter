import { createApp } from 'vue';
import 'vant/es/toast/style';
import 'vant/es/dialog/style';
import 'vant/es/notify/style';
import 'vant/es/image-preview/style';
// import '@/assets/iconfont/iconfont.css';
import './style.css';
import App from './App.vue';
import router from './router';
import store from './store';
import * as components from '@/components';
import * as directives from './directives';
// 适配桌面事件
import '@vant/touch-emulator';

// 实例
const app = createApp(App);
// 注册全局组件
for (const [key, comp] of Object.entries(components)) {
  app.component(key, comp);
}
// 自定义权限指令
for (const [key, directive] of Object.entries(directives)) {
  app.directive(key, directive);
}
app.use(router).use(store).mount('#app');
