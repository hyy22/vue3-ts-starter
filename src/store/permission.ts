import { defineStore } from 'pinia';
import { fetchUserMenuList } from '@/api/menu';
import { isResponseOk } from '@/api';
import { type RouteRecordRaw } from 'vue-router';

interface PermissionStore {
  // 权限列表
  keys: string[];
  // 动态路由
  addRoutes: RouteRecordRaw[];
}
export const usePermissionStore = defineStore('permission', {
  state: (): PermissionStore => ({
    keys: [],
    addRoutes: [],
  }),
  actions: {
    // 判断是否有权限，支持数组
    hasPermission(k: string | string[]) {
      // 如果是数组，需要满足同时存在
      if (Array.isArray(k)) return k.every(item => this.keys.includes(item));
      return this.keys.includes(k);
    },
    // 获取权限
    async getPermissions() {
      const resp = await fetchUserMenuList();
      if (!isResponseOk(resp)) throw new Error(resp.msg);
      const permissionList = resp.data;
      // TODO:保存权限
      this.keys = permissionList.map(v => v.title);
      return permissionList;
    },
    // 过滤权限
    filterAccessRoutes(routes: RouteRecordRaw[]) {
      const accessRoutes: RouteRecordRaw[] = [];
      for (const item of routes) {
        if (
          !item.meta?.permission ||
          this.hasPermission(item.meta?.permission)
        ) {
          const newRoute: RouteRecordRaw = {
            ...item,
          };
          if (newRoute.children?.length) {
            newRoute.children = this.filterAccessRoutes(newRoute.children);
          }
          accessRoutes.push(newRoute);
        }
      }
      return accessRoutes;
    },
  },
});
