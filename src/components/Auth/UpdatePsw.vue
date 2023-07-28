<script setup lang="ts">
import { ElMessage, type FormInstance, type FormRules } from 'element-plus';
import { nextTick, reactive, ref } from 'vue';
import { useUserStore } from '@/store/user';
import { fetchUpdatePassword } from '@/api/auth';

const updatePasswordModalData = () => ({
  visible: false,
  oldPsw: '',
  newPsw: '',
  repeatNewPsw: '',
});
const updatePasswordModal = reactive(updatePasswordModalData());
const updatePasswordFormRules: FormRules<
  ReturnType<typeof updatePasswordModalData>
> = reactive({
  oldPsw: { required: true, message: '旧密码不能为空', trigger: 'blur' },
  newPsw: { required: true, message: '新密码不能为空', trigger: 'blur' },
  repeatNewPsw: [
    { required: true, message: '确认密码不能为空', trigger: 'blur' },
    {
      validator: (_rule, value, callback) => {
        if (value !== updatePasswordModal.newPsw) {
          return callback(new Error('确认密码和新密码不一致'));
        }
        callback();
      },
    },
  ],
});
const updatePasswordFormRef = ref<FormInstance | null>(null);
function showUpdatePasswordModal() {
  Object.assign(updatePasswordModal, updatePasswordModalData(), {
    visible: true,
  });
  nextTick(() => {
    if (updatePasswordFormRef.value)
      updatePasswordFormRef.value.clearValidate();
  });
}
function submitUpdatePasswordModal() {
  if (!updatePasswordFormRef.value) return;
  updatePasswordFormRef.value.validate(async valid => {
    if (!valid) return;
    const { oldPsw, newPsw } = updatePasswordModal;
    const resp = await fetchUpdatePassword({
      oldPassword: oldPsw,
      newPassword: newPsw,
    });
    if (resp.code !== 200) return ElMessage.error(resp.message);
    // 修改成功后，重新登录
    ElMessage.success('密码修改成功，请重新登录～');
    setTimeout(() => {
      const userStore = useUserStore();
      userStore.logout();
    });
  });
}
defineExpose({
  show: showUpdatePasswordModal,
});
</script>

<template>
  <Modal v-model="updatePasswordModal.visible" title="修改密码" width="400px">
    <el-form
      ref="updatePasswordFormRef"
      :model="updatePasswordModal"
      :rules="updatePasswordFormRules"
      label-width="80px">
      <el-form-item label="旧密码" prop="oldPsw">
        <el-input
          v-model.trim="updatePasswordModal.oldPsw"
          type="password"
          show-password></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPsw">
        <el-input
          v-model.trim="updatePasswordModal.newPsw"
          type="password"
          show-password></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="repeatNewPsw">
        <el-input
          v-model.trim="updatePasswordModal.repeatNewPsw"
          type="password"
          show-password></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="updatePasswordModal.visible = false">取消</el-button>
      <el-button type="primary" @click="submitUpdatePasswordModal"
        >确定</el-button
      >
    </template>
  </Modal>
</template>
