import { defineStore } from 'pinia';

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
