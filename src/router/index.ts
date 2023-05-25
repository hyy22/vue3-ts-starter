import { RouteRecordRaw, createRouter } from 'vue-router';
import { createWebHistory } from 'vue-router';

const demo = () => import('@/views/demo/demo.vue');
/**
 * TODO:静态路由
 */
const staticRoutes: RouteRecordRaw[] = [{ path: '/demo', component: demo }];
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
// 路由执行后
router.afterEach((_to, _from, failure) => {
  console.log('router done');
  console.log('failure', failure);
});
// 错误处理
router.onError(error => {
  console.log('router error:', error);
});

export default router;
