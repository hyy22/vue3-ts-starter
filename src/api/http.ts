import axios, {
  AxiosInstance,
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import { useUserStore } from '@/store/user';
import { showToast, showLoadingToast } from 'vant';
import { debounce } from '@/utils/tool';

export interface AxiosRequestConfigExtra {
  // 是否显示loading
  loading?: boolean | string;
  // 是否允许重复请求
  allowMultiple?: boolean;
}
export type HttpRequestConfig = AxiosRequestConfig & AxiosRequestConfigExtra;

let loadingCount = 0; // 需要loading的请求个数
const requestQueueMap = new Map(); // 请求map队列
const service: AxiosInstance = axios.create({
  timeout: import.meta.env.VITE_API_TIME_OUT, // 超时时长
  baseURL: import.meta.env.BASE_URL, // 请求地址
});
/**
 * loading处理
 */
interface Loading {
  setText: (msg: string) => void;
  close: () => void;
}
interface LoadingUtil {
  loadingInstance: null | Loading;
  show: (msg: string) => void;
  close: () => void;
}
// 创建loading实例
function createLoadingInstance(msg: string): Loading {
  const loadingInstance = showLoadingToast({
    forbidClick: true,
    message: msg,
  });
  return {
    setText: (msg: string) => {
      loadingInstance.message = msg;
    },
    close: () => {
      loadingInstance.close();
    },
  };
}
const loadingUtil: LoadingUtil = {
  loadingInstance: null,
  show(msg: string) {
    if (this.loadingInstance) {
      this.loadingInstance.setText(msg);
    } else {
      this.loadingInstance = createLoadingInstance(msg);
    }
  },
  close() {
    this.loadingInstance?.close();
    this.loadingInstance = null;
  },
};

/**
 * 请求队列map key生成规则
 * @param {HttpRequestConfig} config 请求
 * @returns {string}
 */
function buildReqKey(config: HttpRequestConfig): string {
  return JSON.stringify({
    url: config.url,
    method: config.method,
    params: config.params,
    data: config.data,
  });
}
/**
 * 请求完成或者失败处理
 * @param {HttpRequestConfig} config 请求
 */
function handleRequestComplete(config: HttpRequestConfig) {
  const reqKey = buildReqKey(config);
  // 处理loading
  if (config.loading) {
    loadingCount--;
  }
  if (loadingCount <= 0) {
    loadingUtil.close();
  }
  // 处理queue
  requestQueueMap.delete(reqKey);
}
/**
 * 请求拦截
 */
service.interceptors.request.use(
  config => {
    const reqKey = buildReqKey(config);
    // 类型转换
    const httpConfig: HttpRequestConfig = config;
    // 去重
    if (!httpConfig.allowMultiple && requestQueueMap.has(reqKey)) {
      requestQueueMap.get(reqKey).controller?.abort?.();
    }
    const controller = new AbortController();
    httpConfig.signal = controller.signal; // 添加中断信号
    requestQueueMap.set(reqKey, { controller });
    // loading
    if (httpConfig.loading) {
      loadingCount++;
      const loadingText =
        typeof httpConfig.loading === 'string'
          ? httpConfig.loading
          : '加载中...';
      loadingUtil.show(loadingText);
    }
    // 设置token
    const userStore = useUserStore();
    if (userStore.token) {
      // TODO:设置token可能需要更改
      Object.assign(config.headers, {
        token: userStore.token,
      });
    }
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);
/**
 * 添加公共参数
 */
// function addCommonParams(config: AxiosRequestConfig, params: ObjectType) {
//   if (config.method?.toUpperCase() === 'GET') {
//     config.params = { ...params, ...config.params };
//   } else if (config.data instanceof FormData) {
//     for (const key in params) {
//       if (!config.data.has(key)) {
//         config.data.append(key, params[key]);
//       }
//     }
//   } else {
//     config.data = { ...params, ...config.data };
//   }
// }

const debounceToast = debounce(showToast, 500);
/**
 * 响应拦截
 */
service.interceptors.response.use(
  (response: AxiosResponse) => {
    // TODO:code处理
    // token续签
    return response.data;
  },
  (error: AxiosError) => {
    if (error.response) {
      const { status } = error.response;
      switch (status) {
        case 401:
          // do sth
          break;
        case 403:
          // do sth
          break;
        case 404:
          // do sth
          break;
        case 500:
          // do sth
          break;
        case 502:
          // do sth
          break;
      }
    }
    debounceToast('网络请求失败，请稍后重试');
    return Promise.reject(error);
  }
);
// 定义接口返回结构
export interface ResponseData<T> extends ObjectType {
  code: number;
  msg: string;
  data: T;
}
export default async function request<T = any>(config: HttpRequestConfig) {
  try {
    const response: ResponseData<T> = await service(config);
    return response;
  } finally {
    // 处理loading和queue
    handleRequestComplete(config);
  }
}
