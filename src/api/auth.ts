// import request from './http';

// 用户密码登录
interface FetchLoginByAccountParams {
  username: string;
  password: string;
}
export function fetchLoginByAccount(params: FetchLoginByAccountParams) {
  console.log('params', params);
  return Promise.resolve({
    code: 200,
    data: {
      token: '123',
      userInfo: {
        id: 1,
        nickname: 'admin',
        user: 'test',
      },
    },
    message: '',
  });
  // return request({ url: '/auth/login', method: 'POST', params, loading: true });
}

// 修改密码
interface FetchUpdatePasswordParams {
  oldPassword: string;
  newPassword: string;
}
export function fetchUpdatePassword(params: FetchUpdatePasswordParams) {
  console.log('params', params);
  return Promise.resolve({
    code: 200,
    data: {},
    message: '',
  });
}
