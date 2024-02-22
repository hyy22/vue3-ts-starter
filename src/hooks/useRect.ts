import { type Ref, ref, onMounted, onBeforeUnmount, unref } from 'vue';

export default function useRect(
  target: HTMLElement | Ref<HTMLElement | undefined>
) {
  const rect = ref<DOMRect>();
  const getRect = () => {
    const elem = unref(target);
    rect.value = elem?.getBoundingClientRect();
  };
  const ob = new ResizeObserver(() => {
    getRect();
  });
  onMounted(() => {
    const elem = unref(target);
    if (elem) ob.observe(elem);
  });
  onBeforeUnmount(() => {
    ob.disconnect();
  });
  return rect;
}
