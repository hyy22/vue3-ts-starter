import { defineStore } from 'pinia';
import { RouteRecordRaw } from 'vue-router';
import { dynamicRoutes } from '@/router';
import { deepCopy } from '@/utils/tool';

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
      return getFirstRoute(state.addRoutes);
    },
  },
  actions: {
    // 判断是否有权限，支持数组
    hasPermission(k: string | string[]) {
      // 如果是数组，需要满足同时存在
      if (Array.isArray(k)) return k.every(item => this.keys.includes(item));
      return this.keys.includes(k);
    },
    setPermission(val: string[]) {
      this.keys = val;
      // 每次权限变更都重新渲染菜单
      this.hasGenerateRoutes = false;
    },
    generateRoutes() {
      const addRoutes = filterRoutes(
        dynamicRoutes,
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

// 获取动态路由第一项
function getFirstRoute(routes: RouteRecordRaw[]): RouteRecordRaw | undefined {
  for (const route of routes) {
    if (route.meta?.hidden) continue;
    if (!route.children) {
      return route;
    } else {
      const result = getFirstRoute(route.children);
      if (result) return result;
    }
  }
}
