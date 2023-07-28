<script setup lang="ts">
import { useRoute } from 'vue-router';
import { useStateStore } from '@/store/state';
import SideBar from './SideBar.vue';
import MenuBar from './MenuBar.vue';
import TabBar from './TabBar.vue';

const route = useRoute();
const stateStore = useStateStore();
</script>

<template>
  <div class="flex h-screen overflow-hidden">
    <!-- 侧边栏 -->
    <SideBar class="flex-none" />
    <div class="flex-1 flex flex-col bg-gray-100">
      <!-- 菜单栏 -->
      <MenuBar />
      <!-- 标签栏 -->
      <TabBar />
      <!-- 内容 -->
      <div class="flex-1 m-2 bg-white rounded overflow-y-auto">
        <router-view v-slot="{ Component }" :key="route.fullPath">
          <transition name="fade" mode="out-in">
            <keep-alive :include="stateStore.keepAliveTabs">
              <component :is="Component"></component>
            </keep-alive>
          </transition>
        </router-view>
      </div>
    </div>
  </div>
</template>
