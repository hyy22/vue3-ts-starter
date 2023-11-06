export default {
  // 查询
  get<T = string>(k: string): T {
    let value = localStorage.getItem(k);
    try {
      value = JSON.parse(value!);
    } catch (e) {
      /* empty */
    }
    return value as T;
  },
  // 设置
  set(k: string, v: any) {
    localStorage.setItem(k, JSON.stringify(v));
  },
  // 删除
  remove(k: string) {
    localStorage.removeItem(k);
  },
};
