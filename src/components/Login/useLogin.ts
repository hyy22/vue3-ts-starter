import { createApp } from 'vue';
import Login from './index.vue';
import { applyElementStyleSetting } from '@/utils/tool';

// 弹窗容器
function createLoginContainer() {
  let container = document.createElement('div');
  applyElementStyleSetting(container, {
    position: 'fixed',
    inset: '0',
    zIndex: '9000',
    background: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(8px)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  });
  let formContainer = document.createElement('div');
  applyElementStyleSetting(formContainer, {
    width: '400px',
  });
  container.appendChild(formContainer);
  document.body.appendChild(container);
  return {
    container,
    removeContainer: () => {
      document.body.removeChild(container);
      // @ts-ignore
      container = null;
      // @ts-ignore
      formContainer = null;
    },
  };
}

// 单例模式
let promise: Promise<string> | null = null;
export function useLogin() {
  if (promise) return promise;
  promise = new Promise((resolve, reject) => {
    // 显示登录弹窗
    const { container, removeContainer } = createLoginContainer();
    const loginApp = createApp(Login, {
      showClose: true,
      onClose: () => {
        loginApp.unmount();
        removeContainer();
        reject('cancel');
        promise = null;
      },
      onLoginSucceed: () => {
        loginApp.unmount();
        removeContainer();
        resolve('success');
        promise = null;
      },
    });
    loginApp.mount(container);
  });
  return promise;
}
