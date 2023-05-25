// 通用对象
export type ObjectType = Record<string, any>;
// 通用函数
export type FunctionType = (...args: any[]) => any;
// 数组元素
export type ArrayElement<T> = T extends Array<infer U> ? U : never;
