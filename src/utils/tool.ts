/**
 * 深拷贝
 * 不考虑循环引用
 * @param o
 * @returns
 */
export function deepCopy(o: any): any {
  if (typeof o === 'object') {
    const result: ObjectType = Array.isArray(o) ? [] : {};
    for (const key in o) {
      if (Object.hasOwn(o, key)) {
        result[key] = deepCopy(o[key]);
      }
    }
    return result;
  } else {
    return o;
  }
}

/**
 * 展开数组
 * @param o 数组
 * @returns
 */
export function flatArray(o: any[]): any[] {
  return o.reduce(
    (prev, cur) =>
      !Array.isArray(cur) ? prev.concat([cur]) : prev.concat(flatArray(cur)),
    []
  );
}

/**
 * 设置样式
 * @param elem 元素
 * @param setting 样式
 */
export function applyElementStyleSetting(
  elem: HTMLElement,
  setting: Partial<CSSStyleDeclaration>
) {
  for (const key in setting) {
    if (Object.hasOwn(setting, key)) {
      elem.style[key] = setting[key] as string;
    }
  }
}

/**
 * 防抖函数，支持参数传递
 * @param {Function} fn 需要防抖的函数
 * @param {Number} delay 延迟ms
 * @returns
 */
export function debounce(fn: FunctionType, delay = 200) {
  let timer: number;
  return function (...args: any[]) {
    clearTimeout(timer);
    timer = setTimeout(fn.bind(null, ...args), delay);
  };
}

/**
 * 节流，支持参数
 * @param {Function} fn 被节流函数
 * @param {Number} delay 延迟ms
 * @returns
 */
export function throttle(fn: FunctionType, delay = 200) {
  let timer: number;
  return function (...args: any[]) {
    if (timer) return;
    timer = setTimeout(fn.bind(null, ...args), delay);
  };
}
