import { createRouter, createWebHistory } from 'vue-router';
import staticRoutes from './statics';
import dynamicRoutes from './dynamics';
import { useUserStore } from '@/store/user';
import { usePermissionStore } from '@/store/permission';
import { addRemoveRouteFn, removeAddRoutes } from './routes';
import { showToast } from 'vant';

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
/**
 * 路由全局解析守卫
 */
// 白名单页面
const whiteList = staticRoutes.map(v => v.path);
router.beforeEach(async (to, _, next) => {
  if (to.meta.title) {
    document.title = to.meta.title;
  }
  // 白名单直接放行
  if (whiteList.includes(to.path)) {
    next();
  }
  // 权限校验
  else {
    const userStore = useUserStore();
    const permissionStore = usePermissionStore();
    // 已登录
    if (userStore.token) {
      const permissions = permissionStore.keys;
      // 没有权限，动态拉取
      if (!permissions.length) {
        try {
          // 删除之前路由
          removeAddRoutes();
          const permissionItems = await permissionStore.getPermissions();
          // 没有权限进入403
          if (!permissionItems.length) {
            next({ name: '403', replace: true });
          } else {
            const addRoutes = permissionStore.filterAccessRoutes(dynamicRoutes);
            addRoutes.forEach(item => {
              addRemoveRouteFn(router.addRoute(item));
            });
            // addRoute后需要手动触发一次
            next({ ...to, replace: true });
          }
        } catch (e: any) {
          // 有错误，退出重新登录
          // 这里和http响应拦截有逻辑重叠，会导致重复跳转，请根据需要判断是否需要排除
          userStore.logout(false);
          showToast(e?.message ?? e ?? 'has error');
          next({ name: 'Login', query: { from: to.fullPath }, replace: true });
        }
      } else {
        next();
      }
    }
    // 未登录
    else {
      next({ name: 'Login', query: { from: to.path }, replace: true });
    }
  }
});
export default router;
