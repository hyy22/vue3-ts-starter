import { defineStore } from 'pinia';
import { RouteRecordRaw } from 'vue-router';
import { dynamicRoutes } from '@/router';

interface PermissionStore {
  keys: string[];
  addRoutes: RouteRecordRaw[];
}
export const usePermissionStore = defineStore('permission', {
  state: (): PermissionStore => ({
    keys: [], // 权限列表
    addRoutes: [], // 动态路由
  }),
  persist: {
    paths: ['keys'],
  },
  actions: {
    hasPermission(k: string) {
      return this.keys.includes(k);
    },
    setPermission(val: string[]) {
      this.keys = val;
      // 每次权限变更都重新渲染菜单
      this.addRoutes = [];
    },
    generateRoutes() {
      const addRoutes = filterAccessRoutes(dynamicRoutes, this.keys);
      this.addRoutes = addRoutes;
      return addRoutes;
    },
    getFirstRoute() {
      return getFirstRoute(dynamicRoutes, this.keys);
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
