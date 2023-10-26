<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { tree2List, TreeItem } from '@/utils/tree';
import TransferPanel from './TransferPanel.vue';
import 'element-plus/theme-chalk/el-transfer.css';

interface Prop {
  height?: string; // 高度
  modelValue?: (string | number)[]; // 勾选列表
  checkStrictly?: boolean; // 父子不关联
  data: TreeItem[]; // 数据源
  placeholder?: string; // 占位
}
const props = withDefaults(defineProps<Prop>(), {
  modelValue: () => [],
  checkStrictly: false,
});
const emit = defineEmits<{
  (e: 'update:model-value', keys: (string | number)[]): void;
}>();
// 选择对象列表
const targetData = computed(() => {
  const list = tree2List(props.data, !props.checkStrictly);
  return list.filter(v => props.modelValue.includes(v.id));
});
// 左侧选择变更
const leftChecked = ref<(string | number)[]>([]);
watch(
  () => props.modelValue,
  val => {
    leftChecked.value = [...val];
  },
  { immediate: true }
);
const rightChecked = ref<(string | number)[]>([]);
function onSourceCheckedChange(keys: (string | number)[]) {
  leftChecked.value = [...keys];
}
function addToLeft() {
  const checkedKeys = props.modelValue.filter(
    v => !rightChecked.value.includes(v)
  );
  rightChecked.value = [];
  emit('update:model-value', [...checkedKeys]);
}
// 右侧选择变更
function onTargetCheckedChange(keys: (string | number)[]) {
  rightChecked.value = [...keys];
}
function addToRight() {
  const checkedKeys = [...new Set([...props.modelValue, ...leftChecked.value])];
  emit('update:model-value', [...checkedKeys]);
}
</script>

<template>
  <div
    class="el-transfer tree-transfer"
    :style="
      props.height ? { '--el-transfer-panel-body-height': props.height } : {}
    ">
    <transfer-panel
      ref="leftPanel"
      title="待选列表"
      :data="props.data"
      :default-checked="leftChecked"
      :check-strictly="props.checkStrictly"
      :placeholder="props.placeholder"
      @checked-change="onSourceCheckedChange">
      <slot name="left-footer" />
    </transfer-panel>
    <div class="el-transfer__buttons">
      <el-button
        type="primary"
        :disabled="!rightChecked.length"
        @click="addToLeft">
        <el-icon><arrow-left /></el-icon>
      </el-button>
      <el-button
        type="primary"
        :disabled="!leftChecked.length"
        @click="addToRight">
        <el-icon><arrow-right /></el-icon>
      </el-button>
    </div>
    <transfer-panel
      ref="rightPanel"
      title="已选列表"
      :data="(targetData as TreeItem[])"
      :default-checked="rightChecked"
      :check-strictly="props.checkStrictly"
      :placeholder="props.placeholder"
      @checked-change="onTargetCheckedChange">
      <slot name="right-footer" />
    </transfer-panel>
  </div>
</template>
