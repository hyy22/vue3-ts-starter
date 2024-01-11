import request, { type ResponseData } from './http';

/**
 * 用户密码登录
 */
interface FetchLoginByAccountParams {
  userName: string;
  password: string;
}
export interface FetchLoginByAccountResponse extends ObjectType {
  id: number;
  nickname: string;
  token: string;
}
export function fetchLoginByAccount(params: FetchLoginByAccountParams) {
  console.log(params);
  return Promise.resolve<ResponseData<FetchLoginByAccountResponse>>({
    code: 0,
    msg: 'success',
    data: {
      id: 1,
      nickname: '测试',
      token: '1234567890',
    },
  });
}

/**
 * 修改密码
 */
export interface FetchUpdatePasswordParams {
  // 新密码
  newPwd?: string;
  // 老密码
  oldPwd?: string;
}
export function fetchUpdatePassword(params: FetchUpdatePasswordParams) {
  return request({
    url: '/auth/user/editPwd',
    method: 'POST',
    data: params,
  });
}
