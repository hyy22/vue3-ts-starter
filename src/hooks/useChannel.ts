import { onBeforeUnmount } from 'vue';
import eventbus from '@/utils/eventbus';

export default function useChannel(name: string) {
  function on(type: string, cb: FunctionType) {
    eventbus.on(name + ':' + type, cb);
    // 移除监听
    onBeforeUnmount(() => {
      eventbus.off(name + ':' + type, cb);
    });
  }
  function trigger(type: string, ...args: any[]) {
    eventbus.emit(name + ':' + type, ...args);
  }
  return {
    on,
    trigger,
  };
}
