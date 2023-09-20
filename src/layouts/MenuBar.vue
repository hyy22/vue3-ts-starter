<script setup lang="ts">
import { useStateStore } from '@/store/state';
import UserNav from './UserNav/index.vue';

const stateStore = useStateStore();
/**
 * 按钮操作
 */
function toggleSideBar() {
  stateStore.collapse = !stateStore.collapse;
}
function refresh() {
  location.reload();
}
function toggleFullScreen() {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    document.documentElement.requestFullscreen();
  }
}
</script>

<template>
  <div class="h-10 pr-4 pl-2 flex justify-between items-center bg-white">
    <div class="flex">
      <div class="menubar-icon" @click="toggleSideBar" title="切换侧边栏">
        <el-icon v-if="!stateStore.collapse"><Fold /></el-icon>
        <el-icon v-else><Expand /></el-icon>
      </div>
      <div class="menubar-icon ml-1" @click="refresh" title="刷新">
        <el-icon><RefreshRight /></el-icon>
      </div>
    </div>
    <div class="flex items-center">
      <div class="menubar-icon mr-3" @click="toggleFullScreen" title="切换全屏">
        <el-icon><FullScreen /></el-icon>
      </div>
      <UserNav />
    </div>
  </div>
</template>

<style scoped>
.menubar-icon {
  @apply cursor-pointer p-1 flex items-center;
}
.menubar-icon:hover {
  @apply bg-gray-300;
}
</style>
