import { showToast } from 'vant';
import { type Ref, ref } from 'vue';

export interface FetchFnResult<T = any> {
  list: T[];
  total?: number;
}
export function useFetch<T = any>(
  fetchFn: (p: PageType) => Promise<FetchFnResult<T>>
) {
  const page = ref<PageType>({
    current: 1,
    pageSize: 20,
    total: 0,
  });
  // 加载状态
  const loading = ref(false);
  // 是否全部加载完成
  const finished = ref(false);
  // 是否加载出错
  const error = ref(false);
  // 数据列表
  const dataList: Ref<T[]> = ref([]);
  // 加载方法
  async function load(isResetPage = false) {
    // 重置页码查询
    if (isResetPage) {
      loading.value = false;
      finished.value = false;
      error.value = false;
      page.value.current = 1;
      dataList.value = [];
    }
    loading.value = true;
    try {
      const { list, total } = await fetchFn(page.value);
      loading.value = false;
      dataList.value = [...dataList.value, ...list];
      // 页码+1
      page.value.current += 1;
      // 判断是否加载完成
      if (!total || dataList.value.length >= total) {
        finished.value = true;
      }
    } catch (e: any) {
      loading.value = false;
      error.value = true;
      showToast(e.message);
    }
  }
  return {
    loading,
    finished,
    error,
    dataList,
    load,
  };
}
