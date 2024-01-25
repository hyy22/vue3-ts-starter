<script setup lang="ts">
import { usePermissionStore } from '@/store/permission';

const permissionStore = usePermissionStore();
</script>

<template>
  <router-view v-slot="{ Component, route }">
    <transition name="fade">
      <keep-alive :include="permissionStore.keepAliveRoutes"
        ><component :is="Component" :key="route.fullPath"
      /></keep-alive>
    </transition>
  </router-view>
</template>
