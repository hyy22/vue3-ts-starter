import { ElMessage } from 'element-plus';
import { type ResponseData } from './http';

/**
 * 判断是否响应成功
 */
export function isResponseOk<T = any>(resp: ResponseData<T>) {
  return resp.code === 200;
}
/**
 * 处理响应
 */
export function handleResp<T = any>(
  resp: ResponseData<T>,
  fn: (resp: ResponseData<T>['data']) => void
) {
  if (isResponseOk(resp)) {
    fn(resp.data);
    return;
  }
  ElMessage.error(resp.msg);
}
