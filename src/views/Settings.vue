<template>
  <div class="container py-8">
    <h1 class="text-2xl font-bold text-primary mb-6">
      设置
    </h1>

    <div class="max-w-2xl space-y-6">
      <!-- 主题设置 -->
      <div class="card p-6">
        <h2 class="text-lg font-semibold text-text-primary mb-4">
          外观
        </h2>

        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-text-primary">
                深色模式
              </p>
              <p class="text-sm text-text-tertiary">
                切换深色/浅色主题
              </p>
            </div>
            <button
              class="w-12 h-6 rounded-full transition-colors relative"
              :class="settingsStore.isDark ? 'bg-primary' : 'bg-bg-active'"
              @click="settingsStore.toggleDark()"
            >
              <span
                class="absolute top-1 w-4 h-4 rounded-full bg-white transition-transform"
                :class="settingsStore.isDark ? 'left-7' : 'left-1'"
              />
            </button>
          </div>

          <div class="border-t border-border pt-4">
            <p class="text-text-primary mb-3">
              字体大小
            </p>
            <div class="flex items-center gap-4">
              <button
                v-for="size in fontSizes"
                :key="size.value"
                class="px-4 py-2 rounded-lg transition-colors"
                :class="settingsStore.fontSize === size.value
                  ? 'bg-primary text-white'
                  : 'bg-bg-hover text-text-secondary hover:bg-bg-active'"
                @click="settingsStore.setFontSize(size.value)"
              >
                {{ size.label }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 数据管理 -->
      <div class="card p-6">
        <h2 class="text-lg font-semibold text-text-primary mb-4">
          数据管理
        </h2>

        <div class="space-y-4">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-text-primary">
                清除搜索历史
              </p>
              <p class="text-sm text-text-tertiary">
                删除所有搜索记录
              </p>
            </div>
            <button
              class="px-4 py-2 text-sm bg-bg-hover text-text-secondary rounded-lg hover:bg-bg-active transition-colors"
              @click="clearSearchHistory"
            >
              清除
            </button>
          </div>

          <div class="border-t border-border pt-4 flex items-center justify-between">
            <div>
              <p class="text-text-primary">
                清除浏览历史
              </p>
              <p class="text-sm text-text-tertiary">
                删除所有浏览记录
              </p>
            </div>
            <button
              class="px-4 py-2 text-sm bg-bg-hover text-text-secondary rounded-lg hover:bg-bg-active transition-colors"
              @click="clearBrowseHistory"
            >
              清除
            </button>
          </div>

          <div class="border-t border-border pt-4 flex items-center justify-between">
            <div>
              <p class="text-text-primary">
                清除收藏数据
              </p>
              <p class="text-sm text-text-tertiary">
                删除所有收藏内容
              </p>
            </div>
            <button
              class="px-4 py-2 text-sm bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-colors"
              @click="clearFavorites"
            >
              清除
            </button>
          </div>
        </div>
      </div>

      <!-- 关于 -->
      <div class="card p-6">
        <h2 class="text-lg font-semibold text-text-primary mb-4">
          关于
        </h2>

        <div class="space-y-3 text-text-secondary">
          <div class="flex justify-between">
            <span>版本</span>
            <span class="text-text-tertiary">1.0.0</span>
          </div>
          <div class="flex justify-between">
            <span>作者</span>
            <span class="text-text-tertiary">汉字集团队</span>
          </div>
        </div>

        <router-link
          to="/about"
          class="block mt-4 text-primary hover:underline"
        >
          查看更多 →
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useSettingsStore } from '@/stores/settings'
import { useSearchStore } from '@/stores/search'
import { useFavoritesStore } from '@/stores/favorites'
import { useToastStore } from '@/stores/toast'

const settingsStore = useSettingsStore()
const searchStore = useSearchStore()
const favoritesStore = useFavoritesStore()
const toastStore = useToastStore()

const fontSizes = [
  { label: '小', value: 'small' },
  { label: '中', value: 'medium' },
  { label: '大', value: 'large' }
]

const clearSearchHistory = () => {
  searchStore.clearHistory()
  toastStore.show('搜索历史已清除')
}

const clearBrowseHistory = () => {
  localStorage.removeItem('hanzi-history')
  toastStore.show('浏览历史已清除')
}

const clearFavorites = () => {
  if (confirm('确定要清除所有收藏吗？此操作不可恢复。')) {
    favoritesStore.clearAll()
    toastStore.show('收藏数据已清除')
  }
}
</script>
