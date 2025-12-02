import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useSettingsStore = defineStore('settings', () => {
  const isDark = ref(false)
  const fontSize = ref('medium') // small, medium, large

  // 初始化主题
  const initTheme = () => {
    const savedTheme = localStorage.getItem('theme')
    if (savedTheme) {
      isDark.value = savedTheme === 'dark'
    } else {
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    applyTheme()
  }

  // 应用主题
  const applyTheme = () => {
    if (isDark.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  // 切换主题
  const toggleTheme = () => {
    isDark.value = !isDark.value
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
    applyTheme()
  }

  // 设置字体大小
  const setFontSize = (size) => {
    fontSize.value = size
    localStorage.setItem('fontSize', size)
    document.documentElement.setAttribute('data-font-size', size)
  }

  // 初始化字体大小
  const initFontSize = () => {
    const savedSize = localStorage.getItem('fontSize')
    if (savedSize) {
      fontSize.value = savedSize
      document.documentElement.setAttribute('data-font-size', savedSize)
    }
  }

  // 监听系统主题变化
  if (typeof window !== 'undefined') {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      if (!localStorage.getItem('theme')) {
        isDark.value = e.matches
        applyTheme()
      }
    })
  }

  return {
    isDark,
    fontSize,
    initTheme,
    toggleTheme,
    setFontSize,
    initFontSize
  }
})
