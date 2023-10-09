<script setup lang="ts">
import { reactive } from 'vue';
import useToast from '@/components/Toast/useToast';
import { fetchLoginByAccount } from '@/api/auth';
import { useRouter, useRoute } from 'vue-router';
import { useUserStore } from '@/store/user';
import { usePermissionStore } from '@/store/permission';
import { useStateStore } from '@/store/state';
import { removeAddRoutes } from '@/router/routes';

const router = useRouter();
const route = useRoute();
// 账户密码登录
interface LoginForm {
  account: string;
  password: string;
}
const loginForm: LoginForm = reactive({
  account: '',
  password: '',
});
// 账户密码提交
async function handleAccountLogin() {
  const { account, password } = loginForm;
  if (!account) {
    showToast('账号不能为空');
    return;
  }
  if (!password) {
    showToast('密码不能为空');
    return;
  }
  const resp = await fetchLoginByAccount({
    username: account,
    password: password,
  });
  handleLogin(resp);
}
// 登录成功
function handleLogin(resp: any) {
  if (resp.code !== 200) return showToast(resp.msg);
  showToast('登录成功！');
  const { token, userInfo } = resp.data;
  // 设置token
  const userStore = useUserStore();
  userStore.setToken(token);
  userStore.setUserInfo(userInfo);
  // TODO:设置权限
  const permissionStore = usePermissionStore();
  permissionStore.keys = ['1'];
  // 清空tab
  const stateStore = useStateStore();
  stateStore.tabs = [];
  // 清空路由
  removeAddRoutes();
  setTimeout(() => {
    const { from } = route.query;
    router.push({ path: (from as string) ?? '/', replace: true });
  }, 1000);
}
// 消息提示
function showToast(msg: string) {
  useToast(msg);
}
</script>

<template>
  <div class="fullpage-bg flex items-center">
    <div
      class="w-72 mt-48 mx-auto rounded-md bg-white p-5 flex flex-col justify-center shadow-md">
      <div class="login-title">账号密码登录</div>
      <form @submit.prevent="handleAccountLogin">
        <div class="form-item">
          <label for="account">账号</label>
          <input id="account" type="text" v-model.trim="loginForm.account" />
        </div>
        <div class="form-item">
          <label for="password">密码</label>
          <input
            id="password"
            type="password"
            v-model.trim="loginForm.password" />
        </div>
        <button
          type="submit"
          class="w-full h-10 flex justify-center items-center text-center text-white mt-5 cursor-pointer hover:opacity-75"
          style="background-color: var(--primary-color)"
          >登录</button
        >
      </form>
    </div>
  </div>
</template>

<style scoped>
.fullpage-bg {
  height: 100vh;
  background: url(/bg.jpg) no-repeat center top / cover;
}
.login-title {
  @apply text-lg text-center text-black;
}
.form-item {
  @apply border border-gray-200 mt-5 p-2 flex items-center focus-within:border-gray-600;
}
.form-item label {
  flex: none;
  width: 50px;
  color: #999;
  font-size: 13px;
}
.form-item input:focus {
  outline: none;
}
.link-btn {
  @apply underline mt-4 text-gray-500 text-right cursor-pointer text-sm;
}
</style>
