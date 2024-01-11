<script setup lang="ts">
import { useUserStore } from '@/store/user';
import { showConfirmDialog } from 'vant';
import { calcResponseSize } from '@/utils/tool';

const userStore = useUserStore();
/**
 * 退出登录
 */
function logout() {
  showConfirmDialog({
    title: '提示',
    message: '您将清除缓存并退出登录。',
    confirmButtonText: '退出',
    cancelButtonText: '再看看',
  })
    .then(() => {
      userStore.logout();
    })
    .catch(() => {
      // on cancel
    });
}
</script>

<template>
  <AppLayout>
    <template #header>
      <AppNavBar :show-icon="false">
        <template #left>
          <div class="text-[var(--theme-text-color)] font-bold text-[30px]"
            >个人中心</div
          >
        </template>
      </AppNavBar>
    </template>
    <div class="h-[270px] bg-primary">
      <div class="flex items-center px-[40px] pt-[20px]">
        <img
          src="@/assets/vue.svg"
          class="w-[180px] h-[180px] object-fill"
          alt="" />
        <div class="ml-[40px] text-[var(--theme-reverse-color)]">
          <div class="text-[32px]">{{ userStore.userInfo?.nickname }}</div>
        </div>
      </div>
    </div>
    <div class="px-[40px] -mt-[30px]">
      <van-cell
        title="修改密码"
        is-link
        title-class="ml-[30px]"
        to="/update_password">
        <template #icon>
          <van-icon
            name="locked"
            class-prefix="iconfont"
            :size="calcResponseSize(30)"
            color="#007fff"></van-icon>
        </template>
      </van-cell>
    </div>
    <div class="fixed bottom-[300px] left-[30px] right-[30px]">
      <van-button type="primary" block @click="logout">退出登录</van-button>
    </div>
    <template #footer>
      <AppTabbar current="my"></AppTabbar>
    </template>
  </AppLayout>
</template>
