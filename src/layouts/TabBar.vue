<script setup lang="ts">
import {
  RouteLocationNormalizedLoaded,
  onBeforeRouteUpdate,
  useRoute,
  useRouter,
} from 'vue-router';
import { CloseTarget, TabItem, useStateStore } from '@/store/state';
import { computed, ref } from 'vue';

const route = useRoute();
const router = useRouter();
const stateStore = useStateStore();
// 当前index
const currentIndex = computed(() => {
  return stateStore.tabs.findIndex(v => v.path === route.fullPath);
});
// 前一个
function goPrev() {
  const prev =
    stateStore.tabs[currentIndex.value > 0 ? currentIndex.value - 1 : 0];
  if (prev.path) router.push(prev.path);
}
// 后一个
function goNext() {
  const next =
    stateStore.tabs[
      currentIndex.value < stateStore.tabs.length - 1
        ? currentIndex.value + 1
        : stateStore.tabs.length - 1
    ];
  if (next.path) router.push(next.path);
}
// 关闭
function closeTab(tab: TabItem) {
  const index = stateStore.tabs.findIndex(v => v.path === tab.path);
  const isCurrentIndex = index === currentIndex.value;
  if (index > -1) stateStore.closeTab(index);
  // 如果是当前路由，需要跳转
  if (isCurrentIndex) {
    const item = stateStore.tabs[index] ?? stateStore.tabs[index - 1];
    if (item) {
      router.push(item.path);
    } else {
      router.push('/');
    }
  }
}
// 下拉
function handleCommand(name: CloseTarget) {
  stateStore.closeTab(currentIndex.value, name);
  // 如果没有路由需要跳转首页
  if (!stateStore.tabs.length) router.push('/');
}
// 打开标签
function addTab(r: RouteLocationNormalizedLoaded) {
  stateStore.addTab({
    name: r.name as string,
    path: r.fullPath,
    title: r.meta?.title as string,
    keepAlive: (r.meta?.keepAlive ?? false) as boolean,
  });
  // 滚动
  setTimeout(fixPosition, 50);
}
addTab(route);
onBeforeRouteUpdate(function (to) {
  addTab(to);
});

/**
 * 滚动定位
 */
const tabbarWrapperRef = ref<HTMLElement | null>(null);
function fixPosition() {
  if (!tabbarWrapperRef.value) return;
  const activeItem =
    tabbarWrapperRef.value.querySelector<HTMLElement>('.active');
  if (!activeItem) return;
  const activeTabRect = activeItem.getBoundingClientRect();
  const tabBarRect = tabbarWrapperRef.value.getBoundingClientRect();
  const tabOffset = activeItem.offsetLeft - tabbarWrapperRef.value.offsetLeft;
  const scrollLeft = tabOffset - (tabBarRect.width - activeTabRect.width) / 2;
  tabbarWrapperRef.value.scroll({ left: scrollLeft, behavior: 'smooth' });
}
</script>

<template>
  <div class="px-2 h-10 flex justify-between items-center bg-white shadow-md">
    <div class="flex-1 flex items-center min-w-0">
      <div class="tabbar-icon" @click="goPrev">
        <el-icon><DArrowLeft /></el-icon>
      </div>
      <div ref="tabbarWrapperRef" class="tabbar-wrapper">
        <div
          v-for="tab of stateStore.tabs"
          :key="tab.path"
          :class="{ 'tabbar-item': true, active: tab.path === route.fullPath }">
          <router-link :to="tab.path" class="h-full flex items-center">{{
            tab.title
          }}</router-link>
          <el-icon class="icon" @click="closeTab(tab)"><Close /></el-icon>
        </div>
      </div>
    </div>
    <div class="flex-none flex items-center">
      <div class="tabbar-icon" @click="goNext">
        <el-icon><DArrowRight /></el-icon>
      </div>
      <el-dropdown @command="handleCommand">
        <div class="tabbar-icon">
          <el-icon><ArrowDown /></el-icon>
        </div>
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
              >关闭所有</el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<style scoped lang="scss">
@use 'sass:color';
.tabbar-icon {
  @apply p-1 flex justify-center items-center cursor-pointer transition-colors;
  &:hover {
    color: var(--primary-color);
  }
}
.tabbar-wrapper {
  @apply overflow-x-auto flex-1 flex items-center min-w-0;
  &::-webkit-scrollbar {
    display: none;
  }
}
.tabbar-item {
  @apply h-9 px-2 ml-1 flex-none flex items-center justify-center text-sm rounded-t-lg cursor-pointer text-gray-600 border border-gray-100;
  .icon {
    @apply rounded-full ml-1;
    &:hover {
      @apply bg-gray-600;
    }
  }
}
.tabbar-item:hover,
.tabbar-item.active {
  background: var(--tabbar-item-bg);
  color: var(--primary-color);
  font-weight: bold;
}
</style>
