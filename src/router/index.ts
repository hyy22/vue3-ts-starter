import { RouteRecordRaw, createRouter } from 'vue-router';
import { createWebHistory } from 'vue-router';

/**
 * TODO:静态路由
 */
const staticRoutes: RouteRecordRaw[] = [
  { path: '/demo', component: () => import('@/views/demo/demo.vue') },
];
const router = createRouter({
  // 设置history模式
  history: createWebHistory(),
  routes: [...staticRoutes],
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});
// 路由全局解析守卫
// router.beforeResolve((to, from, next) => {});
// 路由跳转后置守卫
// router.afterEach((_to, _from, failure) => {
//   console.log('router done');
//   console.log('failure', failure);
// });
// // 路由错误处理
// router.onError(error => {
//   console.log('router error:', error);
// });

export default router;
