<script setup lang="ts">
import zhCn from 'element-plus/dist/locale/zh-cn.mjs';
</script>

<template>
  <el-config-provider :locale="zhCn">
    <router-view v-slot="{ Component }">
      <transition name="fade">
        <component :is="Component" />
      </transition>
    </router-view>
  </el-config-provider>
</template>
