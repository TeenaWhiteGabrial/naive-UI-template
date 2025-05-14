<template>
  <!-- 全局化配置 -->
  <NConfigProvider
   class="w-full"
   :locale="zhCN"
   :dateLocale="dateZhCN"
   :theme="appStore.isDark ? darkTheme : undefined"
   :theme-overrides="appStore.naiveThemeOverrides"
   >
    <router-view v-if="Layout" v-slot="{ Component, route: curRoute }">
      <component :is="Layout">
        <KeepAlive :include="keepAliveNames">
          <component :is="Component" v-if="!tabStore.reloading" :key="curRoute.fullPath" />
        </KeepAlive>
      </component>
    </router-view>
  </NConfigProvider>
</template>

<script setup lang="ts">
  import { useAppStore, useTabStore } from '@/stores'
  import { NConfigProvider, darkTheme, dateZhCN, zhCN } from 'naive-ui'

  // 获取布局组件
  const layouts = new Map<string, any>()
  function getLayout(name: string) {
    if (layouts.has(name)) {
      return layouts.get(name)
    }

    // 这里使用了defineAsyncComponent异步组件的方式来加载布局
    // 这样可以避免在打包时将所有布局都打包进来
    // 这里使用了 markRaw 来避免 Vue 的响应式系统对布局组件进行代理
    // 这样可以避免布局组件的性能问题
    const layout = markRaw(defineAsyncComponent(() => import(`@/layouts/${name}/index.vue`)))
    layouts.set(name, layout)
    return layout
  }

  const appStore = useAppStore()
  // if (appStore.layout === 'default') {
  //   appStore.layout = ''
  // }
  const route = useRoute()
  const Layout = computed(() => {
    if (!route.matched?.length) {
      return null
    } else {
      // TODO: route.meta?.layout属性  应当优先于 appStore.layout
      return getLayout(appStore.layout)
    }
  })

  const tabStore = useTabStore()
  const keepAliveNames = computed(() => {
    return tabStore.tabs.filter(item => item.keepAlive).map(item => item.name)
  })

  watchEffect(() => {
    appStore.setThemeColor(appStore.primaryColor, appStore.isDark)
  })

</script>


<style scoped></style>
