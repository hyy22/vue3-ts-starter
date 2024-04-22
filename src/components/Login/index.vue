<script setup lang="ts">
import { reactive } from 'vue';
import useToast from '@/components/Toast/useToast';
import { fetchLoginByAccount } from '@/api/auth';
// import { md5 } from 'js-md5';
import { isResponseOk } from '@/api';
import { useUserStore } from '@/store/user';

/**
 * 属性
 */
interface Props {
  // 是否显示关闭按钮
  showClose?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  showClose: false,
});
/**
 * 事件
 */
const emit = defineEmits<{
  (e: 'login-succeed'): void;
  (e: 'close'): void;
}>();
const loginForm = reactive({
  account: '',
  password: '',
});
async function handleAccountLogin() {
  const { account, password } = loginForm;
  if (!account) {
    useToast('账号不能为空');
    return;
  }
  if (!password) {
    useToast('密码不能为空');
    return;
  }
  const resp = await fetchLoginByAccount({
    username: account,
    password: password,
  });
  handleLogin(resp);
}
// 可能有多种登录方式，统一处理
type LoginResponse = Awaited<ReturnType<typeof fetchLoginByAccount>>;
function handleLogin(resp: LoginResponse) {
  if (isResponseOk(resp)) {
    useToast('登录成功！');
    const { token, userInfo } = resp.data;
    // 设置token
    const userStore = useUserStore();
    userStore.login({
      token,
      userInfo,
    });
    emit('login-succeed');
    return;
  }
  useToast(resp.msg);
}
const title = import.meta.env.VITE_APP_NAME;
</script>

<template>
  <Transition name="fade" appear>
    <div class="rounded-md bg-white p-5 flex flex-col justify-center shadow-md">
      <div class="text-lg text-center text-black">{{ title }}</div>
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
        <button type="submit" class="full-button">登录</button>
        <button
          v-if="props.showClose"
          type="button"
          class="full-button plain"
          @click="emit('close')"
          >取消</button
        >
      </form>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
.form-item {
  @apply border border-gray-200 mt-5 p-2 flex items-center focus-within:border-gray-600;
  label {
    @apply flex-none w-[50px] text-[#999] text-[13px];
  }
  input {
    @apply flex-1 focus:outline-none;
  }
}
.full-button {
  @apply w-full h-10 flex justify-center items-center text-center text-white bg-primary rounded-md border border-primary mt-5 cursor-pointer hover:opacity-75;
  &.plain {
    @apply bg-transparent text-primary;
  }
}
</style>
