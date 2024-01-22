<script setup lang="ts">
import { useRouter } from 'vue-router';
import tabbars from '@/config/tabbar';
import { calcResponseSize } from '@/utils/tool';

interface Props {
  // 当前tab
  current: (typeof tabbars)[number]['name'];
}
const props = withDefaults(defineProps<Props>(), {});
const router = useRouter();
function onTabChange(active: string) {
  const tab = tabbars.find(item => item.name === active);
  if (tab && tab.path) {
    router.replace(tab.path);
  }
}
</script>

<template>
  <van-tabbar
    :model-value="props.current"
    safe-area-inset-bottom
    @change="onTabChange">
    <van-tabbar-item v-for="item of tabbars" :key="item.name" :name="item.name">
      {{ item.label }}
      <template #icon>
        <van-icon
          :name="item.icon"
          :size="calcResponseSize(40)"
          :class-prefix="item.iconPrefix ?? 'van-icon'"></van-icon>
      </template>
    </van-tabbar-item>
  </van-tabbar>
</template>
