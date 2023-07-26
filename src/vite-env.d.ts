/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_APP_NAME: string;
  readonly VITE_API_BASE_URL: string;
  readonly VITE_API_TIME_OUT: number;
  readonly VITE_MAX_TAB_COUNT: number;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
// 定义模块
declare module 'element-plus/dist/locale/zh-cn.mjs';
import 'vue-router';
declare module 'vue-router' {
  interface RouteMeta {
    title?: string;
    permission?: string;
    icon?: string;
    hidden?: boolean;
  }
}
