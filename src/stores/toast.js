import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useToastStore = defineStore('toast', () => {
  const visible = ref(false)
  const message = ref('')
  const type = ref('info') // success, error, warning, info
  const duration = ref(3000)

  let timer = null

  const show = (msg, options = {}) => {
    // 清除之前的定时器
    if (timer) {
      clearTimeout(timer)
    }

    message.value = msg
    type.value = options.type || 'info'
    visible.value = true

    // 自动隐藏
    timer = setTimeout(() => {
      hide()
    }, options.duration || duration.value)
  }

  const hide = () => {
    visible.value = false
    message.value = ''
  }

  const success = (msg, options = {}) => {
    show(msg, { ...options, type: 'success' })
  }

  const error = (msg, options = {}) => {
    show(msg, { ...options, type: 'error' })
  }

  const warning = (msg, options = {}) => {
    show(msg, { ...options, type: 'warning' })
  }

  const info = (msg, options = {}) => {
    show(msg, { ...options, type: 'info' })
  }

  return {
    visible,
    message,
    type,
    show,
    hide,
    success,
    error,
    warning,
    info
  }
})
