import { createPinia } from 'pinia';
import { createPersistedState } from 'pinia-plugin-persistedstate';

const pinia = createPinia();
pinia.use(
  createPersistedState({
    // 用来区分其他key
    key(storeKey) {
      return `__store__${storeKey}`;
    },
  })
);

export default pinia;
