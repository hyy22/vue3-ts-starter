import { showToast } from 'vant';
import { type ResponseData } from './http';

/**
 * 判断是否响应成功
 */
export function isResponseOk<
  T = any,
  U extends ResponseData<T> = ResponseData<any>
>(resp: U) {
  return [0, 200].includes(resp.code);
}

/**
 * 响应处理
 */
export function handleResp<T = any>(
  resp: ResponseData<T>,
  fn?: (resp: ResponseData<T>['data']) => void
) {
  if (isResponseOk(resp)) {
    if (typeof fn === 'function') fn(resp.data);
    return;
  }
  showToast(resp.msg);
}
