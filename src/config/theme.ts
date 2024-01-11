export interface ThemeConfig {
  // 名称
  name: string;
  // 主题色
  primaryColor: string;
  // 反转色
  reverseColor?: string;
  // 背景色
  bgColor?: string;
  // 主要文字颜色
  textColor?: string;
  // 常规文字颜色
  baseTextColor?: string;
  // 次要文字
  secondaryTextColor?: string;
  // 辅助说明
  extraTextColor?: string;
}
export enum ThemeEnum {
  // 默认主题
  default = 'default',
}
// 默认主题
const defaultTheme: ThemeConfig = {
  name: ThemeEnum.default,
  primaryColor: '#facd00',
  reverseColor: '#fff',
  bgColor: '#f7f7f7',
  textColor: '#333',
  baseTextColor: '#666',
  secondaryTextColor: '#909090',
  extraTextColor: '#c7c7c7',
};
const themes: ThemeConfig[] = [defaultTheme];
export default themes;
