<script setup lang="ts">
import { useRouter } from 'vue-router';
import { calcResponseSize } from '@/utils/tool';

interface Props {
  // 是否显示icon
  showIcon?: boolean;
  // 标题
  title?: string;
  // 背景色
  bgColor?: string;
  // 字体颜色
  color?: string;
  // 最小高度，px
  minHeight?: number;
}
const props = withDefaults(defineProps<Props>(), {
  showIcon: true,
  bgColor: 'var(--theme-primary-color)',
  color: 'var(--theme-reverse-color)',
  minHeight: 92,
});
/**
 * 返回
 */
const router = useRouter();
function goBack() {
  router.back();
}
</script>

<template>
  <div :style="{ backgroundColor: props.bgColor }">
    <div class="van-safe-area-top"></div>
    <div
      class="relative flex items-center"
      :style="{
        minHeight: calcResponseSize(props.minHeight),
        color: props.color,
      }">
      <!-- 左侧插槽 -->
      <div v-if="$slots.left || props.showIcon" class="side-slot left-0">
        <slot name="left">
          <van-icon
            v-if="props.showIcon"
            name="arrow-left"
            :size="calcResponseSize(40)"
            @click="goBack" />
        </slot>
      </div>
      <!-- 主体 -->
      <div class="flex-1 min-w-0 flex justify-center">
        <slot>
          <div
            v-if="props.title"
            class="text-[32px] text-center van-ellipsis max-w-[60%]"
            >{{ props.title }}</div
          >
        </slot>
      </div>
      <!-- 右侧插槽 -->
      <div v-if="$slots.right" class="side-slot right-0">
        <slot name="right"></slot>
      </div>
    </div>
    <!-- 底部插槽 -->
    <slot name="footer"></slot>
  </div>
</template>

<style lang="scss" scoped>
.side-slot {
  @apply absolute top-0 bottom-0 flex items-center px-[var(--van-padding-md)];
}
</style>
