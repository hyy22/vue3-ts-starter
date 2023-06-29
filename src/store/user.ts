import { defineStore } from 'pinia';

interface UserInfo extends ObjectType {
  // 假设有个id
  id: number;
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
    logout() {
      this.removeToken();
      this.removeUserInfo();
      location.replace('/login');
    },
  },
  persist: {
    paths: ['token', 'userInfo'],
  },
});
