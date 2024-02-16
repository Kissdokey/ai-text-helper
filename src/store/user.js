import { defineStore } from 'pinia'
import { ref } from 'vue'


export const useUserStore = defineStore('user', () => {
  // States
  const isLogin = ref(false) //是否登录
  const username = ref("Guest")
  const userAvatar = ref("")
  const apiRequestNumber = ref(0)
  // Getters
  const initUserInfo = (res)=> {
    isLogin.value = res.code === 200 ? true : false
    username.value = res?.data?.username || "Guest"
    userAvatar.value = res?.data?.avatar || ""
    apiRequestNumber.value = res?.data?.apiRequestNumber || 0
  }
  // Actions
  const updateLoginState = state => isLogin.value = state
  const updateUsername = name => username.value = name
  const updateUserAvatar = avatar => userAvatar.value = avatar
  return {
    isLogin,
    username,
    userAvatar,
    updateLoginState,
    updateUsername,
    initUserInfo,
    updateUserAvatar
  }
},{ persist: false })
