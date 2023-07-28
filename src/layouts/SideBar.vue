<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router';
import SideMenuItem from './SideMenuItem.vue';
import { useStateStore } from '@/store/state';
import { usePermissionStore } from '@/store/permission';

const route = useRoute();
const router = useRouter();
const stateStore = useStateStore();
const permissionStore = usePermissionStore();
const appName = import.meta.env.VITE_APP_NAME;
function backHome() {
  router.push('/');
}
</script>

<template>
  <div
    class="flex flex-col"
    :class="{ 'min-w-[200px]': !stateStore.collapse }"
    style="background: var(--el-menu-bg-color)">
    <div
      class="flex-none flex justify-center py-5 text-white cursor-pointer"
      @click="backHome">
      <img src="/icon.svg" class="w-7 h-7" alt="" />
      <span class="ml-1" v-show="!stateStore.collapse">{{ appName }}</span>
    </div>
    <div class="flex-1 overflow-y-auto">
      <el-menu
        :default-active="route.path"
        :collapse="stateStore.collapse"
        popper-effect="dark"
        unique-opened
        router>
        <template v-for="item in permissionStore.addRoutes" :key="item.name">
          <side-menu-item :menu="item" />
        </template>
      </el-menu>
    </div>
  </div>
</template>
