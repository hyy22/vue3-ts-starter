import type { DirectiveBinding } from 'vue';
import { usePermissionStore } from '@/store/permission';

export default {
  mounted(el: HTMLElement, binding: DirectiveBinding<any>) {
    const permissionStore = usePermissionStore();
    if (!permissionStore.hasPermission(String(binding.value))) {
      el.remove();
    }
  },
};
