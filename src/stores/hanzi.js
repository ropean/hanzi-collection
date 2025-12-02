import { defineStore } from 'pinia'
import { ref } from 'vue'
import { pinyin } from 'pinyin-pro'

export const useHanziStore = defineStore('hanzi', () => {
  const data = ref({})
  const loading = ref(false)
  const loaded = ref(false)

  // 加载五笔数据
  const loadData = async () => {
    if (loaded.value) return
    loading.value = true

    try {
      const response = await fetch('/data/wubi/wubi86.json')
      data.value = await response.json()
      loaded.value = true
    } catch (error) {
      console.error('Failed to load wubi data:', error)
    } finally {
      loading.value = false
    }
  }

  // 获取汉字信息
  const getHanzi = (char) => {
    const info = data.value[char]
    if (!info) {
      // 如果没有数据，至少返回拼音
      return {
        char,
        pinyin: pinyin(char, { toneType: 'symbol' }),
        wubi: '未收录',
        strokes: 0,
        radicals: []
      }
    }
    return {
      char,
      ...info,
      pinyin: info.pinyin || pinyin(char, { toneType: 'symbol' })
    }
  }

  // 通过五笔编码搜索
  const searchByWubi = (code) => {
    const results = []
    const lowerCode = code.toLowerCase()

    for (const [char, info] of Object.entries(data.value)) {
      if (info.wubi && info.wubi.toLowerCase().startsWith(lowerCode)) {
        results.push({
          char,
          ...info,
          pinyin: info.pinyin || pinyin(char, { toneType: 'symbol' })
        })
      }
    }

    return results.slice(0, 50)
  }

  // 通过拼音搜索
  const searchByPinyin = (py) => {
    const results = []
    const lowerPy = py.toLowerCase()

    for (const [char, info] of Object.entries(data.value)) {
      const charPinyin = (info.pinyin || pinyin(char, { toneType: 'none' })).toLowerCase()
      if (charPinyin.startsWith(lowerPy) || charPinyin.includes(lowerPy)) {
        results.push({
          char,
          ...info,
          pinyin: info.pinyin || pinyin(char, { toneType: 'symbol' })
        })
      }
    }

    return results.slice(0, 50)
  }

  // 综合搜索
  const search = (query) => {
    if (!query) return []

    // 判断输入类型
    if (/^[\u4e00-\u9fa5]+$/.test(query)) {
      // 汉字
      return query.split('').map(char => getHanzi(char))
    } else if (/^[a-zA-Z]+$/.test(query)) {
      // 可能是五笔或拼音
      const wubiResults = searchByWubi(query)
      if (wubiResults.length > 0) {
        return wubiResults
      }
      return searchByPinyin(query)
    }

    return []
  }

  return {
    data,
    loading,
    loaded,
    loadData,
    getHanzi,
    searchByWubi,
    searchByPinyin,
    search
  }
})
