<script setup lang="ts">
import { useRoute } from 'vue-router';
import SideMenuItem from './SideMenuItem.vue';
import { useStateStore } from '@/store/state';
import { usePermissionStore } from '@/store/permission';

const route = useRoute();
const stateStore = useStateStore();
const permissionStore = usePermissionStore();
</script>

<template>
  <div class="sidebar">
    <el-menu
      :default-active="route.path"
      :collapse="stateStore.collapse"
      background-color="#24262F"
      text-color="#fff"
      active-text-color="#20a0ff"
      unique-opened
      router>
      <template v-for="item in permissionStore.addRoutes" :key="item.name">
        <side-menu-item :menu="item" />
      </template>
    </el-menu>
  </div>
</template>
