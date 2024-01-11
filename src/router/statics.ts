import { type RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  // 登录
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/auth/login.vue'),
    meta: {
      title: '登录',
    },
  },
  // 403
  {
    path: '/403',
    name: '403',
    component: () => import('@/views/exception/403.vue'),
    meta: {
      title: '没有权限',
    },
  },
];
export default routes;
