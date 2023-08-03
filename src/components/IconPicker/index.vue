<script setup lang="ts">
import { computed, ref } from 'vue';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import type { IconPickerProps } from './type';

const props = withDefaults(defineProps<IconPickerProps>(), {
  placeholder: '请选择',
  clearable: true,
});
const emit = defineEmits<{
  (e: 'update:model-value', val: string): void;
  (e: 'change', val: string): void;
}>();

const visible = ref(false); // 是否显示弹层
const icons = Object.keys(ElementPlusIconsVue); // 读取所有图标
const current = ref(1); // 页码
const pageSize = 30; // 每页展示个数
const totalPage = Math.ceil(icons.length / pageSize); // 总页数
// 展示列表
const displayIcons = computed(() => {
  return icons.slice(
    pageSize * (current.value - 1),
    (current.value - 1) * pageSize + pageSize
  );
});
// 上一页
function prev() {
  if (current.value > 1) current.value -= 1;
}
// 下一页
function next() {
  if (current.value < totalPage) current.value += 1;
}
// 选择图标
function handleIconClick(name: string) {
  emit('update:model-value', name);
  emit('change', name);
  visible.value = false;
}
// 清空选择
function clear() {
  emit('update:model-value', '');
  emit('change', '');
  visible.value = false;
}
</script>

<template>
  <el-popover
    :visible="visible"
    popper-class="icon-picker--popover"
    placement="right"
    :width="350">
    <template #reference>
      <div @click="visible = !visible" class="cursor-pointer flex">
        <div class="icon-picker--display">
          <span class="px-2" v-if="!props.modelValue">{{
            props.placeholder
          }}</span>
          <component v-else :is="props.modelValue" width="1.5em"></component>
        </div>
        <el-tooltip content="删除" v-if="props.modelValue && props.clearable">
          <div
            class="w-7 h-10 flex justify-center items-center border border-l-0"
            @click.stop="clear">
            <Close class="w-4" />
          </div>
        </el-tooltip>
      </div>
    </template>
    <div class="flex">
      <div class="p-3 flex flex-wrap">
        <div
          class="icon-picker--icon"
          v-for="icon of displayIcons"
          :key="icon"
          @click="handleIconClick(icon)">
          <component :is="icon" width="1.5em"></component>
        </div>
      </div>
    </div>
    <div class="flex justify-between items-center px-3 pb-3">
      <span>共{{ icons.length }}个图标</span>
      <div class="flex">
        <div
          :class="{ 'icon-picker--arrow': true, disabled: current <= 1 }"
          @click="prev"
          ><el-icon><ArrowLeft /></el-icon
        ></div>
        <div
          :class="{
            'icon-picker--arrow': true,
            'ml-1': true,
            disabled: current >= totalPage,
          }"
          @click="next"
          ><el-icon><ArrowRight /></el-icon
        ></div>
      </div>
    </div>
  </el-popover>
</template>

<style lang="scss">
.icon-picker--popover {
  --el-popover-padding: 0;
}
.icon-picker--display {
  @apply h-10 flex justify-center items-center border;
  min-width: 2.5rem;
}
.icon-picker--icon {
  @apply p-1 border w-14 h-10 m-1 flex justify-center items-center flex-col cursor-pointer;
  &:hover {
    border-color: var(--primary-color);
    color: var(--primary-color);
  }
}
.icon-picker--arrow {
  @apply w-8 h-8 flex justify-center items-center border cursor-pointer;
  &:not(.disabled):hover {
    color: var(--primary-color);
    border-color: var(--primary-color);
  }
  &.disabled {
    cursor: default;
    background-color: rgba($color: #000000, $alpha: 0.1);
  }
}
</style>
