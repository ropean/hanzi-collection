import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSearchStore = defineStore('search', () => {
  const history = ref([])
  const maxHistory = 20

  // 初始化
  const init = () => {
    const saved = localStorage.getItem('searchHistory')
    if (saved) {
      try {
        history.value = JSON.parse(saved)
      } catch {
        history.value = []
      }
    }
  }

  // 添加历史记录
  const addHistory = (query) => {
    if (!query.trim()) return

    // 移除已存在的相同记录
    const index = history.value.indexOf(query)
    if (index > -1) {
      history.value.splice(index, 1)
    }

    // 添加到开头
    history.value.unshift(query)

    // 限制数量
    if (history.value.length > maxHistory) {
      history.value = history.value.slice(0, maxHistory)
    }

    // 保存
    localStorage.setItem('searchHistory', JSON.stringify(history.value))
  }

  // 清空历史
  const clearHistory = () => {
    history.value = []
    localStorage.removeItem('searchHistory')
  }

  return {
    history,
    init,
    addHistory,
    clearHistory
  }
})
