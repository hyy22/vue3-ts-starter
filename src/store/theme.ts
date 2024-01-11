import themes, { type ThemeConfig, ThemeEnum } from '@/config/theme';
import { defineStore } from 'pinia';

interface ThemeState {
  // 当前主题名称
  current: ThemeEnum;
}
export const useThemeStore = defineStore('theme', {
  state: (): ThemeState => ({
    current: ThemeEnum.default,
  }),
  getters: {
    // 主题配置
    themeConfig(): ThemeConfig {
      return themes.find(item => item.name === this.current) ?? themes[0];
    },
  },
  actions: {
    // 修改主题
    setTheme(theme: ThemeEnum) {
      this.current = theme;
    },
  },
  persist: true,
});
