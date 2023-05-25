export default {
  // 查询
  get(k: string) {
    let value = localStorage.getItem(k);
    try {
      value = JSON.parse(value as string);
    } catch (e) {
      /* empty */
    }
    return value;
  },
  // 设置
  set(k: string, v: any) {
    localStorage.setItem(k, v);
  },
  // 删除
  remove(k: string) {
    localStorage.removeItem(k);
  },
};
