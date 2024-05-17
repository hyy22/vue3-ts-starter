import { type MaybeRef, unref } from 'vue';

const isWindow = (val: unknown): val is Window => val === window;
const makeDomRect = (width: number, height: number) =>
  ({
    width,
    height,
    top: 0,
    left: 0,
    right: width,
    bottom: height,
  } as DOMRect);
export function useRect(target: MaybeRef<Element | Window | undefined>) {
  const element = unref(target);
  if (isWindow(element)) {
    return makeDomRect(window.innerWidth, window.innerHeight);
  }
  if (element?.getBoundingClientRect) {
    return element.getBoundingClientRect();
  }
  return makeDomRect(0, 0);
}
