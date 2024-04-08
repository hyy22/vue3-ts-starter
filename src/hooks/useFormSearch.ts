import { type Ref, ref } from 'vue';
import { ElMessage, type TableInstance } from 'element-plus';
import useResetModel from '@/hooks/useResetModel';
import { handleBlobResponse } from '@/api';

export interface FormatResp<T> {
  list: T[];
  total?: number;
}
export default function useFormSearch<
  T extends ObjectType = any,
  U = any,
  E = any
>({
  factory = () => ({} as T),
  validateAndFormatParmas,
  searchFn,
}: {
  // 工厂函数，用来处理查询model和数据重置
  factory?: () => T;
  // 查询数据校验格式化
  validateAndFormatParmas?: (model: T) => Promise<U>;
  // 查询方法
  searchFn: (params?: U) => Promise<FormatResp<E>>;
}) {
  // 查询loading
  const loading = ref(false);
  const rows = ref<E[]>([]) as Ref<E[]>;
  const page = ref<PageType>({
    current: 1,
    pageSize: 20,
    total: 0,
  });
  const tableRef = ref<TableInstance>();
  const { model, resetModel } = useResetModel<T>(factory);
  /**
   * 查询
   */
  async function search(isResetPage = false) {
    if (isResetPage) page.value.current = 1;
    let params: U;
    if (typeof validateAndFormatParmas === 'function') {
      try {
        params = await validateAndFormatParmas(model);
      } catch (e: any) {
        return ElMessage.error(e.message);
      }
    } else {
      params = model as unknown as U;
    }
    try {
      loading.value = true;
      const { list = [], total = 0 } = await searchFn(params);
      rows.value = list;
      page.value.total = total;
    } catch (e: any) {
      ElMessage.error(e.message);
    } finally {
      loading.value = false;
    }
  }
  /**
   * 重置
   */
  function reset() {
    resetModel();
    search(true);
  }
  /**
   * 导出
   */
  const exportLoading = ref(false);
  async function exportFile(
    exportFn: (params: U) => Promise<Blob>,
    name: string
  ) {
    let params: U;
    if (typeof validateAndFormatParmas === 'function') {
      try {
        params = await validateAndFormatParmas(model);
      } catch (e: any) {
        return ElMessage.error(e.message);
      }
    } else {
      params = model as unknown as U;
    }
    exportLoading.value = true;
    try {
      const resp = await exportFn(params);
      handleBlobResponse(resp, name);
    } finally {
      exportLoading.value = false;
    }
  }

  return {
    loading,
    model,
    page,
    rows,
    search,
    reset,
    exportLoading,
    exportFile,
    resetModel,
    tableRef,
  };
}
