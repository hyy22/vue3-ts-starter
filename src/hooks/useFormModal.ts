import useResetModel from '@/hooks/useResetModel';
import { nextTick, ref } from 'vue';
import { type FormInstance } from 'element-plus';

/**
 * 创建/修改数据弹窗处理
 * @param factory
 * @returns
 */
export default function useFormModal<T extends ObjectType>(factory: () => T) {
  // 是否显示弹窗
  const visible = ref(false);
  // 加载状态
  const loading = ref(false);
  // 弹窗表单ref
  const formRef = ref<FormInstance | null>(null);
  // 重置数据
  const { model, resetModel } = useResetModel<T>(factory);
  // 显示弹窗
  function showModal(cb?: FunctionType) {
    nextTick(formRef.value?.clearValidate);
    resetModel();
    visible.value = true;
    if (typeof cb === 'function') cb();
  }
  // 关闭弹窗
  function closeModal() {
    visible.value = false;
  }
  // 提交弹窗
  function submitModal(handler: FunctionType) {
    formRef.value?.validate(async valid => {
      if (valid) {
        loading.value = true;
        try {
          await handler();
        } finally {
          loading.value = false;
        }
      }
    });
  }

  return {
    model,
    loading,
    visible,
    formRef,
    showModal,
    closeModal,
    submitModal,
  };
}
