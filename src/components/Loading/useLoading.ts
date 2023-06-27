import { createVNode, render } from 'vue';
import Loading, { Props } from './index.vue';

interface LoadingInstance {
  setText(text: string): void;
  close: () => void;
}
let loadingInstance: LoadingInstance | null;
export default function useLoading(props?: Props) {
  if (loadingInstance) return loadingInstance;
  const root = document.body;
  const container = document.createElement('div');
  const vnode = createVNode(Loading, { ...props });
  render(vnode, container);
  root.appendChild(container);
  loadingInstance = {
    setText(text: string) {
      vnode.component!.props.text = text;
    },
    close() {
      vnode.component?.exposed?.close?.();
      render(null, container);
      root.removeChild(container);
      loadingInstance = null;
    },
  };
  return loadingInstance;
}
