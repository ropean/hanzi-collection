import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import Fuse from 'fuse.js'

export const useIdiomStore = defineStore('idiom', () => {
  const data = ref([])
  const loading = ref(false)
  const loaded = ref(false)

  // 加载成语数据
  const loadData = async () => {
    if (loaded.value) return
    loading.value = true

    try {
      const response = await fetch('/data/idiom/idioms.json')
      data.value = await response.json()
      loaded.value = true
    } catch (error) {
      console.error('Failed to load idiom data:', error)
    } finally {
      loading.value = false
    }
  }

  // 按首字母分组
  const groupedByLetter = computed(() => {
    const groups = {}
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

    letters.forEach(letter => {
      groups[letter] = []
    })

    data.value.forEach(idiom => {
      const firstLetter = (idiom.pinyin?.[0] || 'A').toUpperCase()
      if (groups[firstLetter]) {
        groups[firstLetter].push(idiom)
      }
    })

    return groups
  })

  // 获取成语详情
  const getByWord = (word) => {
    return data.value.find(i => i.word === word)
  }

  // 搜索成语
  const search = (query) => {
    if (!query) return []

    const fuse = new Fuse(data.value, {
      keys: ['word', 'pinyin', 'explanation', 'derivation'],
      threshold: 0.3
    })

    return fuse.search(query).map(r => r.item)
  }

  // 按情感色彩筛选
  const filterByEmotion = (emotion) => {
    return data.value.filter(i => i.emotion === emotion)
  }

  // 获取随机成语
  const getRandom = (count = 10) => {
    const shuffled = [...data.value].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, count)
  }

  return {
    data,
    loading,
    loaded,
    groupedByLetter,
    loadData,
    getByWord,
    search,
    filterByEmotion,
    getRandom
  }
})
