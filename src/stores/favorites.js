import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useFavoritesStore = defineStore('favorites', () => {
  const items = ref({
    hanzi: [],
    poetry: [],
    idiom: [],
    xiehouyu: []
  })

  // 初始化
  const init = () => {
    const saved = localStorage.getItem('favorites')
    if (saved) {
      try {
        items.value = JSON.parse(saved)
      } catch {
        items.value = { hanzi: [], poetry: [], idiom: [], xiehouyu: [] }
      }
    }
  }

  // 保存到本地
  const save = () => {
    localStorage.setItem('favorites', JSON.stringify(items.value))
  }

  // 添加收藏
  const add = (type, item) => {
    if (!items.value[type]) {
      items.value[type] = []
    }

    // 检查是否已存在
    const exists = items.value[type].some(i => i.id === item.id)
    if (!exists) {
      items.value[type].unshift({
        ...item,
        addedAt: Date.now()
      })
      save()
    }
  }

  // 移除收藏
  const remove = (type, id) => {
    if (!items.value[type]) return

    const index = items.value[type].findIndex(i => i.id === id)
    if (index > -1) {
      items.value[type].splice(index, 1)
      save()
    }
  }

  // 检查是否已收藏
  const isFavorite = (type, id) => {
    if (!items.value[type]) return false
    return items.value[type].some(i => i.id === id)
  }

  // 切换收藏状态
  const toggle = (type, item) => {
    if (isFavorite(type, item.id)) {
      remove(type, item.id)
      return false
    } else {
      add(type, item)
      return true
    }
  }

  // 获取指定类型的收藏数量
  const getCount = (type) => {
    return items.value[type]?.length || 0
  }

  // 总数
  const totalCount = computed(() => {
    return Object.values(items.value).reduce((sum, arr) => sum + arr.length, 0)
  })

  // 清除所有收藏
  const clearAll = () => {
    items.value = { hanzi: [], poetry: [], idiom: [], xiehouyu: [] }
    save()
  }

  return {
    items,
    init,
    add,
    remove,
    isFavorite,
    toggle,
    getCount,
    totalCount,
    clearAll
  }
})
