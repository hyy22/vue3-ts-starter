<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { onMounted, ref } from 'vue';

export interface Props {
  themeColor?: string;
  mask?: boolean;
  maskColor?: string;
  text?: string;
  zIndex?: number;
}
const props = withDefaults(defineProps<Props>(), {
  themeColor: 'var(--primary-color)',
  mask: true,
  maskColor: 'rgba(0,0,0,0.1)',
  zIndex: 999,
});
const visible = ref(false);
function close() {
  visible.value = false;
}
onMounted(function () {
  visible.value = true;
});
defineExpose({
  close,
});
</script>

<template>
  <div
    v-if="visible && props.mask"
    class="loading-mask"
    :style="{ background: props.maskColor }"></div>
  <div class="loading" v-if="visible">
    <FontAwesomeIcon
      :icon="faSpinner"
      spin
      size="2x"
      :style="{ color: props.themeColor }" />
    <div
      v-if="props.text"
      class="loading-msg"
      :style="{ color: props.themeColor }"
      >{{ props.text }}</div
    >
  </div>
</template>

<style scoped>
.loading-mask {
  position: fixed;
  z-index: v-bind('props.zIndex');
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}
.loading {
  position: fixed;
  z-index: v-bind('props.zIndex');
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
}
</style>
