<script setup lang="ts">
interface Props {
  base?: number;
}
const props = withDefaults(defineProps<Props>(), {
  base: 300,
});
</script>

<template>
  <div class="flex h-full">
    <div
      class="p-5 overflow-y-auto flex-none border-r border-gray-100"
      :style="{ width: `${props.base}px` }">
      <slot name="left"></slot>
    </div>
    <div class="flex-auto min-w-0 overflow-y-auto">
      <slot name="right"></slot>
    </div>
  </div>
</template>
