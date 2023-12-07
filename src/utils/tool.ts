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
 * 图片压缩
 * @param param0 配置
 * @returns
 */
interface ImgOptimizateOptions {
  img: File;
  size?: number;
  quality?: number;
}
export function imgOptimizate({
  img,
  size,
  quality = 0.9,
}: ImgOptimizateOptions): Promise<File> {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.addEventListener('load', e => {
      const result = e.target!.result as string;
      const image = new Image();
      image.addEventListener('load', () => {
        const { width: originalWidth, height: originalHeight } = image;
        if (!size || originalWidth <= size) {
          // return resolve(img);
          size = originalWidth;
        }
        let canvas = document.createElement('canvas');
        const targetWidth = size;
        const targetHeight = (originalHeight * size) / originalWidth;
        canvas.width = targetWidth;
        canvas.height = targetHeight;
        const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
        ctx.drawImage(
          image,
          0,
          0,
          originalWidth,
          originalHeight,
          0,
          0,
          targetWidth,
          targetHeight
        );
        canvas.toBlob(
          b => {
            resolve(new File([b!], img.name, { type: img.type }));
            // @ts-ignore
            canvas = null;
          },
          img.type,
          quality
        );
      });
      image.addEventListener('error', e => reject(e));
      image.src = result;
    });
    fileReader.addEventListener('error', e => reject(e));
    fileReader.readAsDataURL(img);
  });
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
