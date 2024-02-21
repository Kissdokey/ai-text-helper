import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAiTextAreaStore = defineStore('ai-text-area', () => {
  // States
  const inputText = ref('') // 输入框文字
  const isAiModel = ref(false) // 文字背景颜色
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
