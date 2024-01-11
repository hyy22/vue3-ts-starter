import { defineStore } from 'pinia';

interface UserInfo extends ObjectType {
  // 用户id
  id: number;
  // 用户昵称
  nickname: string;
}
interface UserStore {
  token: string;
  userInfo?: UserInfo;
}
export const useUserStore = defineStore('user', {
  state: (): UserStore => ({
    token: '',
    userInfo: undefined,
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
      this.userInfo = undefined;
    },
    // 集合操作-登录
    login(loginInfo: { token: string; userInfo: UserInfo }) {
      this.setToken(loginInfo.token);
      this.setUserInfo(loginInfo.userInfo);
    },
    // 集合操作-注销登录
    logout(route = true) {
      this.removeToken();
      this.removeUserInfo();
      if (route) {
        // 获取当前页面url
        const path = window.location.href.match(/(\/[^/]+)$/)?.[1] ?? '/';
        location.replace(`/login?from=${encodeURIComponent(path)}`);
      }
    },
  },
  persist: true,
});
