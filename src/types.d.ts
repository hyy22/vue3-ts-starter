// 全局
declare global {}
// 通用对象
type ObjectType = Record<string, any>;
// 通用函数
type FunctionType = (...args: any[]) => any;
// 数组元素
type ArrayElement<T> = T extends Array<infer U> ? U : never;
