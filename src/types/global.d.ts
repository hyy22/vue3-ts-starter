// 通用对象
type ObjectType = Record<string, any>;
// 通用函数
type FunctionType = (...args: any[]) => any;
// 数组元素
type ArrayElement<T> = T extends Array<infer U> ? U : never;
// 对象值类型
type ValueOf<T> = T[keyof T];
// 分页
interface PageType {
  current: number;
  pageSize: number;
  total?: number;
}
