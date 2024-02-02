import { defineStore } from 'pinia'
import { ref } from 'vue'


export const useUserStore = defineStore('user', () => {
  // States
  const isLogin = ref(false) //是否登录
  const username = ref("Guest")
  // Getters
  const initUserInfo = (res)=> {
    isLogin.value = res.code === 200 ? true : false
    username.value = res?.data?.username || "Guest"
  }
  // Actions
  const updateLoginState = state => isLogin.value = state
  const updateUsername = name => username.value = name
  return {
    isLogin,
    username,
    updateLoginState,
    updateUsername,
    initUserInfo
  }
},{ persist: true })
