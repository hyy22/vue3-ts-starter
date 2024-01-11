import { type ResponseData } from './http';

export interface FetchUserMenuListResp {
  /**
   * 权限
   */
  title: string;
}
export function fetchUserMenuList() {
  return Promise.resolve<ResponseData<FetchUserMenuListResp[]>>({
    code: 0,
    msg: 'success',
    data: [{ title: '1' }],
  });
}
