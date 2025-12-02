<template>
  <div class="container py-8">
    <h1 class="text-2xl font-bold text-primary mb-6">
      {{ pageTitle }}
    </h1>

    <!-- 搜索框 -->
    <div class="max-w-2xl mb-6">
      <SearchBar
        v-model="searchQuery"
        placeholder="搜索诗名、作者、诗句..."
        @search="handleSearch"
      />
    </div>

    <!-- 筛选标签 -->
    <div class="flex items-center gap-2 mb-8 flex-wrap">
      <button
        v-for="tab in tabs"
        :key="tab.value"
        class="px-4 py-2 rounded-full text-sm transition-colors"
        :class="activeTab === tab.value
          ? 'bg-primary text-white'
          : 'bg-bg-hover text-text-secondary hover:bg-bg-active'"
        @click="activeTab = tab.value"
      >
        {{ tab.label }}
      </button>
    </div>

    <!-- 诗词列表 -->
    <div
      v-if="loading"
      class="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      <div
        v-for="i in 6"
        :key="i"
        class="card p-6"
      >
        <div class="skeleton h-6 w-24 mb-3" />
        <div class="skeleton h-4 w-16 mb-4" />
        <div class="space-y-2">
          <div class="skeleton h-4 w-full" />
          <div class="skeleton h-4 w-3/4" />
        </div>
      </div>
    </div>

    <div
      v-else-if="filteredList.length > 0"
      class="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      <router-link
        v-for="poem in paginatedList"
        :key="poem.id"
        :to="`/poetry/${poem.id}`"
        class="card p-6 group"
      >
        <div class="flex items-start justify-between mb-3">
          <h3 class="text-lg font-semibold text-primary group-hover:text-accent transition-colors">
            {{ poem.title }}
          </h3>
          <span class="text-sm text-text-tertiary">
            [{{ poem.dynasty }}] {{ poem.author }}
          </span>
        </div>
        <div class="font-poetry text-text-secondary leading-relaxed">
          <p
            v-for="(line, index) in poem.paragraphs.slice(0, 2)"
            :key="index"
          >
            {{ line }}
          </p>
          <p
            v-if="poem.paragraphs.length > 2"
            class="text-text-tertiary"
          >
            ...
          </p>
        </div>
        <div class="flex items-center gap-2 mt-4">
          <span
            v-for="tag in (poem.tags || []).slice(0, 3)"
            :key="tag"
            class="text-xs px-2 py-1 bg-bg-hover rounded text-text-tertiary"
          >
            {{ tag }}
          </span>
        </div>
      </router-link>
    </div>

    <div
      v-else
      class="text-center py-16 text-text-tertiary"
    >
      <p>暂无诗词</p>
    </div>

    <!-- 分页 -->
    <div
      v-if="totalPages > 1"
      class="flex items-center justify-center gap-2 mt-8"
    >
      <button
        class="px-4 py-2 rounded-lg border border-border hover:bg-bg-hover transition-colors disabled:opacity-50"
        :disabled="currentPage === 1"
        @click="currentPage--"
      >
        上一页
      </button>
      <span class="px-4 py-2 text-text-secondary">
        {{ currentPage }} / {{ totalPages }}
      </span>
      <button
        class="px-4 py-2 rounded-lg border border-border hover:bg-bg-hover transition-colors disabled:opacity-50"
        :disabled="currentPage === totalPages"
        @click="currentPage++"
      >
        下一页
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { usePoetryStore } from '@/stores/poetry'
import SearchBar from '@/components/common/SearchBar.vue'

const props = defineProps({
  type: {
    type: String,
    default: ''
  }
})

const route = useRoute()
const poetryStore = usePoetryStore()

const searchQuery = ref('')
const activeTab = ref('all')
const currentPage = ref(1)
const pageSize = 20
const loading = ref(true)

const tabs = [
  { label: '全部', value: 'all' },
  { label: '唐诗', value: 'tang' },
  { label: '宋词', value: 'song' }
]

const pageTitle = computed(() => {
  if (props.type === 'tang') return '唐诗'
  if (props.type === 'song') return '宋词'
  return '诗词欣赏'
})

const filteredList = computed(() => {
  let list = poetryStore.allPoetry

  // 按类型筛选
  if (activeTab.value === 'tang' || props.type === 'tang') {
    list = list.filter(p => p.type === 'tang')
  } else if (activeTab.value === 'song' || props.type === 'song') {
    list = list.filter(p => p.type === 'song')
  }

  // 搜索筛选
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    list = list.filter(p =>
      p.title.toLowerCase().includes(query) ||
      p.author.toLowerCase().includes(query) ||
      p.paragraphs.some(line => line.includes(query))
    )
  }

  return list
})

const totalPages = computed(() => {
  return Math.ceil(filteredList.value.length / pageSize)
})

const paginatedList = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredList.value.slice(start, start + pageSize)
})

const handleSearch = (query) => {
  searchQuery.value = query
  currentPage.value = 1
}

watch([activeTab, searchQuery], () => {
  currentPage.value = 1
})

watch(() => props.type, (val) => {
  if (val) {
    activeTab.value = val
  }
})

onMounted(async () => {
  loading.value = true

  await poetryStore.loadAll()

  // 设置初始标签
  if (props.type) {
    activeTab.value = props.type
  }

  // 检查URL参数
  if (route.query.q) {
    searchQuery.value = route.query.q
  }

  loading.value = false
})
</script>
