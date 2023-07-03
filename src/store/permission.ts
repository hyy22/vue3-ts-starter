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
  return routes.filter(route => {
    if (
      !route?.meta?.permission ||
      permissions.includes(route.meta.permission as string)
    ) {
      if (route.children) {
        route.children = filterAccessRoutes(route.children, permissions);
      }
      return true;
    }
    return false;
  });
}
