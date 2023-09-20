/**
 * 缓存promise结果
 * @example const [cached, resetCache] = useCache(() => fetchList(), { canCache: resp => resp.success, expire: 3000 })
 */
export interface UseCacheOption {
  // 根据值判断是否需要缓存
  canCache?: (resp: any) => boolean;
  // 缓存时长，默认5分钟
  expire?: number;
}
export default function useCache(
  fn: FunctionType,
  { canCache, expire = 300000 }: UseCacheOption
) {
  let cache = Object.create(null);
  let timer: ReturnType<typeof setTimeout>;
  // 清空缓存
  const resetCache = () => {
    cache = Object.create(null);
  };
  return [
    async function (...args: any[]) {
      if (timer) clearTimeout(timer);
      timer = setTimeout(resetCache, expire);
      const key = JSON.stringify(args);
      if (cache[key]) {
        return cache[key];
      } else {
        const result = await (cache[key] = fn(...args));
        // 判断是否缓存
        if (typeof canCache !== 'function' || canCache(result)) {
          cache[key] = result;
        } else {
          delete cache[key];
        }
        return result;
      }
    },
    resetCache,
  ];
}
