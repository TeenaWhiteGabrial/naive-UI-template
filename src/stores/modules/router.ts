import type { RouteRecordRaw } from 'vue-router'

export const useRouterStore = defineStore('router', () => {
  const router = useRouter()
  const route = useRoute()

  function resetRouter(accessRoutes: RouteRecordRaw[]) {
    accessRoutes.forEach((item) => {
      if (item.name) {
        router.hasRoute(item.name) && router.removeRoute(item.name)
      }
    })
  }

  return {
    router,
    route,
    resetRouter,
  }
})
