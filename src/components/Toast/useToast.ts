import { VNode, createVNode, render } from 'vue';
import Toast, { ToastOptions } from './index.vue';

let vnode: VNode;
function useToast(msg: string): void;
function useToast(opts: ToastOptions): void;
function useToast(arg: string | ToastOptions): void {
  // 挂载节点
  const root = document.body;
  // 如果存在，先销毁
  if (vnode) {
    render(null, root);
  }
  let options: ToastOptions;
  if (typeof arg === 'string') {
    options = { title: arg };
  } else {
    options = arg;
  }
  vnode = createVNode(Toast, {
    ...options,
  });
  render(vnode, root);
}

export default useToast;
