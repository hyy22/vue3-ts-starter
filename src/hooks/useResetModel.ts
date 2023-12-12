import { reactive } from 'vue';

/**
 * 重置为提供的初始数据
 * @param factory
 * @returns
 */
export default function useResetModel<T extends ObjectType>(factory: () => T) {
  const model = reactive(factory()) as T;
  function resetModel() {
    Object.assign(model, factory());
  }
  return { model, resetModel };
}
