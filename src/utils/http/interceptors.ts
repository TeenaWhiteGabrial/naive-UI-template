import { useAuthStore } from '@/stores';
import type { AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { resolveResError } from './helpers';

export function setupInterceptors(axiosInstance: AxiosInstance) {
  function reqResolve(config: InternalAxiosRequestConfig & {
    noNeedToken?: boolean
  }) {
    // 处理不需要token的请求
    if (config.noNeedToken) {
      return config
    }

    const { accessToken } = useAuthStore()
    if (accessToken) {
      config.headers.Authorization = `${accessToken}`
    }

    return config
  }

  function reqReject(error: any) {
    return Promise.reject(error)
  }

  const SUCCESS_CODES = [0, 200]
  function resResolve(response: { data: any; status: any; config: any; statusText: any; headers: any; }) {
    const { data, status, config, statusText, headers } = response
    if (headers['content-type']?.includes('json')) {
      if (SUCCESS_CODES.includes(data?.code)) {
        return Promise.resolve(data)
      }
      const code = data?.code ?? status

      // 根据code处理对应的操作，并返回处理后的message
      const message = resolveResError(code, data?.msg ?? statusText)

      // 需要错误提醒
      !config?.noNeedTip && message && window.$message?.error(message)
      return Promise.reject({ code, message, error: data ?? response })
    }
    return Promise.resolve(data ?? response)
  }

  async function resReject(error: { response: { data: any; status?: any; config?: any; }; code: any; message: string; }) {
    if (!error || !error.response) {
      const code = error?.code
      /** 根据code处理对应的操作，并返回处理后的message */
      const message = resolveResError(code, error.message) || '未知异常'
      window.$message?.error(message)
      return Promise.reject({ code, message, error })
    }

    const { data, status, config } = error.response
    const code = data?.code ?? status

    const message = resolveResError(code, data?.message ?? error.message)
    /** 需要错误提醒 */
    !config?.noNeedTip && message && window.$message?.error(message)
    return Promise.reject({ code, message, error: error.response?.data || error.response })
  }

  axiosInstance.interceptors.request.use(reqResolve, reqReject)
  axiosInstance.interceptors.response.use(resResolve, resReject)
}
