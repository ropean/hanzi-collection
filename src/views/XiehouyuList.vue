<template>
  <div class="container py-8">
    <h1 class="text-2xl font-bold text-primary mb-6">
      歇后语
    </h1>

    <!-- 搜索框 -->
    <div class="max-w-2xl mb-6">
      <SearchBar
        v-model="searchQuery"
        placeholder="搜索歇后语..."
        @search="handleSearch"
      />
    </div>

    <!-- 筛选标签 -->
    <div class="flex items-center gap-2 mb-8 flex-wrap">
      <button
        v-for="filter in typeFilters"
        :key="filter.value"
        class="px-4 py-2 rounded-full text-sm transition-colors"
        :class="activeType === filter.value
          ? 'bg-primary text-white'
          : 'bg-bg-hover text-text-secondary hover:bg-bg-active'"
        @click="activeType = filter.value"
      >
        {{ filter.label }}
      </button>
      <button
        class="px-4 py-2 rounded-full text-sm bg-accent/10 text-accent hover:bg-accent/20 transition-colors ml-auto"
        @click="refreshRandom"
      >
        换一批
      </button>
    </div>

    <!-- 歇后语列表 -->
    <div
      v-if="loading"
      class="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      <div
        v-for="i in 8"
        :key="i"
        class="card p-5"
      >
        <div class="skeleton h-5 w-32 mb-2" />
        <div class="skeleton h-5 w-24" />
      </div>
    </div>

    <div
      v-else-if="displayList.length > 0"
      class="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      <div
        v-for="item in displayList"
        :key="item.id"
        class="card p-5 group cursor-pointer"
        @click="toggleAnswer(item.id)"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <p class="text-text-primary text-lg mb-2">
              {{ item.riddle }} ——
            </p>
            <p
              class="text-primary font-semibold transition-all"
              :class="showAnswers[item.id] ? 'opacity-100' : 'opacity-0'"
            >
              {{ item.answer }}
            </p>
          </div>
          <span
            class="text-xs px-2 py-1 rounded bg-bg-hover text-text-tertiary"
          >
            {{ getTypeLabel(item.type) }}
          </span>
        </div>
        <p
          v-if="item.explanation && showAnswers[item.id]"
          class="text-sm text-text-tertiary mt-2"
        >
          {{ item.explanation }}
        </p>
        <p
          v-if="!showAnswers[item.id]"
          class="text-sm text-text-tertiary mt-2"
        >
          点击查看答案
        </p>
      </div>
    </div>

    <div
      v-else
      class="text-center py-16 text-text-tertiary"
    >
      <p>暂无歇后语</p>
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
import { useXiehouyuStore } from '@/stores/xiehouyu'
import SearchBar from '@/components/common/SearchBar.vue'

const xiehouyuStore = useXiehouyuStore()

const searchQuery = ref('')
const activeType = ref('all')
const currentPage = ref(1)
const pageSize = 20
const loading = ref(true)
const showAnswers = ref({})

const typeFilters = [
  { label: '全部', value: 'all' },
  { label: '谐音类', value: 'harmonic' },
  { label: '喻事类', value: 'metaphor' },
  { label: '故事类', value: 'story' }
]

const typeLabels = {
  harmonic: '谐音',
  metaphor: '喻事',
  story: '故事',
  object: '喻物',
  other: '其他'
}

const getTypeLabel = (type) => {
  return typeLabels[type] || '其他'
}

const filteredList = computed(() => {
  let list = xiehouyuStore.data

  // 按类型筛选
  if (activeType.value !== 'all') {
    list = list.filter(i => i.type === activeType.value)
  }

  // 搜索筛选
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    list = list.filter(i =>
      i.riddle.toLowerCase().includes(query) ||
      i.answer.toLowerCase().includes(query)
    )
  }

  return list
})

const totalPages = computed(() => {
  return Math.ceil(filteredList.value.length / pageSize)
})

const displayList = computed(() => {
  const start = (currentPage.value - 1) * pageSize
  return filteredList.value.slice(start, start + pageSize)
})

const handleSearch = (query) => {
  searchQuery.value = query
  currentPage.value = 1
}

const toggleAnswer = (id) => {
  showAnswers.value[id] = !showAnswers.value[id]
}

const refreshRandom = () => {
  currentPage.value = 1
  showAnswers.value = {}
  // 随机排序
  xiehouyuStore.data.sort(() => Math.random() - 0.5)
}

watch([activeType, searchQuery], () => {
  currentPage.value = 1
  showAnswers.value = {}
})

onMounted(async () => {
  loading.value = true
  await xiehouyuStore.loadData()
  loading.value = false
})
</script>
