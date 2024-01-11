<script setup lang="ts">
import { handleResp } from '@/api';
import { fetchUpdatePassword } from '@/api/auth';
import { calcResponseSize } from '@/utils/tool';
import { showSuccessToast } from 'vant';
import { reactive } from 'vue';
import { useUserStore } from '@/store/user';

const userStore = useUserStore();
const form = reactive({
  // 旧密码
  oldPassword: '',
  // 新密码
  newPassword: '',
  // 确认新密码
  confirmNewPassword: '',
});
async function submitUpdatePassword() {
  const resp = await fetchUpdatePassword({
    oldPwd: form.oldPassword,
    newPwd: form.newPassword,
  });
  handleResp(resp, () => {
    showSuccessToast('修改成功，请重新登录～');
    setTimeout(() => {
      userStore.logout();
    }, 1000);
  });
}
</script>

<template>
  <AppLayout>
    <template #header>
      <AppNavBar title="修改密码"></AppNavBar>
    </template>
    <div class="pt-[30px]">
      <van-form
        :label-width="calcResponseSize(130)"
        required
        @submit="submitUpdatePassword">
        <van-cell-group inset>
          <van-field
            v-model="form.oldPassword"
            type="password"
            label="旧密码"
            placeholder="请输入内容"
            :rules="[{ required: true, message: '请填写旧密码' }]" />
          <van-field
            v-model="form.newPassword"
            type="password"
            label="新密码"
            placeholder="请输入内容"
            :rules="[{ required: true, message: '请填写新密码' }]" />
          <van-field
            v-model="form.confirmNewPassword"
            type="password"
            label="再次输入"
            placeholder="请输入内容"
            :rules="[
              { required: true, message: '请确认新密码' },
              {
                validator: val => val === form.newPassword,
                message: '密码不一致',
              },
            ]" />
        </van-cell-group>
        <div class="mt-[30px] px-[30px]">
          <van-button round block type="primary" native-type="submit">
            保存
          </van-button>
        </div>
      </van-form>
    </div>
  </AppLayout>
</template>
