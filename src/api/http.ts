import { ObjectType } from '@/types/utils';
import axios, {
  AxiosInstance,
  AxiosError,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from 'axios';
import { useUserStore } from '@/store/user';

export interface AxiosRequestConfigExtra {
  // 是否显示loading
  loading?: boolean | string;
  // 是否允许重复请求
  allowMultiple?: boolean;
}
export type HttpRequestConfig = InternalAxiosRequestConfig &
  AxiosRequestConfigExtra;

let loadingCount = 0; // 需要loading的请求个数
const requestQueueMap = new Map(); // 请求map队列
const service: AxiosInstance = axios.create({
  timeout: import.meta.env.VITE_API_TIME_OUT, // 超时时长
  baseURL: import.meta.env.VITE_API_BASE_URL, // 请求地址
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
// TODO:创建loading实例待实现
function createLoadingInstance(msg: string) {
  console.log(msg);
  return null;
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
  (config: HttpRequestConfig) => {
    const reqKey = buildReqKey(config);
    // 去重
    if (!config.allowMultiple && requestQueueMap.has(reqKey)) {
      requestQueueMap.get(reqKey).controller?.abort?.();
    }
    const controller = new AbortController();
    config.signal = controller.signal; // 添加中断信号
    requestQueueMap.set(reqKey, { controller });
    // loading
    if (config.loading) {
      loadingCount++;
      const loadingText =
        typeof config.loading === 'string' ? config.loading : '加载中...';
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
 * 响应拦截
 */
service.interceptors.response.use(
  (response: AxiosResponse) => {
    // TODO:code处理
    // token续签
    return response;
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
    return Promise.reject(error);
  }
);

// 定义接口返回结构
interface ResponseData<T> extends ObjectType {
  code: number | string;
  msg?: string;
  data: T;
}
export default async function request<T>(
  config: HttpRequestConfig
): Promise<ResponseData<T>> {
  try {
    const response = await service(config);
    return response.data;
  } finally {
    // 处理loading和queue
    handleRequestComplete(config);
  }
}
