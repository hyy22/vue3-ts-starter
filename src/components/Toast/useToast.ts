import { VNode, createVNode, render } from 'vue';
import Toast, { ToastOptions } from './index.vue';

// 存储所有vnode
let vnodes: VNode[] = [];
// 移除vnode
function removeVNode(vnode?: VNode) {
  if (!vnode) vnodes = [];
  const index = vnodes.indexOf(vnode!);
  if (index > -1) vnodes.splice(index, 1);
}
function useToast(msg: string): void;
function useToast(opts: ToastOptions): void;
function useToast(arg: string | ToastOptions): void {
  // 挂载节点
  const root = document.body;
  // 容器
  const container = document.createElement('div');
  // 如果存在，先销毁
  if (vnodes.length) {
    vnodes.forEach(vnode => {
      vnode.component?.exposed?.close();
      render(null, container);
    });
    removeVNode();
  }
  let options: ToastOptions;
  if (typeof arg === 'string') {
    options = { title: arg };
  } else {
    options = arg;
  }
  const vnode = createVNode(Toast, {
    ...options,
    onDestroy: () => {
      render(null, container);
      removeVNode(vnode);
    },
  });
  render(vnode, container);
  root.appendChild(container.firstElementChild!);
  vnodes.push(vnode);
}

export default useToast;
