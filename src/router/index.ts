import * as NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router';
import { useUserStore } from '@/store/user';
import { usePermissionStore } from '@/store/permission';
import demo from '@/router/demo';

const Layout = () => import('@/components/Layouts/Layout.vue');
const Login = () => import('@/views/auth/login.vue');
const Forbidden = () => import('@/views/exception/403.vue');
const NotFound = () => import('@/views/exception/404.vue');
/**
 * 获取第一个可跳转路由
 * @param routes
 * @returns
 */
function getFirstRoute(routes: RouteRecordRaw[]): RouteRecordRaw | undefined {
  for (const route of routes) {
    if (!route.children) return route;
    if (!route.children.length) continue;
    return getFirstRoute(route.children);
  }
}
/**
 * 静态路由
 */
const staticRoutes: RouteRecordRaw[] = [
  { path: '/login', name: 'Login', component: Login },
  { path: '/403', name: '403', component: Forbidden },
];
/**
 * 动态路由
 */
export const dynamicRoutes: RouteRecordRaw[] = [...demo];
// 创建路由实例
const router = createRouter({
  history: createWebHistory(), // 设置history模式
  routes: [...staticRoutes],
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0 };
    }
  },
});
// 路由白名单
const whiteList = ['/login', '/403'];
// 配置进度条
NProgress.configure({ showSpinner: false });
// 路由全局解析守卫
router.beforeEach((to, _from, next) => {
  NProgress.start();
  document.title = `${to.meta.title ? to.meta.title + ' | ' : ''}${
    import.meta.env.VITE_APP_NAME
  }`;
  const userStore = useUserStore();
  const permissionStore = usePermissionStore();
  // 已登录
  if (userStore.token) {
    const permissions = permissionStore.keys;
    // 没有权限
    if (!permissions.length) {
      next({ name: '403', replace: true });
    }
    // 有权限
    else {
      // 没生成菜单
      if (!permissionStore.addRoutes.length) {
        const addRoutes = permissionStore.generateRoutes();
        // 添加Home路由
        const homeRoute: RouteRecordRaw = {
          path: '/',
          name: 'Home',
          redirect: getFirstRoute(addRoutes),
          component: Layout,
          children: addRoutes,
        };
        router.addRoute(homeRoute);
        // 最后添加404页面
        router.addRoute({
          path: '/:pathMatch(.*)*',
          name: 'NotFound',
          meta: {
            title: '找不到页面',
            hidden: true,
          },
          component: NotFound,
        });
        // addRoute后需要手动触发一次
        next({ ...to, replace: true });
      }
      // 已生成过菜单
      else {
        next();
      }
    }
  }
  // 未登录
  else {
    if (whiteList.includes(to.path)) {
      next();
    } else {
      next({ name: 'Login', query: { from: to.path }, replace: true });
    }
  }
});
router.afterEach(() => {
  NProgress.done();
});
router.onError(() => {
  NProgress.done();
});

export default router;
