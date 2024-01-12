import { defineStore } from 'pinia'
import { ref } from 'vue'


export const useUserInfo = defineStore('user-info', () => {
  // States
  const userId =ref('') // 
  const userName = ref('') // 
  const isLogin = ref(false)
  const userAvatar = ref('')

  // Getters
   const initInfo = ()=> {
    //userId,userName,userAvatar
   }
  // Actions
  const updateUserName = (name)=> {
    userName.value = name
    //向后端发送请求修改名字
  }

  return {
    wordColorIndex, highlightColorIndex,
    updateWordColorIndex, updateHighlightColorIndex
  }
},{ persist: true })
