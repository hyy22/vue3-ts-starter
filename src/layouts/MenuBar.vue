<script setup lang="ts">
import { ref } from 'vue';
import { useUserStore } from '@/store/user';
import { useStateStore } from '@/store/state';
import UpdatePsw from '@/components/Auth/UpdatePsw.vue';
import useAuth from '@/components/Auth/useAuth';

const userStore = useUserStore();
const stateStore = useStateStore();
/**
 * 下拉操作
 */
const updatePswRef = ref<InstanceType<typeof UpdatePsw> | null>(null);
function showUpdatePasswordModal() {
  if (!updatePswRef.value) return;
  updatePswRef.value.show();
}
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

/**
 * 按钮操作
 */
function toggleSideBar() {
  stateStore.collapse = !stateStore.collapse;
}
function refresh() {
  location.reload();
}
function toggleFullScreen() {
  if (document.fullscreenElement) {
    document.exitFullscreen();
  } else {
    document.documentElement.requestFullscreen();
  }
}
</script>

<template>
  <div class="h-10 pr-4 pl-2 flex justify-between items-center bg-white">
    <div class="flex">
      <div class="menubar-icon" @click="toggleSideBar" title="切换侧边栏">
        <el-icon v-if="!stateStore.collapse"><Fold /></el-icon>
        <el-icon v-else><Expand /></el-icon>
      </div>
      <div class="menubar-icon ml-1" @click="refresh" title="刷新">
        <el-icon><RefreshRight /></el-icon>
      </div>
    </div>
    <div class="flex items-center" @click="toggleFullScreen" title="切换全屏">
      <div class="menubar-icon mr-3">
        <el-icon><FullScreen /></el-icon>
      </div>
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
            <el-dropdown-item command="UPDATE_PASSWORD"
              >修改密码</el-dropdown-item
            >
            <el-dropdown-item divided command="LOGOUT"
              >退出登录</el-dropdown-item
            >
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
  <!-- 修改密码弹窗 -->
  <UpdatePsw ref="updatePswRef" />
</template>

<style scoped>
.menubar-icon {
  @apply cursor-pointer p-1 flex items-center;
}
.menubar-icon:hover {
  @apply bg-gray-300;
}
</style>
