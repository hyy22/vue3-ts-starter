<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router';
import { useStateStore } from '@/store/state';
import { removeAddRoutes } from '@/router/routes';
import Login from '@/components/Login/index.vue';
import { onMounted } from 'vue';

const router = useRouter();
const route = useRoute();
function handleLoginSucceed() {
  setTimeout(() => {
    const { from } = route.query;
    router.push({ path: (from as string) ?? '/', replace: true });
  }, 500);
}
/**
 * 重置操作
 */
onMounted(() => {
  // 清空tab
  const stateStore = useStateStore();
  stateStore.tabs = [];
  // 清空路由
  removeAddRoutes();
});
</script>

<template>
  <div class="fullpage-bg flex justify-center items-center">
    <div class="flex-none w-[400px] z-[2]">
      <Login @login-succeed="handleLoginSucceed" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.fullpage-bg {
  height: 100vh;
  background: url(/bg.jpg) no-repeat center top / cover;
  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba($color: #000, $alpha: 0.2);
    backdrop-filter: blur(6px);
  }
}
</style>
