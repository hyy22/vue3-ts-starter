<script lang="ts">
export default {
  inheritAttrs: false,
};
</script>

<script setup lang="ts">
const props = defineProps({
  pageSizes: {
    type: Array,
    default: () => [10, 20, 50, 100],
  },
});
const emit = defineEmits(['change', 'update:current-page', 'update:page-size']);
function handleCurrentPageChange(page: number) {
  emit('update:current-page', page);
  emit('change');
}
function handleSizeChange(size: number) {
  emit('update:page-size', size);
  emit('change');
}
</script>

<template>
  <div class="pagination">
    <el-pagination
      background
      small
      layout="total,prev,pager,next,sizes,jumper"
      :page-sizes="props.pageSizes"
      v-bind="$attrs"
      @update:current-page="handleCurrentPageChange"
      @update:page-size="handleSizeChange" />
  </div>
</template>
