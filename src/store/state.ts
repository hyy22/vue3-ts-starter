import { defineStore } from 'pinia';

export interface TabItem {
  name: string;
  path: string;
  title: string;
  keepAlive?: boolean;
}
interface StateStore {
  collapse: boolean;
  tabs: TabItem[];
}
export enum CloseTarget {
  CURRENT = '',
  LEFT = 'left',
  RIGHT = 'right',
  OTHER = 'other',
  ALL = 'all',
}
export const useStateStore = defineStore('state', {
  state: (): StateStore => ({
    collapse: false, // 是否关闭侧边栏
    tabs: [], // 标签列表
  }),
  getters: {
    // 缓存标签
    keepAliveTabs: state =>
      state.tabs.filter(v => v.keepAlive).map(v => v.name),
  },
  actions: {
    // 添加标签
    addTab(tab: TabItem) {
      if (this.tabs.some(v => v.path === tab.path)) return;
      if (this.tabs.length >= import.meta.env.VITE_MAX_TAB_COUNT) {
        this.tabs.shift();
      }
      this.tabs.push(tab);
    },
    // 关闭标签
    closeTab(index: number, target: CloseTarget = CloseTarget.CURRENT) {
      const deleteTab = this.tabs[index];
      if (!deleteTab) return;
      switch (target) {
        case CloseTarget.CURRENT:
          this.tabs.splice(index, 1);
          break;
        case CloseTarget.LEFT:
          this.tabs.splice(0, index);
          break;
        case CloseTarget.RIGHT:
          this.tabs.splice(index + 1);
          break;
        case CloseTarget.OTHER:
          this.tabs = [deleteTab];
          break;
        case CloseTarget.ALL:
          this.tabs = [];
          break;
        default:
          break;
      }
    },
  },
  persist: {
    paths: ['tabs'],
  },
});