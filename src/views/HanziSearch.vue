<template>
  <div class="container py-8">
    <h1 class="text-2xl font-bold text-primary mb-6">
      汉字查询
    </h1>

    <!-- 搜索框 -->
    <div class="max-w-2xl mb-6">
      <SearchBar
        v-model="query"
        placeholder="输入汉字、拼音或五笔编码"
        @search="handleSearch"
      />
    </div>

    <!-- 查询模式切换 -->
    <div class="flex items-center gap-2 mb-8 flex-wrap">
      <button
        v-for="mode in searchModes"
        :key="mode.value"
        class="px-4 py-2 rounded-full text-sm transition-colors"
        :class="activeMode === mode.value
          ? 'bg-primary text-white'
          : 'bg-bg-hover text-text-secondary hover:bg-bg-active'"
        @click="activeMode = mode.value"
      >
        {{ mode.label }}
      </button>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <!-- 左侧：字根键盘图 -->
      <div class="lg:col-span-1">
        <div class="card p-4 sticky top-20">
          <h3 class="font-semibold text-text-primary mb-4">
            86五笔字根键盘
          </h3>
          <div class="space-y-2">
            <!-- 第一行 -->
            <div class="flex gap-1">
              <div
                v-for="key in keyboardRow1"
                :key="key.key"
                class="key-item"
              >
                <span class="key-letter">{{ key.key }}</span>
                <span class="key-roots">{{ key.roots }}</span>
              </div>
            </div>
            <!-- 第二行 -->
            <div class="flex gap-1 pl-4">
              <div
                v-for="key in keyboardRow2"
                :key="key.key"
                class="key-item"
              >
                <span class="key-letter">{{ key.key }}</span>
                <span class="key-roots">{{ key.roots }}</span>
              </div>
            </div>
            <!-- 第三行 -->
            <div class="flex gap-1 pl-8">
              <div
                v-for="key in keyboardRow3"
                :key="key.key"
                class="key-item"
              >
                <span class="key-letter">{{ key.key }}</span>
                <span class="key-roots">{{ key.roots }}</span>
              </div>
            </div>
          </div>
          <router-link
            to="/wubi"
            class="block mt-4 text-center text-sm text-primary hover:underline"
          >
            查看完整字根表
          </router-link>
        </div>
      </div>

      <!-- 右侧：搜索结果 -->
      <div class="lg:col-span-2">
        <div
          v-if="loading"
          class="flex items-center justify-center h-64"
        >
          <div class="animate-pulse text-text-tertiary">
            搜索中...
          </div>
        </div>

        <div
          v-else-if="results.length > 0"
          class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
        >
          <router-link
            v-for="item in results"
            :key="item.char"
            :to="`/hanzi/${item.char}`"
            class="card p-4 text-center"
          >
            <span class="text-4xl text-primary block mb-3">{{ item.char }}</span>
            <div class="space-y-1 text-sm">
              <p class="text-text-secondary">
                {{ item.pinyin }}
              </p>
              <p class="font-mono text-primary">
                {{ item.wubi }}
              </p>
            </div>
          </router-link>
        </div>

        <div
          v-else-if="query && !loading"
          class="text-center py-16 text-text-tertiary"
        >
          <svg
            class="w-16 h-16 mx-auto mb-4 opacity-50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <p>未找到相关汉字</p>
          <p class="text-sm mt-2">
            试试其他搜索词？
          </p>
        </div>

        <div
          v-else
          class="text-center py-16 text-text-tertiary"
        >
          <svg
            class="w-16 h-16 mx-auto mb-4 opacity-50"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <p>输入汉字、拼音或五笔编码开始搜索</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useHanziStore } from '@/stores/hanzi'
import SearchBar from '@/components/common/SearchBar.vue'

const route = useRoute()
const hanziStore = useHanziStore()

const query = ref('')
const activeMode = ref('all')
const results = ref([])
const loading = ref(false)

const searchModes = [
  { label: '综合查询', value: 'all' },
  { label: '五笔编码', value: 'wubi' },
  { label: '拼音查询', value: 'pinyin' }
]

// 86五笔键盘布局
const keyboardRow1 = [
  { key: 'Q', roots: '金勹' },
  { key: 'W', roots: '人八' },
  { key: 'E', roots: '月用' },
  { key: 'R', roots: '白手' },
  { key: 'T', roots: '禾竹' },
  { key: 'Y', roots: '言文' },
  { key: 'U', roots: '立辛' },
  { key: 'I', roots: '水氵' },
  { key: 'O', roots: '火灬' },
  { key: 'P', roots: '之廴' }
]

const keyboardRow2 = [
  { key: 'A', roots: '工七' },
  { key: 'S', roots: '木西' },
  { key: 'D', roots: '大三' },
  { key: 'F', roots: '土士' },
  { key: 'G', roots: '王五' },
  { key: 'H', roots: '目上' },
  { key: 'J', roots: '日早' },
  { key: 'K', roots: '口中' },
  { key: 'L', roots: '田四' }
]

const keyboardRow3 = [
  { key: 'Z', roots: '纟幺' },
  { key: 'X', roots: '幺弓' },
  { key: 'C', roots: '又马' },
  { key: 'V', roots: '女刀' },
  { key: 'B', roots: '子耳' },
  { key: 'N', roots: '已巳' },
  { key: 'M', roots: '山由' }
]

const handleSearch = async (q) => {
  if (!q.trim()) {
    results.value = []
    return
  }

  loading.value = true

  try {
    await hanziStore.loadData()
    results.value = hanziStore.search(q)
  } finally {
    loading.value = false
  }
}

watch(query, (val) => {
  if (val) {
    handleSearch(val)
  } else {
    results.value = []
  }
})

onMounted(async () => {
  await hanziStore.loadData()

  // 检查URL参数
  if (route.query.q) {
    query.value = route.query.q
    handleSearch(route.query.q)
  }
})
</script>

<style scoped>
.key-item {
  flex: 1;
  background-color: var(--color-bg-hover);
  border-radius: 4px;
  padding: 8px;
  text-align: center;
  min-width: 0;
}

.key-letter {
  display: block;
  font-size: 0.875rem;
  font-weight: 700;
  color: var(--color-primary);
}

.key-roots {
  display: block;
  font-size: 0.75rem;
  color: var(--color-text-tertiary);
  margin-top: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
