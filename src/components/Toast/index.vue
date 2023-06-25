<script setup lang="ts">
import { ref, onMounted } from 'vue';

export interface ToastOptions {
  title: string;
  during?: number;
}
const props = withDefaults(defineProps<ToastOptions>(), {
  during: 2000,
});
const visible = ref(false);
let timer: ReturnType<typeof setTimeout>;
onMounted(function () {
  if (timer) clearTimeout(timer);
  visible.value = true;
  // 计时
  timer = setTimeout(() => {
    visible.value = false;
  }, props.during);
});
</script>

<template>
  <Transition name="fade" appear>
    <div class="toast" v-if="visible">{{ props.title }}</div>
  </Transition>
</template>

<style scoped>
.toast {
  position: fixed;
  z-index: 9999;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  padding: 5px 10px;
  font-size: 14px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}
</style>
