

import { usePermissionStore, useRouterStore, useTabStore, useUserStore } from '@/stores'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    accessToken: undefined as string | undefined,
  }),
  actions: {
    setToken(data: string) {
      this.accessToken = data
    },
    resetToken() {
      this.$reset()
    },
    toLogin() {
      const { router, route } = useRouterStore()
      router.replace({
        path: '/login',
        query: route.query,
      })
    },
    async switchCurrentRole(data: string) {
      this.resetLoginState()
      await nextTick()
      this.setToken(data)
    },
    resetLoginState() {
      const { resetUser } = useUserStore()
      const { resetRouter } = useRouterStore()
      const { accessRoutes } = usePermissionStore()
      const { resetTabs } = useTabStore()
      // 重置路由
      resetRouter(accessRoutes)
      // 重置用户
      resetUser()

      // 重置Tabs
      resetTabs()
      // 重置token
      this.resetToken()
    },
    async logout() {
      this.resetLoginState()
      this.toLogin()
    },
  },
  persist: {
    key: 'vue-naivue-admin_auth',
  },
})
