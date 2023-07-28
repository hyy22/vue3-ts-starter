<script setup lang="ts">
import { RouteRecordRaw } from 'vue-router';

interface Props {
  menu: RouteRecordRaw;
}
const props = defineProps<Props>();
</script>

<template>
  <template v-if="!props.menu.meta?.hidden">
    <el-menu-item v-if="!props.menu.children" :index="props.menu.path">
      <el-icon v-if="props.menu.meta?.icon">
        <component :is="props.menu.meta.icon"></component>
      </el-icon>
      <template #title>{{ props.menu.meta?.title }}</template>
    </el-menu-item>
    <el-sub-menu
      v-else-if="props.menu.children.some(v => !v.meta?.hidden)"
      :index="props.menu.path">
      <template #title>
        <el-icon v-if="props.menu.meta?.icon">
          <component :is="props.menu.meta.icon"></component>
        </el-icon>
        <span>{{ props.menu.meta?.title }}</span>
      </template>
      <side-menu-item
        v-for="child in props.menu.children"
        :key="child.path"
        :menu="child">
      </side-menu-item>
    </el-sub-menu>
  </template>
</template>
