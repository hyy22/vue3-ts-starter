import { defineStore } from 'pinia';
import { fetchUserMenuList } from '@/api/menu';
import { isResponseOk } from '@/api';
import { type RouteRecordRaw } from 'vue-router';
import { deepCopy } from '@/utils/tool';

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
  getters: {
    keepAliveRoutes: state =>
      state.addRoutes
        .filter(item => item.meta?.keepAlive)
        .map(item => item.name as string),
  },
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
      const addRoutes = filterRoutes(
        routes,
        // 只筛选有权限的路由
        row =>
          !row.meta?.permission || this.hasPermission(row.meta?.permission),
        // 如果组件需要缓存，需要对路由进行改造
        row => {
          if (row.meta?.keepAlive) {
            return {
              ...row,
              ...(row.component
                ? {
                    component:
                      typeof row.component === 'function'
                        ? () =>
                            (row.component as () => Promise<any>)().then(m => ({
                              name: row.name,
                              ...m.default,
                            }))
                        : row.component,
                  }
                : {}),
            } as RouteRecordRaw;
          } else {
            return row;
          }
        }
      );
      this.addRoutes = addRoutes;
      return addRoutes;
    },
  },
});
// 筛选路由
function filterRoutes(
  routes: RouteRecordRaw[],
  rule: (row: RouteRecordRaw) => boolean,
  reducer: (row: RouteRecordRaw) => RouteRecordRaw
): RouteRecordRaw[] {
  const result: RouteRecordRaw[] = [];
  for (const route of routes) {
    if (rule(route)) {
      const newRoute =
        typeof reducer === 'function'
          ? reducer(deepCopy(route))
          : deepCopy(route);
      if (newRoute.children?.length) {
        newRoute.children = filterRoutes(newRoute.children, rule, reducer);
      }
      result.push(newRoute);
    }
  }
  return result;
}
