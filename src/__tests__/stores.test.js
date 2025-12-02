import { describe, it, expect, beforeEach } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useSettingsStore } from '../stores/settings'
import { useFavoritesStore } from '../stores/favorites'
import { useSearchStore } from '../stores/search'
import { useToastStore } from '../stores/toast'

describe('Settings Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should initialize with default values', () => {
    const store = useSettingsStore()
    expect(store.isDark).toBe(false)
    expect(store.fontSize).toBe('medium')
  })

  it('should toggle dark mode', () => {
    const store = useSettingsStore()
    expect(store.isDark).toBe(false)
    store.toggleTheme()
    expect(store.isDark).toBe(true)
    store.toggleTheme()
    expect(store.isDark).toBe(false)
  })

  it('should set font size', () => {
    const store = useSettingsStore()
    store.setFontSize('large')
    expect(store.fontSize).toBe('large')
    store.setFontSize('small')
    expect(store.fontSize).toBe('small')
  })
})

describe('Favorites Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('should initialize with empty arrays', () => {
    const store = useFavoritesStore()
    store.init()
    expect(store.items.hanzi).toEqual([])
    expect(store.items.poetry).toEqual([])
    expect(store.items.idiom).toEqual([])
  })

  it('should add and remove favorites', () => {
    const store = useFavoritesStore()
    store.init()

    const item = { id: 'test-1', char: '字' }
    store.add('hanzi', item)
    expect(store.items.hanzi.length).toBe(1)
    expect(store.isFavorite('hanzi', 'test-1')).toBe(true)

    store.remove('hanzi', 'test-1')
    expect(store.items.hanzi.length).toBe(0)
    expect(store.isFavorite('hanzi', 'test-1')).toBe(false)
  })

  it('should toggle favorites', () => {
    const store = useFavoritesStore()
    store.init()

    const item = { id: 'test-2', char: '文' }
    const added = store.toggle('hanzi', item)
    expect(added).toBe(true)
    expect(store.isFavorite('hanzi', 'test-2')).toBe(true)

    const removed = store.toggle('hanzi', item)
    expect(removed).toBe(false)
    expect(store.isFavorite('hanzi', 'test-2')).toBe(false)
  })

  it('should count total favorites', () => {
    const store = useFavoritesStore()
    store.init()

    store.add('hanzi', { id: '1' })
    store.add('hanzi', { id: '2' })
    store.add('poetry', { id: '3' })

    expect(store.totalCount).toBe(3)
    expect(store.getCount('hanzi')).toBe(2)
    expect(store.getCount('poetry')).toBe(1)
  })

  it('should clear all favorites', () => {
    const store = useFavoritesStore()
    store.init()

    store.add('hanzi', { id: '1' })
    store.add('poetry', { id: '2' })
    store.clearAll()

    expect(store.totalCount).toBe(0)
  })
})

describe('Search Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
    localStorage.clear()
  })

  it('should add search history', () => {
    const store = useSearchStore()
    store.init()

    store.addHistory('汉字')
    expect(store.history).toContain('汉字')
  })

  it('should not add duplicate history', () => {
    const store = useSearchStore()
    store.init()

    store.addHistory('测试')
    store.addHistory('测试')
    expect(store.history.filter(h => h === '测试').length).toBe(1)
  })

  it('should clear history', () => {
    const store = useSearchStore()
    store.init()

    store.addHistory('词语1')
    store.addHistory('词语2')
    store.clearHistory()

    expect(store.history.length).toBe(0)
  })
})

describe('Toast Store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('should show and hide toast', () => {
    const store = useToastStore()

    expect(store.visible).toBe(false)
    store.show('Test message')
    expect(store.visible).toBe(true)
    expect(store.message).toBe('Test message')

    store.hide()
    expect(store.visible).toBe(false)
  })

  it('should set toast type', () => {
    const store = useToastStore()

    store.show('Success!', { type: 'success' })
    expect(store.type).toBe('success')

    store.show('Error!', { type: 'error' })
    expect(store.type).toBe('error')
  })
})
