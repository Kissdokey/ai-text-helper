import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAiTextAreaStore = defineStore('ai-text-area', () => {
  // States
  const inputText = ref('') 
  const isAiModel = ref(false) 
  const selectedText = ref('') // 选中的上下文

  // Getters

  // Actions
  const updateInputText = text => inputText.value = text
  const updateIsAiModel = state => isAiModel.value = state
  const updateSelectedText = text => selectedText.value = text

  return {
    inputText, isAiModel,selectedText,
    updateInputText, updateIsAiModel,updateSelectedText
  }
},{ persist: false })
