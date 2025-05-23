import { useAuthStore } from '@/stores'

let isConfirming = false
export function resolveResError(code: number, message: string) {
  switch (code) {
    case 401:
      if (isConfirming)
        return
      isConfirming = true
      window.$dialog.warning({
        title: '提示',
        type: 'info',
        content: '登录已过期，是否重新登录？',
        positiveText: '重新登录',
        negativeText: '取消',
        onPositiveClick() {
          useAuthStore().logout()
          window.$message?.success('已退出登录')
          isConfirming = false
        },
        onNegativeClick() {
          isConfirming = false
        },
      })
      return false
    case 11007:
    case 11008:
      if (isConfirming)
        return
      isConfirming = true
      window.$dialog.warning({
        title: '提示',
        type: 'info',
        content: '登录已过期，是否重新登录？',
        positiveText: '重新登录',
        negativeText: '取消',
        onPositiveClick() {
          useAuthStore().logout()
          window.$message?.success('已退出登录')
          isConfirming = false
        },
        onNegativeClick() {
          isConfirming = false
        },
      })
      return false
    case 403:
      message = '请求被拒绝'
      break
    case 404:
      message = '请求资源或接口不存在'
      break
    case 500:
      message = '服务器发生异常'
      break
    default:
      message = message ?? `【${code}】: 未知异常!`
      break
  }
  return message
}
