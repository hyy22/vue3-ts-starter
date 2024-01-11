import { type Ref, computed } from 'vue';

export default function useRect(target: Ref<HTMLElement | undefined>) {
  const rect = computed(() => {
    return target.value?.getBoundingClientRect();
  });
  return rect;
}
