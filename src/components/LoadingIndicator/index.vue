<script setup lang="ts">
import { ref, watch } from 'vue';
import { LoadingStatusEnum } from './type';

interface Props {
  // 状态
  status?: LoadingStatusEnum;
  // 加载失败提示
  errorText?: string;
  // 加载完成提示
  finishedText?: string;
  // 加载中提示
  loadingText?: string;
  // 立即检测
  immediate?: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  status: LoadingStatusEnum.PENDING,
  loadingText: '加载中...',
  finishedText: '加载完成',
  errorText: '加载失败，点击重试',
  immediate: false,
});
const emit = defineEmits<{
  (e: 'load'): void;
}>();
// 容器
const wrapperRef = ref<HTMLDivElement>();
let attached = false;
const ob = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!attached && !props.immediate) {
      attached = true;
      return;
    }
    if (entry.isIntersecting) {
      if (props.status === LoadingStatusEnum.PENDING) {
        emit('load');
      }
    }
  });
});
watch(wrapperRef, () => {
  ob.disconnect();
  ob.observe(wrapperRef.value!);
});

function onClick() {
  if (props.status === LoadingStatusEnum.ERROR) {
    emit('load');
  }
}
</script>

<template>
  <div ref="wrapperRef" @click="onClick">
    <slot>
      <div class="status" v-if="props.status === LoadingStatusEnum.LOADING"
        ><span>{{ props.loadingText }}</span></div
      >
      <div class="status" v-if="props.status === LoadingStatusEnum.FINISHED"
        ><span>{{ props.finishedText }}</span></div
      >
      <div class="status" v-if="props.status === LoadingStatusEnum.ERROR"
        ><span>{{ props.errorText }}</span></div
      >
    </slot>
  </div>
</template>

<style lang="scss" scoped>
.status {
  @apply flex h-[60px] items-center justify-center text-[14px] text-[#999];
}
</style>
