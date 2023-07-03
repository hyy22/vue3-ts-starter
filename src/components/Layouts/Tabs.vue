<script setup lang="ts">
import { CloseTarget, useStateStore } from '@/store/state';
import { ArrowDown, CircleClose } from '@element-plus/icons-vue';
import {
  RouteLocationNormalizedLoaded,
  onBeforeRouteUpdate,
  useRoute,
  useRouter,
} from 'vue-router';

const route = useRoute();
const router = useRouter();
const stateStore = useStateStore();
// 打开标签
function addTab(route: RouteLocationNormalizedLoaded) {
  stateStore.addTab({
    name: route.name as string,
    path: route.fullPath,
    title: route.meta?.title as string,
    keepAlive: (route.meta?.keepAlive ?? false) as boolean,
  });
}
addTab(route);
onBeforeRouteUpdate(function (to) {
  addTab(to);
});
// 关闭标签
function closeTab(index: number, target: CloseTarget = CloseTarget.CURRENT) {
  // 当前tab
  const deleteItem = stateStore.tabs[index];
  stateStore.closeTab(index, target);
  if (target === CloseTarget.CURRENT) {
    // 只有当前tab才需要更新路由
    const item = stateStore.tabs[index]
      ? stateStore.tabs[index]
      : stateStore.tabs[index - 1];
    if (item) {
      deleteItem.path === route.fullPath && router.push(item.path);
    } else {
      router.push('/');
    }
  }
}
function handleCommand(command: CloseTarget) {
  if (command === CloseTarget.ALL) {
    stateStore.closeAllTab();
  } else {
    const curIndex = stateStore.tabs.findIndex(v => v.path === route.fullPath);
    if (curIndex > -1) stateStore.closeTab(curIndex, command);
  }
}
</script>

<template>
  <div class="flex justify-between items-center p-2 border">
    <div class="flex-1 flex">
      <div
        v-for="(tab, i) of stateStore.tabs"
        :key="tab.path"
        class="h-10 px-5 flex items-center">
        <router-link :to="tab.path" class="tags-li-title">{{
          tab.title
        }}</router-link>
        <el-icon @click="closeTab(i)"><CircleClose /></el-icon>
      </div>
    </div>
    <div class="flex-none">
      <el-dropdown @command="handleCommand">
        <el-button type="primary">
          标签<el-icon class="el-icon--right"><ArrowDown /></el-icon>
        </el-button>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item :command="CloseTarget.LEFT"
              >关闭左侧</el-dropdown-item
            >
            <el-dropdown-item :command="CloseTarget.RIGHT"
              >关闭右侧</el-dropdown-item
            >
            <el-dropdown-item :command="CloseTarget.OTHER"
              >关闭其它</el-dropdown-item
            >
            <el-dropdown-item :command="CloseTarget.ALL"
              >关闭全部</el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>
