<template>
  <AppCard
    class="flex items-center px-12"
    border-b="1px solid light_border dark:dark_border"
  >
    <MenuCollapse />

    <AppTab class="w-0 flex-1 px-12" />

    <span class="mx-6 opacity-20">|</span>

    <div class="flex flex-shrink-0 items-center px-12 text-18">
      <i
        class="mr-16 cursor-pointer"
        :class="isDark ? 'i-fe:moon' : 'i-fe:sun'"
        @click="toggleDark"
      />
      <i
        class="mr-16 cursor-pointer"
        :class="isFullscreen ? 'i-fe:minimize' : 'i-fe:maximize'"
        @click="toggle"
      />

      <ThemeSetting class="mr-16" />

      <UserAvatar />
    </div>
  </AppCard>
</template>

<script setup>
  import { AppTab, MenuCollapse, UserAvatar } from '@/layouts/components'
  import { useAppStore } from '@/stores'
  import { useDark, useFullscreen, useToggle } from '@vueuse/core'

  const appStore = useAppStore()
  const isDark = useDark()
  function toggleDark() {
    appStore.toggleDark()
    useToggle(isDark)()
  }

  const { isFullscreen, toggle } = useFullscreen()

  // function handleLinkClick(link) {
  //   window.open(link)
  // }

  watchEffect(() => {
    appStore.setThemeColor(appStore.primaryColor, appStore.isDark)
  })
</script>
