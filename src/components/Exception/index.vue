<script setup lang="ts">
interface Props {
  status: number | string;
  desc: string;
  img?: string;
  operations?: Array<'login' | 'home' | 'back' | 'refresh'>;
}
const props = withDefaults(defineProps<Props>(), {
  operations: () => ['login', 'home'],
});
function login() {
  location.replace('/login');
}
function back() {
  history.go(-1);
}
function refresh() {
  location.reload();
}
function backHome() {
  location.replace('/');
}
</script>

<template>
  <div class="w-full h-screen flex justify-center items-start">
    <div class="mt-36 flex items-center">
      <img
        v-if="props.img"
        :src="props.img"
        alt=""
        class="flex-none h-52 w-auto" />
      <div class="flex-1">
        <div class="text-8xl">{{ props.status }}</div>
        <div class="mt-6 text-slate-400">{{ props.desc }}</div>
        <div class="mt-10 flex" v-if="props.operations.length">
          <div
            class="button"
            v-if="props.operations.includes('login')"
            @click="login"
            >重新登录</div
          >
          <div
            class="button"
            v-if="props.operations.includes('refresh')"
            @click="refresh"
            >刷新</div
          >
          <div
            class="button primary"
            v-if="props.operations.includes('back')"
            @click="back"
            >返回</div
          >
          <div
            class="button primary"
            v-if="props.operations.includes('home')"
            @click="backHome"
            >返回首页</div
          >
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.button {
  @apply cursor-pointer px-5 h-9 flex justify-center items-center border rounded border-gray-200 text-base;
  &.primary,
  &:hover {
    color: #fff;
    background-color: var(--primary-color);
    border-color: var(--primary-color);
  }
  &:not(:first-child) {
    margin-left: 20px;
  }
}
</style>
