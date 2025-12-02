<template>
  <div class="container py-8">
    <h1 class="text-2xl font-bold text-primary mb-6">
      成语词典
    </h1>

    <!-- 搜索框 -->
    <div class="max-w-2xl mb-6">
      <SearchBar
        v-model="searchQuery"
        placeholder="搜索成语、释义..."
        @search="handleSearch"
      />
    </div>

    <!-- 筛选标签 -->
    <div class="flex items-center gap-2 mb-4 flex-wrap">
      <button
        v-for="filter in emotionFilters"
        :key="filter.value"
        class="px-4 py-2 rounded-full text-sm transition-colors"
        :class="activeEmotion === filter.value
          ? 'bg-primary text-white'
          : 'bg-bg-hover text-text-secondary hover:bg-bg-active'"
        @click="activeEmotion = filter.value"
      >
        {{ filter.label }}
      </button>
    </div>

    <!-- 字母索引 -->
    <div class="flex items-center gap-1 mb-8 flex-wrap">
      <button
        v-for="letter in letters"
        :key="letter"
        class="w-8 h-8 rounded text-sm transition-colors"
        :class="activeLetter === letter
          ? 'bg-primary text-white'
          : 'bg-bg-hover text-text-secondary hover:bg-bg-active'"
        @click="activeLetter = activeLetter === letter ? '' : letter"
      >
        {{ letter }}
      </button>
    </div>

    <!-- 成语列表 -->
    <div
      v-if="loading"
      class="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      <div
        v-for="i in 8"
        :key="i"
        class="card p-5"
      >
        <div class="skeleton h-6 w-24 mb-2" />
        <div class="skeleton h-4 w-full" />
      </div>
    </div>

    <div
      v-else-if="filteredList.length > 0"
      class="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      <router-link
        v-for="idiom in paginatedList"
        :key="idiom.word"
        :to="`/idiom/${idiom.word}`"
        class="card p-5 group"
      >
        <div class="flex items-start justify-between mb-2">
          <h3 class="text-lg font-semibold text-primary group-hover:text-accent transition-colors">
            {{ idiom.word }}
          </h3>
          <span
            v-if="idiom.emotion"
            class="text-xs px-2 py-0.5 rounded"
            :class="{
              'bg-green-100 text-green-600': idiom.emotion === '褒义',
              'bg-red-100 text-red-600': idiom.emotion === '贬义',
              'bg-gray-100 text-gray-600': idiom.emotion === '中性'
            }"
          >
            {{ idiom.emotion }}
          </span>
        </div>
        <p class="text-sm text-text-tertiary mb-2">
          {{ idiom.pinyin }}
        </p>
        <p class="text-sm text-text-secondary line-clamp-2">
          {{ idiom.explanation }}
        </p>
      </router-link>
    </div>

    <div
      v-else
      class="text-center py-16 text-text-tertiary"
    >
      <p>暂无成语</p>
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
import { useIdiomStore } from '@/stores/idiom'
import SearchBar from '@/components/common/SearchBar.vue'

const idiomStore = useIdiomStore()

const searchQuery = ref('')
const activeEmotion = ref('all')
const activeLetter = ref('')
const currentPage = ref(1)
const pageSize = 20
const loading = ref(true)

const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')

const emotionFilters = [
  { label: '全部', value: 'all' },
  { label: '褒义词', value: '褒义' },
  { label: '贬义词', value: '贬义' },
  { label: '中性词', value: '中性' }
]

const filteredList = computed(() => {
  let list = idiomStore.data

  // 按情感筛选
  if (activeEmotion.value !== 'all') {
    list = list.filter(i => i.emotion === activeEmotion.value)
  }

  // 按字母筛选
  if (activeLetter.value) {
    list = list.filter(i => {
      const firstLetter = (i.pinyin?.[0] || '').toUpperCase()
      return firstLetter === activeLetter.value
    })
  }

  // 搜索筛选
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    list = list.filter(i =>
      i.word.includes(query) ||
      i.pinyin?.toLowerCase().includes(query) ||
      i.explanation.toLowerCase().includes(query)
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

watch([activeEmotion, activeLetter, searchQuery], () => {
  currentPage.value = 1
})

onMounted(async () => {
  loading.value = true
  await idiomStore.loadData()
  loading.value = false
})
</script>
