import { defineStore } from 'pinia';
import { RouteRecordRaw } from 'vue-router';
import { dynamicRoutes } from '@/router';

interface PermissionStore {
  keys: string[];
  addRoutes: RouteRecordRaw[];
  hasGenerateRoutes: boolean;
}
export const usePermissionStore = defineStore('permission', {
  state: (): PermissionStore => ({
    keys: [], // 权限列表
    addRoutes: [], // 动态路由，可用来渲染菜单
    hasGenerateRoutes: false, // 是否已经生成路由，解决路由跳转无限循环
  }),
  persist: {
    paths: ['keys'],
  },
  getters: {
    // 第一个可访问路由
    firstRoute: state => {
      return getFirstRoute(dynamicRoutes, state.keys);
    },
  },
  actions: {
    hasPermission(k: string) {
      return this.keys.includes(k);
    },
    setPermission(val: string[]) {
      this.keys = val;
      // 每次权限变更都重新渲染菜单
      this.hasGenerateRoutes = false;
    },
    generateRoutes() {
      const addRoutes = filterAccessRoutes(dynamicRoutes, this.keys);
      this.addRoutes = addRoutes;
      return addRoutes;
    },
  },
});

// 根据权限获取动态路由
function filterAccessRoutes(
  routes: RouteRecordRaw[] = [],
  permissions: string[]
): RouteRecordRaw[] {
  const accessRoutes: RouteRecordRaw[] = [];
  for (const route of routes) {
    if (
      !route?.meta?.permission ||
      permissions.includes(route.meta.permission as string)
    ) {
      const newRoute: RouteRecordRaw = {
        ...route,
      };
      if (newRoute.children?.length) {
        newRoute.children = filterAccessRoutes(newRoute.children, permissions);
      }
      accessRoutes.push(newRoute);
    }
  }
  return accessRoutes;
}

// 获取动态路由第一项
function getFirstRoute(
  routes: RouteRecordRaw[],
  permissions: string[]
): RouteRecordRaw | undefined {
  for (const route of routes) {
    if (!route.children) {
      if (
        !route?.meta?.permission ||
        permissions.includes(route.meta.permission as string)
      ) {
        return route;
      }
    } else {
      const result = getFirstRoute(route.children, permissions);
      if (result) return result;
    }
  }
}
