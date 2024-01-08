import * as NProgress from 'nprogress';
import 'nprogress/nprogress.css';
import {
  type RouteRecordRaw,
  createRouter,
  createWebHistory,
} from 'vue-router';
import { useUserStore } from '@/store/user';
import { usePermissionStore } from '@/store/permission';
import setting from './setting';
import { addRemoveRouteFn, removeAddRoutes } from './routes';

const Login = () => import('@/views/auth/login.vue');
const Forbidden = () => import('@/views/exception/403.vue');
const NotFound = () => import('@/views/exception/404.vue');
const Layout = () => import('@/layouts/index.vue');
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
const whiteList = ['/login', '/403'];
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
      // 没生成菜单
      if (!permissionStore.hasGenerateRoutes) {
        // 删除之前路由
        removeAddRoutes();
        const addRoutes = permissionStore.generateRoutes();
        const firstRoute = permissionStore.firstRoute;
        const homeRoute: RouteRecordRaw = {
          path: '/',
          name: 'Home',
          component: Layout,
          redirect: firstRoute,
          children: [...addRoutes],
        };
        addRemoveRouteFn(router.addRoute(homeRoute));
        // 最后添加404页面
        addRemoveRouteFn(
          router.addRoute({
            path: '/:pathMatch(.*)*',
            name: 'NotFound',
            meta: {
              title: '找不到页面',
              hidden: true,
            },
            component: NotFound,
          })
        );
        // 如果没有可访问路由就跳转403
        if (!firstRoute) {
          next({ name: '403', replace: true });
        }
        // 否则就直接放行
        else {
          next({ ...to, replace: true });
        }
        // 更新路由添加状态
        permissionStore.hasGenerateRoutes = true;
      }
      // 已生成过菜单
      else {
        next();
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
