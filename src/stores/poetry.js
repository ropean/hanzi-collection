import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import Fuse from 'fuse.js'

export const usePoetryStore = defineStore('poetry', () => {
  const tangPoetry = ref([])
  const songCi = ref([])
  const authors = ref({})
  const loading = ref(false)
  const loaded = ref({ tang: false, song: false, authors: false })

  // 加载唐诗
  const loadTang = async () => {
    if (loaded.value.tang) return
    loading.value = true

    try {
      const response = await fetch('/data/poetry/tang300.json')
      tangPoetry.value = await response.json()
      loaded.value.tang = true
    } catch (error) {
      console.error('Failed to load tang poetry:', error)
    } finally {
      loading.value = false
    }
  }

  // 加载宋词
  const loadSong = async () => {
    if (loaded.value.song) return
    loading.value = true

    try {
      const response = await fetch('/data/poetry/song300.json')
      songCi.value = await response.json()
      loaded.value.song = true
    } catch (error) {
      console.error('Failed to load song ci:', error)
    } finally {
      loading.value = false
    }
  }

  // 加载作者信息
  const loadAuthors = async () => {
    if (loaded.value.authors) return

    try {
      const response = await fetch('/data/poetry/authors.json')
      authors.value = await response.json()
      loaded.value.authors = true
    } catch (error) {
      console.error('Failed to load authors:', error)
    }
  }

  // 加载所有数据
  const loadAll = async () => {
    await Promise.all([loadTang(), loadSong(), loadAuthors()])
  }

  // 所有诗词
  const allPoetry = computed(() => {
    return [
      ...tangPoetry.value.map(p => ({ ...p, type: 'tang' })),
      ...songCi.value.map(p => ({ ...p, type: 'song' }))
    ]
  })

  // 按ID获取诗词
  const getById = (id) => {
    return allPoetry.value.find(p => p.id === id)
  }

  // 按作者获取作品
  const getByAuthor = (author) => {
    return allPoetry.value.filter(p => p.author === author)
  }

  // 获取作者信息
  const getAuthor = (name) => {
    return authors.value[name] || null
  }

  // 搜索诗词
  const search = (query) => {
    if (!query) return []

    const fuse = new Fuse(allPoetry.value, {
      keys: ['title', 'author', 'paragraphs', 'rhythmic'],
      threshold: 0.3,
      includeScore: true
    })

    return fuse.search(query).map(r => r.item)
  }

  // 获取随机诗词
  const getRandom = () => {
    const all = allPoetry.value
    if (all.length === 0) return null
    return all[Math.floor(Math.random() * all.length)]
  }

  // 获取今日推荐（基于日期的固定推荐）
  const getDailyRecommend = () => {
    const all = allPoetry.value
    if (all.length === 0) return null

    const today = new Date()
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / (1000 * 60 * 60 * 24))
    return all[dayOfYear % all.length]
  }

  return {
    tangPoetry,
    songCi,
    authors,
    loading,
    loaded,
    allPoetry,
    loadTang,
    loadSong,
    loadAuthors,
    loadAll,
    getById,
    getByAuthor,
    getAuthor,
    search,
    getRandom,
    getDailyRecommend
  }
})
