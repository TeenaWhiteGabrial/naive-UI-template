import { defineStore } from 'pinia';

interface UserInfo {
  createdDate?: string;
  department?: string;
  departmentCode?: string;
  departmentId?: string;
  displayName?: string;
  email?: string;
  idType?: number;
  instId?: string;
  jobTitle?: string | null;
  lastLoginTime?: string;
  mobile?: string;
  roleList?: Array<{
    roleCode: string;
    name: string;
    id: string;
  }>;
  userId?: string;
  userName?: string;
  userState?: string;
  userType?: string;
}

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: {} as UserInfo,
  }),
  getters: {
    displayName(): string {
      return this.userInfo?.userId || ''
    },
    email(): string {
      return this.userInfo?.email || ''
    },
    mobile(): string {
      return this.userInfo?.mobile || ''
    },
    userId(): string {
      return this.userInfo?.userId || ''
    },
    userName(): string {
      return this.userInfo?.userName || ''
    },
    userType(): string {
      return this.userInfo?.userType || ''
    },
    userState(): string {
      return this.userInfo?.userState || ''
    },
    roleId(): string {
      return this.userInfo?.roleList?.find(role => role.id)?.id || ''
    }
  },
  actions: {
    setUser(user: UserInfo) {
      this.userInfo = user
    },
    resetUser() {
      this.$reset()
    },
  },
})
