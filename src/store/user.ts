import { defineStore } from 'pinia';
import { usePermissionStore } from './permission';

interface UserInfo extends ObjectType {
  // 用户id
  id: number;
  // 用户昵称
  nickname: string;
}
interface UserStore {
  token: string;
  userInfo: UserInfo | null;
}
export const useUserStore = defineStore('user', {
  state: (): UserStore => ({
    token: '',
    userInfo: null,
  }),
  actions: {
    setToken(tk: string) {
      this.token = tk;
    },
    removeToken() {
      this.token = '';
    },
    setUserInfo(userInfo: UserInfo) {
      this.userInfo = userInfo;
    },
    removeUserInfo() {
      this.userInfo = null;
    },
    // 登录
    login(loginInfo: UserStore) {
      this.setToken(loginInfo.token);
      this.setUserInfo(loginInfo.userInfo!);
      // TODO:模拟权限
      const permissionStore = usePermissionStore();
      permissionStore.setPermission(['fake_admin']);
    },
    // route是否跳转 isAuto是否自动跳转
    logout(route = true, isAuto = true) {
      this.removeToken();
      this.removeUserInfo();
      const loginPath = import.meta.env.VITE_LOGIN_PATH ?? '/login';
      if (route && window.location.pathname !== loginPath) {
        if (!isAuto) return location.replace(loginPath);
        // 获取当前页面url
        const fullPath = window.location.href.replace(
          window.location.origin,
          ''
        );
        location.replace(`${loginPath}?from=${encodeURIComponent(fullPath)}`);
      }
    },
  },
  persist: {
    paths: ['token', 'userInfo'],
  },
});
