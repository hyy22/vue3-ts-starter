import { defineStore } from 'pinia';

interface TabItem {
  name: string;
  path: string;
  title: string;
  keepAlive?: boolean;
}
interface StateStore {
  collapse: boolean;
  tabs: TabItem[];
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
      this.tabs.push(tab);
    },
    // 关闭标签
    closeTab(name: string, direction: '' | 'left' | 'right' = '') {
      const index = this.tabs.findIndex(v => v.name === name);
      if (index < 0) return;
      if (!direction) {
        this.tabs.splice(index, 1);
        return;
      }
      if (direction === 'left') {
        this.tabs.splice(0, index);
        return;
      }
      if (direction === 'right') {
        this.tabs.splice(index + 1);
        return;
      }
    },
    // 关闭全部标签
    closeAllTab() {
      this.tabs = [];
    },
  },
  persist: {
    paths: [],
  },
});
