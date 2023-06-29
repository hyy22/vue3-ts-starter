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
  <div class="container">
    <div>this is a demo page</div>
    <!-- 使用icon fontawesome -->
    <div
      >HomeUser:
      <FontAwesomeIcon :icon="faHomeUser" size="xl" style="color: red"
    /></div>
    <div
      >查找图标：<a href="https://fontawesome.com/icons"
        >https://fontawesome.com/icons</a
      ></div
    >
    <button @click="showLoading">点击显示loading</button>
    <button @click="useToast('hello world')">点击显示toast</button>
  </div>
</template>
