<script setup lang="ts">
import Tabs from './Tabs.vue';
import SideMenu from './SideMenu.vue';
</script>

<template>
  <div class="flex">
    <div class="flex-none">
      <SideMenu />
    </div>
    <div class="flex-1">
      <Tabs />
      <router-view></router-view>
    </div>
  </div>
</template>
