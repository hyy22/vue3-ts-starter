import { ElMessageBox } from 'element-plus';
import { useUserStore } from '@/store/user';

export default function useAuth() {
  async function logout() {
    try {
      await ElMessageBox.confirm('确认退出登录？', '提示', {
        type: 'warning',
        cancelButtonText: '取消',
        confirmButtonText: '确认',
      });
    } catch {
      return;
    }
    const userStore = useUserStore();
    userStore.logout();
  }
  return {
    logout,
  };
}
