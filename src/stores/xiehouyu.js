import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import Fuse from 'fuse.js'

export const useXiehouyuStore = defineStore('xiehouyu', () => {
  const data = ref([])
  const loading = ref(false)
  const loaded = ref(false)

  // 加载歇后语数据
  const loadData = async () => {
    if (loaded.value) return
    loading.value = true

    try {
      const response = await fetch('/data/xiehouyu/xiehouyu.json')
      data.value = await response.json()
      loaded.value = true
    } catch (error) {
      console.error('Failed to load xiehouyu data:', error)
    } finally {
      loading.value = false
    }
  }

  // 按类型分组
  const groupedByType = computed(() => {
    const groups = {
      harmonic: [], // 谐音类
      metaphor: [], // 喻事类
      object: [],   // 喻物类
      story: [],    // 故事类
      other: []     // 其他
    }

    data.value.forEach(item => {
      const type = item.type || 'other'
      if (groups[type]) {
        groups[type].push(item)
      } else {
        groups.other.push(item)
      }
    })

    return groups
  })

  // 搜索歇后语
  const search = (query) => {
    if (!query) return []

    const fuse = new Fuse(data.value, {
      keys: ['riddle', 'answer'],
      threshold: 0.3
    })

    return fuse.search(query).map(r => r.item)
  }

  // 获取随机歇后语
  const getRandom = (count = 10) => {
    const shuffled = [...data.value].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, count)
  }

  // 按类型获取
  const getByType = (type) => {
    return data.value.filter(i => i.type === type)
  }

  return {
    data,
    loading,
    loaded,
    groupedByType,
    loadData,
    search,
    getRandom,
    getByType
  }
})
