import { ElMessage } from 'element-plus';
import { saveAs } from 'file-saver';
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
  fn?: (resp: ResponseData<T>['data']) => void
) {
  if (isResponseOk(resp)) {
    if (typeof fn === 'function') fn(resp.data);
    return;
  }
  ElMessage.error(resp.msg);
}
/**
 * 处理blob格式响应
 * @param resp
 * @param name
 * @returns
 */
export async function handleBlobResponse(resp: Blob, name: string) {
  if (resp instanceof Blob) {
    if (resp.type === 'application/json') {
      const text = await resp.text();
      try {
        const data = JSON.parse(text);
        handleResp(data);
      } catch {
        ElMessage.error(text ?? '未知错误');
      }
      return;
    }
    saveAs(resp, name);
  }
}
