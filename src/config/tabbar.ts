export interface TabbarConfig<T extends string> {
  // 名称
  name: T;
  // 标签
  label: string;
  // 图标
  icon?: string;
  // 图标前缀
  iconPrefix?: string;
  // 页面路径
  path: string;
  // 权限
  permission?: string;
}
const tabbars: TabbarConfig<'home' | 'my'>[] = [
  {
    name: 'home',
    label: '首页',
    icon: 'home-o',
    path: '/',
  },
  {
    name: 'my',
    label: '我的',
    icon: 'user-o',
    path: '/my',
  },
];
export default tabbars;
