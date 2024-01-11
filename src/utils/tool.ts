/**
 * 深拷贝
 * 不考虑循环引用
 * @param o
 * @returns
 */
export function deepCopy<T = any>(o: T): T {
  if (typeof o === 'object') {
    const result = (Array.isArray(o) ? [] : {}) as T;
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
 * @param fn 需要防抖的函数
 * @param delay 延迟ms
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
 * @param fn 被节流函数
 * @param delay 延迟ms
 * @returns
 */
export function throttle(fn: FunctionType, delay = 200) {
  let timer: number;
  return function (...args: any[]) {
    if (timer) return;
    timer = setTimeout(fn.bind(null, ...args), delay);
  };
}

/**
 * 等待
 * @param ms 等待时长
 * @returns
 */
export function sleep(ms: number) {
  return new Promise(res => setTimeout(res, ms));
}

/**
 * 从字符串中提取数字
 * @param str 目标字符串
 * @param n 保留个数
 * @param parse 是否解析int
 * @returns
 */
export function pickNumberFromString(
  str = '',
  n = 2,
  parse = false
): (number | string)[] {
  const trimStr = str.trim();
  if (!trimStr) return [];
  let result: (number | string)[];
  result = trimStr
    .split(/\D+/)
    .filter(v => v)
    .slice(0, n);
  if (parse) {
    result = result.map(v => parseInt(v as string, 10));
  }
  return result;
}

/**
 * 根据参数缓存函数结果
 * @param fn
 * @returns
 */
export function memo(fn: FunctionType) {
  const cache = Object.create(null);
  return async function (...args: any) {
    const key = JSON.stringify(args);
    if (cache[key]) return cache[key];
    cache[key] = await fn(...args);
    return cache[key];
  };
}
