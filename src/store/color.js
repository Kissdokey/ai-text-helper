import { defineStore } from 'pinia'
import { ref } from 'vue'

/**
 * 文字颜色，文字背景颜色，绘画颜色，评论颜色,主题颜色等统一控制全局状态(仅仅记录index，便于维护)
 */
export const useColorStore = defineStore('color', () => {
  // States
  const wordColorIndex = ref(0) // 文字颜色
  const highlightColorIndex = ref(0) // 文字背景颜色

  // Getters

  // Actions
  const updateWordColorIndex = state => wordColorIndex.value = state
  const updateHighlightColorIndex = state => highlightColorIndex.value = state

  return {
    wordColorIndex, highlightColorIndex,
    updateWordColorIndex, updateHighlightColorIndex
  }
},{ persist: true })
