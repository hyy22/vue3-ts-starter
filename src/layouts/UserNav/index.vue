<script setup lang="ts">
import { ref } from 'vue';
import useAuth from './useAuth';
import UpdatePsw from './UpdatePsw.vue';
import { useUserStore } from '@/store/user';

const userStore = useUserStore();
const { logout } = useAuth();
function handleCommand(name: 'UPDATE_PASSWORD' | 'LOGOUT') {
  switch (name) {
    case 'UPDATE_PASSWORD':
      showUpdatePasswordModal();
      break;
    case 'LOGOUT':
      logout();
      break;
    default:
  }
}
const updatePswRef = ref<InstanceType<typeof UpdatePsw> | null>(null);
function showUpdatePasswordModal() {
  if (!updatePswRef.value) return;
  updatePswRef.value.show();
}
</script>

<template>
  <el-dropdown @command="handleCommand">
    <div
      class="flex p-1 rounded-md text-white"
      style="background: var(--primary-color)">
      <span>{{ userStore.userInfo?.nickname }}</span>
      <el-icon class="el-icon--right">
        <ArrowDown />
      </el-icon>
    </div>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item command="UPDATE_PASSWORD">修改密码</el-dropdown-item>
        <el-dropdown-item divided command="LOGOUT">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
  <!-- 修改密码弹窗 -->
  <UpdatePsw ref="updatePswRef" />
</template>
