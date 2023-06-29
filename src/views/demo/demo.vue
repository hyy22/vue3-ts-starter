<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faHomeUser } from '@fortawesome/free-solid-svg-icons';
import useLoading from '@/components/Loading/useLoading';
import useToast from '@/components/Toast/useToast';

function showLoading() {
  const loading = useLoading({ text: 'loading...', themeColor: '#f40' });
  setTimeout(() => loading.close(), 3000);
}
</script>

<template>
  <div class="mx-auto w-10/12">
    <div class="text-lg border-l-2 border-black pl-1 bg-gray-300"
      >this is a demo page</div
    >
    <!-- 使用icon fontawesome -->
    <div class="mt-5 text-gray-600"
      >HomeUser:
      <FontAwesomeIcon :icon="faHomeUser" size="xl" style="color: red"
    /></div>
    <div class="mt-5 group"
      >查找图标：<a
        class="text-blue-600 group-hover:underline"
        href="https://fontawesome.com/icons"
        >https://fontawesome.com/icons</a
      ></div
    >
    <div class="mt-5">
      <button class="button" @click="showLoading">点击显示loading</button>
      <button class="button" @click="useToast('hello world')"
        >点击显示toast</button
      >
    </div>
  </div>
</template>

<style scoped>
.button {
  @apply px-3 py-1 mr-5 bg-blue-600 text-white rounded text-base shadow hover:bg-blue-900;
}
</style>
