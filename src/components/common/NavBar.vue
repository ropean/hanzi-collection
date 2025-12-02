<template>
  <header class="fixed top-0 left-0 right-0 z-50 bg-white border-b border-border">
    <div class="container h-16 flex items-center justify-between">
      <!-- Logo -->
      <router-link
        to="/"
        class="flex items-center gap-2 text-primary font-bold text-xl"
      >
        <span class="text-2xl">字</span>
        <span>汉字集</span>
      </router-link>

      <!-- 主导航 -->
      <nav class="flex items-center gap-8">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="nav-link"
          :class="{ 'nav-link-active': isActive(item.path) }"
        >
          {{ item.name }}
        </router-link>
      </nav>

      <!-- 右侧工具栏 -->
      <div class="flex items-center gap-4">
        <!-- 搜索按钮 -->
        <button
          class="p-2 rounded-lg hover:bg-bg-hover transition-colors"
          aria-label="搜索"
          @click="openSearch"
        >
          <svg
            class="w-5 h-5 text-text-secondary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>

        <!-- 主题切换 -->
        <button
          class="p-2 rounded-lg hover:bg-bg-hover transition-colors"
          aria-label="切换主题"
          @click="toggleTheme"
        >
          <svg
            v-if="isDark"
            class="w-5 h-5 text-text-secondary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
          <svg
            v-else
            class="w-5 h-5 text-text-secondary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        </button>

        <!-- 收藏入口 -->
        <router-link
          to="/favorites"
          class="p-2 rounded-lg hover:bg-bg-hover transition-colors"
          aria-label="我的收藏"
        >
          <svg
            class="w-5 h-5 text-text-secondary"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </router-link>
      </div>
    </div>

    <!-- 全局搜索弹窗 -->
    <SearchModal v-model="showSearch" />
  </header>

  <!-- 占位 -->
  <div class="h-16" />
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useSettingsStore } from '@/stores/settings'
import SearchModal from './SearchModal.vue'

const route = useRoute()
const settingsStore = useSettingsStore()

const showSearch = ref(false)

const navItems = [
  { name: '汉字', path: '/hanzi' },
  { name: '诗词', path: '/poetry' },
  { name: '成语', path: '/idiom' },
  { name: '歇后语', path: '/xiehouyu' }
]

const isDark = computed(() => settingsStore.isDark)

const isActive = (path) => {
  return route.path.startsWith(path)
}

const openSearch = () => {
  showSearch.value = true
}

const toggleTheme = () => {
  settingsStore.toggleTheme()
}
</script>

<style scoped>
.nav-link {
  color: var(--color-text-secondary);
  font-weight: 500;
  transition: color 0.2s;
}

.nav-link:hover {
  color: var(--color-primary);
}

.nav-link-active {
  color: var(--color-primary);
}
</style>
