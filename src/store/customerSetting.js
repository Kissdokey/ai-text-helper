import { defineStore } from 'pinia'
import { ref } from 'vue'


export const useCustomerSetting = defineStore('customer-setting', () => {
  // States
  const isThemeDark = ref('false') 
  const ifWorkspaceOpen = ref(true) 
  const workspacePosition = ref({x:100,y:100})
  // Getters

  // Actions
  const updateTheme = state => isThemeDark.value = state
  const updateFfWorkspaceOpen = state => ifWorkspaceOpen.value = state
  const updateWorkspacePosition = state=> workspacePosition.value = state

  return {
    isThemeDark, ifWorkspaceOpen,workspacePosition,
    updateTheme, updateFfWorkspaceOpen,updateWorkspacePosition
  }
},{ persist: true })
