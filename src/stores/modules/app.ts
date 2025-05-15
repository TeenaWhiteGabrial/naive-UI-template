import { useDark } from '@vueuse/core'
import { defineStore } from 'pinia'
//  颜色选择器
import { generate, getRgbStr } from '@arco-design/color'
// 默认设置
import { defaultLayout, defaultPrimaryColor, naiveThemeOverrides } from '@/settings'

export const useAppStore = defineStore('app', {
  state: () => ({
    // 左侧菜单栏伸缩状态
    collapsed: false,
    // 黑夜模式
    isDark: useDark(),
    // 全局样式
    layout: defaultLayout,
    // 主题色
    primaryColor: defaultPrimaryColor,
    // naiveUI 主题
    naiveThemeOverrides
  }),
  actions: {
    // 切换左侧菜单栏伸缩状态
    switchCollapsed() {
      this.collapsed = !this.collapsed
    },
    // 设置左侧菜单栏伸缩状态
    setCollapsed(b: boolean) {
      this.collapsed = b
    },
    // 切换日夜模式
    toggleDark() {
      this.isDark = !this.isDark
    },
    // 设置全局布局模式
    setLayout(layout: string) {
      this.layout = layout
    },
    // 设置Primary色
    setPrimaryColor(color: string) {
      this.primaryColor = color
    },
    // 设置 naiveUI 主题色
    setThemeColor(color: string, isDark: boolean) {
      const colors = generate(color, {
        list: true,
        dark: isDark,
      })
      document.body.style.setProperty('--primary-color', getRgbStr(colors[5]))
      this.naiveThemeOverrides.common = Object.assign(this.naiveThemeOverrides.common || {}, {
        primaryColor: colors[5],
        primaryColorHover: colors[4],
        primaryColorSuppl: colors[4],
        primaryColorPressed: colors[6],
      })
    }
  },
  persist: {
    storage: sessionStorage,
    // @ts-ignore
    // pick: ['collapsed', 'layout', 'primaryColor', 'naiveThemeOverrides'],
  }
  // // 持久化存储
  // persist: {
  //   paths: ['collapsed', 'isDark', 'layout', 'primaryColor', 'naiveThemeOverrides'],
  //   storage: sessionStorage,
  // }
})
