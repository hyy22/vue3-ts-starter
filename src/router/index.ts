import * as NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import { RouteRecordRaw, createRouter } from 'vue-router';
import { createWebHistory } from 'vue-router';
import { useUserStore } from '@/store/user';
import { usePermissionStore } from '@/store/permission';
import setting from './setting';

const Login = () => import('@/views/auth/login.vue');
const Forbidden = () => import('@/views/exception/403.vue');
const NotFound = () => import('@/views/exception/404.vue');
const Layout = () => import('@/layouts/index.vue');
const Landing = () => import('@/views/landing.vue');
/**
 * 静态路由
 */
const staticRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { title: '登录', hidden: true },
  },
  {
    path: '/403',
    name: '403',
    component: Forbidden,
    meta: { title: '没有权限', hidden: true },
  },
  {
    path: '/landing',
    name: 'Landing',
    component: Landing,
    meta: { title: '加载中', hidden: true },
  },
];
/**
 * 动态路由
 */
export const dynamicRoutes: RouteRecordRaw[] = [...setting];
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
const whiteList = ['/login', '/404', '/403'];
// 动态路由缓存
const removeRouteFns: FunctionType[] = [];
// 移除所有动态路由
function removeAllAddRoutes() {
  for (;;) {
    const fn = removeRouteFns.shift();
    if (!fn) return;
    fn();
  }
}
// 配置进度条
NProgress.configure({ showSpinner: false });
// 路由全局解析守卫
router.beforeEach((to, _from, next) => {
  NProgress.start();
  document.title = `${to.meta.title ? to.meta.title + ' | ' : ''}${
    import.meta.env.VITE_APP_NAME
  }`;
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
      // 没有权限
      if (!permissions.length) {
        next({ name: '403' });
      }
      // 有权限
      else {
        // 没生成菜单
        if (!permissionStore.addRoutes.length) {
          // 删除之前路由
          removeAllAddRoutes();
          const addRoutes = permissionStore.generateRoutes();
          const homeRoute: RouteRecordRaw = {
            path: '/',
            name: 'Home',
            component: Layout,
            redirect: '/landing',
            children: [...addRoutes],
          };
          const rmHome = router.addRoute(homeRoute);
          removeRouteFns.push(rmHome);
          // 最后添加404页面
          const rm404 = router.addRoute({
            path: '/:pathMatch(.*)*',
            name: 'NotFound',
            meta: {
              title: '找不到页面',
              hidden: true,
            },
            component: NotFound,
          });
          removeRouteFns.push(rm404);
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
