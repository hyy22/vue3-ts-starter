/**
 * 动态路由管理
 */
// 移除动态路由的方法集合
const removeRouteFns: FunctionType[] = [];

// 添加移除方法
export function addRemoveRouteFn(fn: FunctionType) {
  removeRouteFns.push(fn);
}

// 移除所有动态添加的路由
export function removeAddRoutes() {
  let fn: FunctionType | undefined;
  while (typeof (fn = removeRouteFns.shift()) === 'function') {
    fn();
  }
}
