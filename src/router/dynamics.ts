import { type RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  // 首页
  {
    path: '/',
    name: 'Home',
    component: () => import('@/views/demo/demo.vue'),
    meta: { title: '首页' },
  },
  // 我的
  {
    path: '/my',
    name: 'My',
    component: () => import('@/views/my/my.vue'),
    meta: { title: '我的' },
  },
  // 修改密码
  {
    path: '/update_password',
    name: 'UpdatePassword',
    component: () => import('@/views/auth/updatePassword.vue'),
    meta: { title: '修改密码' },
  },
  // 404需要放最后
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/views/exception/404.vue'),
    meta: {
      title: '找不到页面',
    },
  },
];
export default routes;
