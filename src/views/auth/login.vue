<script setup lang="ts">
import { handleResp } from '@/api';
import { fetchLoginByAccount } from '@/api/auth';
import { showToast } from 'vant';
import { reactive, ref } from 'vue';
import { useUserStore } from '@/store/user';
import { useRouter, useRoute } from 'vue-router';
import { calcResponseSize } from '@/utils/tool';

const router = useRouter();
const route = useRoute();
const projectName = import.meta.env.VITE_APP_NAME;
/**
 * 登录
 */
const loginForm = reactive({
  // 账号
  username: '',
  // 密码
  password: '',
});
const loginLoading = ref(false);
// 登录
async function login() {
  const { username, password } = loginForm;
  if (!username) return showToast('请输入账号');
  if (!password) return showToast('请输入密码');
  loginLoading.value = true;
  const resp = await fetchLoginByAccount({
    userName: username,
    password,
  });
  loginLoading.value = false;
  handleResp(resp, data => {
    // 登录成功
    showToast('登录成功');
    const userStore = useUserStore();
    userStore.login({
      token: data.token,
      userInfo: data,
    });
    // 获取from参数，没有就定向到首页
    const from = (route.query.from ?? '/') as string;
    router.replace(from);
  });
}
</script>

<template>
  <AppLayout>
    <div class="h-screen bg-primary flex flex-col justify-center">
      <div class="flex flex-col items-center">
        <img
          class="w-[280px] h-[280px] object-fill"
          src="@/assets/vue.svg"
          alt="" />
        <div class="text-[32px] mt-[40px]">{{ projectName }}</div>
      </div>
      <div class="px-[50px] mt-[80px]">
        <van-field
          :label-width="calcResponseSize(70)"
          v-model.trim="loginForm.username"
          label="账号"
          clearable></van-field>
        <van-field
          :label-width="calcResponseSize(70)"
          class="mt-[30px]"
          v-model.trim="loginForm.password"
          label="密码"
          type="password"
          clearable></van-field>
        <van-button
          block
          round
          class="mt-[60px]"
          :loading="loginLoading"
          @click="login"
          >登录</van-button
        >
      </div>
    </div>
  </AppLayout>
</template>
