<script setup lang="ts">
import { computed, ref, useSlots, watch } from 'vue';
import { Search } from '@element-plus/icons-vue';
import type { ElTree } from 'element-plus';
import { tree2List, TreeItem } from '@/utils/tree';

interface Prop {
  title: string;
  data: TreeItem[];
  defaultChecked: (string | number)[];
  placeholder?: string;
  checkStrictly?: boolean;
}
const props = withDefaults(defineProps<Prop>(), {
  placeholder: '',
  checkStrictly: false,
});
const emit = defineEmits<{
  (e: 'checked-change', keys: (string | number)[]): void;
}>();
// 筛选
const treeRef = ref<InstanceType<typeof ElTree> | null>(null);
const query = ref('');
function filterMethod(val: string, data: any) {
  return data.label.includes(val);
}
watch(
  () => query.value,
  val => {
    treeRef.value?.filter(val);
  }
);
// 选择项
const dataList = computed(() => tree2List(props.data, !props.checkStrictly));
const checkedSummary = computed(() => {
  return `${props.defaultChecked.length}/${dataList.value.length}`;
});
function handleCheck() {
  const checkedKeys = treeRef.value?.getCheckedKeys(true);
  console.log('handleCheck', checkedKeys);
  emit('checked-change', [...(checkedKeys as (string | number)[])]);
}
// 更新tree组件勾选ui
watch(
  () => props.defaultChecked,
  val => {
    treeRef.value?.setCheckedKeys([...val]);
  }
);
const allChecked = computed({
  get() {
    return (
      props.defaultChecked.length &&
      props.defaultChecked.length === dataList.value.length
    );
  },
  set(val) {
    if (val) {
      emit(
        'checked-change',
        dataList.value.map(v => v.id)
      );
    } else {
      emit('checked-change', []);
    }
  },
});
const isIndeterminate = computed(() => {
  return (
    props.defaultChecked.length > 0 &&
    props.defaultChecked.length < dataList.value.length
  );
});

const slots = useSlots();
const hasFooter = computed(() => !!slots.default!()[0].children?.length);
</script>

<template>
  <div class="el-transfer-panel">
    <p class="el-transfer-panel__header">
      <el-checkbox
        v-model="allChecked"
        :indeterminate="isIndeterminate"
        :validate-event="false">
        {{ props.title }}
        <span>{{ checkedSummary }}</span>
      </el-checkbox>
    </p>

    <div class="el-transfer-panel__body">
      <el-input
        v-model="query"
        class="el-transfer-panel__filter"
        size="default"
        :placeholder="props.placeholder"
        :prefix-icon="Search"
        clearable
        :validate-event="false" />
      <!-- tree -->
      <div class="el-transfer-panel__list is-filterable">
        <el-tree
          ref="treeRef"
          :data="data"
          :default-checked-keys="props.defaultChecked"
          empty-text="暂无数据"
          show-checkbox
          check-on-click-node
          :check-strictly="props.checkStrictly"
          node-key="id"
          :expand-on-click-node="false"
          :filter-node-method="filterMethod"
          @check="handleCheck" />
      </div>
    </div>
    <p v-if="hasFooter" class="el-transfer-panel__footer">
      <slot />
    </p>
  </div>
</template>
