<script setup lang="ts">
import { ElMessage } from 'element-plus';
import { ref, type Component } from 'vue';
import { type LayoutExpose, type LayoutProps } from './type';

defineOptions({
  inheritAttrs: false,
});
interface Props {
  layout: Component;
  // 只能单选
  single?: boolean;
  // 允许为空
  allowEmpty?: boolean;
  // 自定义class
  customClass?: string;
}
const props = withDefaults(defineProps<Props>(), {
  single: false,
  allowEmpty: true,
});
const emit = defineEmits<{
  (e: 'select', val: any): void;
}>();
const layoutRef = ref<LayoutExpose>();
const visible = ref(false);
function submit() {
  const checkedItems = layoutRef.value?.getCheckedItems?.();
  if (!props.allowEmpty && !checkedItems?.length) {
    return ElMessage.error('请先选择');
  }
  const target = props.single ? checkedItems?.[0] : checkedItems;
  emit('select', target);
  visible.value = false;
}
</script>

<template>
  <div
    class="flex items-center cursor-pointer"
    :class="props.customClass"
    @click="visible = true">
    <slot></slot>
  </div>
  <Modal v-bind="$attrs" v-model="visible" destroy-on-close>
    <component
      ref="layoutRef"
      :is="props.layout"
      :selectable="((props.single ? 'single' : 'multiple') as LayoutProps['selectable'])" />
    <template #footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="submit">确认</el-button>
    </template>
  </Modal>
</template>
