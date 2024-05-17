export interface LayoutProps {
  // 是否可选
  selectable: 'single' | 'multiple' | false;
}
export interface LayoutExpose {
  // 获取选择项
  getCheckedItems?: () => any[];
}
