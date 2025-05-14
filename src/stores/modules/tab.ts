/**
 * 标签页
 * @module tab
 * @description 标签页相关的store
 */

import { useRouterStore } from './router'
// tab类型定义
interface TabItem {
  name: string,
  path?: string,
  affix?: boolean
  keepAlive?: boolean
}

export const useTabStore = defineStore('tab', {
  state: () => ({
    tabs: [] as TabItem[],
    activeTab: '',
    reloading: false,
  }),
  // 在 Pinia 的选项式 API 中， getters 对象内的方法默认不能直接访问 state 中的属性。
  getters: {
    activeIndex(state) {
      return state.tabs.findIndex(item => item.path === this.activeTab)
    },
  },
  actions: {
    async setActiveTab(pathValue: string) {
      await nextTick() // tab栏dom更新完再设置激活，让tab栏定位到新增的tab上生效
      this.activeTab = pathValue
    },
    setTabs(tabs: TabItem[]) {
      this.tabs = tabs
    },
    // 增加标签页，在打开新标签页时调用
    addTab(tab: TabItem) {
      const findIndex = this.tabs.findIndex(item => item.path === tab.path)
      if (findIndex !== -1) {
        this.tabs.splice(findIndex, 1, tab)
      }
      else {
        this.setTabs([...this.tabs, tab])
      }
      this.setActiveTab(tab.path || '')
    },
    // 重新加载标签页
    async reloadTab(path: string, keepAlive: boolean) {
      const findItem = this.tabs.find(item => item.path === path)
      if (!findItem)
        return
      // 更新key可让keepAlive失效
      if (keepAlive)
        findItem.keepAlive = false
      window.$loadingBar.start()
      this.reloading = true
      await nextTick()
      this.reloading = false
      findItem.keepAlive = !!keepAlive
      setTimeout(() => {
        document.documentElement.scrollTo({ left: 0, top: 0 })
        window.$loadingBar.finish()
      }, 100)
    },
    // 关闭当前标签页
    async removeTab(path: string) {
      this.setTabs(this.tabs.filter(tab => tab.path !== path))
      if (path === this.activeTab) {
        // 首先检查 tabs 数组是否还有元素
        if (this.tabs.length > 0) {
          const lastTabPath = this.tabs[this.tabs.length - 1].path;
          // 然后检查最后一个元素的 path 是否为 undefined
          if (lastTabPath !== undefined) {
            useRouterStore().router?.push(lastTabPath);
          }
        } else {
          // 如果所有标签页都关闭了，可以导航到一个默认路由，例如首页
          useRouterStore().router?.push('/');
        }
      }
    },
    // 关闭其他标签页
    removeOther(curPath: string) {
      const pathToRemoveOthersBasedOn = curPath === undefined ? this.activeTab : curPath;
      this.setTabs(
        this.tabs.filter(tab => tab.path === pathToRemoveOthersBasedOn || tab.affix),
      )
      // 如果当前激活的标签页被关闭，导航到最后一个标签页
      if (curPath !== undefined && pathToRemoveOthersBasedOn !== this.activeTab) {
        // 确保 this.tabs 在 push 前不为空，且 path 存在
        if (this.tabs.length > 0 && this.tabs[this.tabs.length - 1].path !== undefined) {
          useRouterStore().router?.push(this.tabs[this.tabs.length - 1].path!);
        } else if (this.tabs.length === 0) {
          // 如果关闭其他后没有标签了，可以导航到首页
          useRouterStore().router?.push('/');
        }
      }
    },
    // 关闭左侧标签页
    removeLeft(curPath: string) {
      const curIndex = this.tabs.findIndex(item => item.path === curPath)
      const filterTabs = this.tabs.filter(
        (item, index) => index >= curIndex || item.affix,
      )
      this.setTabs(filterTabs)
      if (!filterTabs.find(item => item.path === this.activeTab)) {
        // 首先检查 filterTabs 数组是否还有元素
        if (filterTabs.length > 0) {
          const lastTabPath = filterTabs[filterTabs.length - 1].path;
          // 然后检查最后一个元素的 path 是否为 undefined
          if (lastTabPath !== undefined) {
            useRouterStore().router?.push(lastTabPath);
          }
        } else {
          // 如果所有符合条件的标签页都关闭了，可以导航到一个默认路由，例如首页
          useRouterStore().router?.push('/');
        }
      }
    },
    // 关闭右侧标签页
    removeRight(curPath: string) {
      const curIndex = this.tabs.findIndex(item => item.path === curPath)
      const filterTabs = this.tabs.filter((item, index) => index <= curIndex)
      this.setTabs(filterTabs)
      if (!filterTabs.find(item => item.path === this.activeTab)) {
        // 首先检查 filterTabs 数组是否还有元素
        if (filterTabs.length > 0) {
          const lastTabPath = filterTabs[filterTabs.length - 1].path;
          // 然后检查最后一个元素的 path 是否为 undefined
          if (lastTabPath !== undefined) {
            useRouterStore().router?.push(lastTabPath);
          }
        } else {
          // 如果所有符合条件的标签页都关闭了，可以导航到一个默认路由，例如首页
          useRouterStore().router?.push('/');
        }
      }
    },

    resetTabs() {
      this.$reset()
    },
  },
  persist: {
    pick: ['tabs'],
    storage: sessionStorage,
  },
})
