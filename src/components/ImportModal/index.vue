<script setup lang="ts">
import { nextTick, ref, reactive } from 'vue';
import { ElMessage, genFileId } from 'element-plus';
import type { UploadInstance, UploadProps, UploadRawFile } from 'element-plus';

export interface Props {
  // 模版下载
  onTemplateDownload?: () => void;
  // 上传
  onUpload: (
    file: UploadRawFile
  ) => Promise<void> | Promise<{ reasons?: any[] }>;
  // 接收文件类型
  accept?: string;
  // 标题
  title?: string;
}
const props = withDefaults(defineProps<Props>(), {
  accept: '.xlsx',
  title: '导入数据',
});
// 事件
const emit = defineEmits<{
  (e: 'success', val?: any): void;
  (e: 'fail', val: any): void;
}>();

// 文件上传
const uploadRef = ref<UploadInstance | null>(null);
const handleExceed: UploadProps['onExceed'] = files => {
  uploadRef.value?.clearFiles();
  const file = files[0] as UploadRawFile;
  file.uid = genFileId();
  uploadRef.value!.handleStart(file);
};
// 文件上传弹窗
const visible = ref(false);
function showModal() {
  visible.value = true;
  nextTick(() => {
    uploadRef.value?.clearFiles();
  });
}
// 加载状态
const importLoading = ref(false);
// 导入结果弹窗
const importFeedModal = reactive({
  visible: false,
  reasons: [] as any[],
});
// 导入方法
const handleHttpRequest: UploadProps['httpRequest'] = async options => {
  if (!options.file) return;
  try {
    importLoading.value = true;
    const { reasons = [] } =
      (await props.onUpload(options.file as UploadRawFile)) ?? {};
    importLoading.value = false;
    // 关闭弹窗
    visible.value = false;
    if (!reasons?.length) {
      emit('success');
      return ElMessage.success('导入成功');
    }
    emit('fail', reasons);
    // 显示导出结果
    importFeedModal.reasons = reasons;
    importFeedModal.visible = true;
  } catch (e: any) {
    ElMessage.error(e.message);
    importLoading.value = false;
  }
};
// 提交
async function submit() {
  uploadRef.value?.submit();
}
</script>

<template>
  <div v-if="$slots.trigger" class="inline-block" @click="showModal">
    <slot name="trigger">
      <el-button type="primary">导入文件</el-button>
    </slot>
  </div>
  <!-- 上传弹窗 -->
  <Modal v-model="visible" :title="props.title" width="450px">
    <ElUpload
      ref="uploadRef"
      action=""
      :accept="props.accept"
      :http-request="handleHttpRequest"
      :limit="1"
      :on-exceed="handleExceed"
      :auto-upload="false">
      <template #trigger>
        <el-button type="primary">选择文件</el-button>
      </template>
    </ElUpload>
    <!-- 下载模版 -->
    <el-button
      v-if="props.onTemplateDownload"
      type="primary"
      link
      @click="props.onTemplateDownload"
      >下载导入模版</el-button
    >
    <template #footer>
      <el-button :loading="importLoading" type="primary" @click="submit"
        >提交</el-button
      >
      <el-button @click="visible = false">取消</el-button>
    </template>
  </Modal>
  <!-- 上传失败 -->
  <Modal v-model="importFeedModal.visible" title="导入失败原因" width="450px">
    <slot name="reasons" :reasons="importFeedModal.reasons"></slot>
    <template #footer>
      <el-button type="primary" @click="importFeedModal.visible = false"
        >确定</el-button
      >
    </template>
  </Modal>
</template>
