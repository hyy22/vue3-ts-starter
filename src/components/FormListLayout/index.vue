<script setup lang="ts">
interface Props {
  page?: Page | boolean;
}
const props = withDefaults(defineProps<Props>(), {
  page: false,
});
const emit = defineEmits<{
  (e: 'page-change', val: Page): void;
}>();

/**
 * 分页
 */
function onPageCurrentChange(e: number) {
  onPageChange({ current: e });
}
function onPageSizeChange(e: number) {
  onPageChange({ pageSize: e });
}
function onPageChange(p: Partial<Page>) {
  const page = Object.assign({}, props.page as Page, p);
  emit('page-change', page);
}
</script>

<template>
  <div class="p-5 flex flex-col h-full">
    <!-- 表单 -->
    <slot name="form"></slot>
    <!-- 操作栏 -->
    <div class="flex-none flex" v-if="$slots.operation?.()?.length">
      <slot name="operation"></slot>
    </div>
    <!-- 表格 -->
    <div class="flex-1 mt-4 flex flex-col overflow-y-auto">
      <slot name="table"></slot>
    </div>
    <!-- 分页 -->
    <div class="mt-4 flex justify-end" v-if="typeof props.page === 'object'">
      <Page
        :current-page="props.page.current"
        :page-size="props.page.pageSize"
        :total="props.page.total"
        @current-change="onPageCurrentChange"
        @size-change="onPageSizeChange" />
    </div>
  </div>
</template>
