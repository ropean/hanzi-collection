<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="modelValue"
        class="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4 bg-black/50"
        @click.self="close"
      >
        <Transition name="slide-up">
          <div
            v-if="modelValue"
            class="w-full max-w-2xl bg-white rounded-xl shadow-xl overflow-hidden"
          >
            <!-- 搜索输入框 -->
            <div class="flex items-center gap-3 p-4 border-b border-border">
              <svg
                class="w-5 h-5 text-text-tertiary flex-shrink-0"
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
              <input
                ref="inputRef"
                v-model="query"
                type="text"
                placeholder="搜索汉字、诗词、成语..."
                class="flex-1 text-lg outline-none placeholder:text-text-tertiary"
                @keyup.enter="search"
                @keyup.escape="close"
              >
              <button
                v-if="query"
                class="p-1 hover:bg-bg-hover rounded-full transition-colors"
                @click="query = ''"
              >
                <svg
                  class="w-5 h-5 text-text-tertiary"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <!-- 快捷筛选 -->
            <div class="flex items-center gap-2 px-4 py-3 border-b border-border">
              <button
                v-for="type in searchTypes"
                :key="type.value"
                class="px-3 py-1.5 rounded-full text-sm transition-colors"
                :class="activeType === type.value ? 'bg-primary text-white' : 'bg-bg-hover text-text-secondary hover:bg-bg-active'"
                @click="activeType = type.value"
              >
                {{ type.label }}
              </button>
            </div>

            <!-- 搜索结果/热门推荐 -->
            <div class="max-h-96 overflow-y-auto">
              <!-- 搜索历史 -->
              <div
                v-if="!query && searchHistory.length > 0"
                class="p-4"
              >
                <div class="flex items-center justify-between mb-3">
                  <span class="text-sm text-text-tertiary">搜索历史</span>
                  <button
                    class="text-sm text-text-tertiary hover:text-primary"
                    @click="clearHistory"
                  >
                    清空
                  </button>
                </div>
                <div class="flex flex-wrap gap-2">
                  <button
                    v-for="item in searchHistory"
                    :key="item"
                    class="px-3 py-1.5 bg-bg-hover rounded-full text-sm text-text-secondary hover:bg-bg-active"
                    @click="query = item; search()"
                  >
                    {{ item }}
                  </button>
                </div>
              </div>

              <!-- 热门推荐 -->
              <div
                v-if="!query"
                class="p-4"
              >
                <div class="text-sm text-text-tertiary mb-3">
                  热门推荐
                </div>
                <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <button
                    v-for="item in hotItems"
                    :key="item.text"
                    class="p-3 bg-bg-hover rounded-lg text-left hover:bg-bg-active transition-colors"
                    @click="goTo(item)"
                  >
                    <div class="font-medium text-text-primary">
                      {{ item.text }}
                    </div>
                    <div class="text-xs text-text-tertiary mt-1">
                      {{ item.desc }}
                    </div>
                  </button>
                </div>
              </div>

              <!-- 搜索结果 -->
              <div
                v-if="query && results.length > 0"
                class="divide-y divide-border"
              >
                <button
                  v-for="result in results"
                  :key="result.id"
                  class="w-full p-4 text-left hover:bg-bg-hover transition-colors"
                  @click="goToResult(result)"
                >
                  <div class="flex items-center gap-3">
                    <span class="tag text-xs">{{ result.typeLabel }}</span>
                    <span class="font-medium">{{ result.title }}</span>
                  </div>
                  <p class="text-sm text-text-secondary mt-1 line-clamp-2">
                    {{ result.desc }}
                  </p>
                </button>
              </div>

              <!-- 无结果 -->
              <div
                v-if="query && results.length === 0"
                class="p-8 text-center text-text-tertiary"
              >
                <svg
                  class="w-12 h-12 mx-auto mb-3 text-text-tertiary opacity-50"
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
                <p>未找到相关结果</p>
                <p class="text-sm mt-1">
                  试试其他关键词？
                </p>
              </div>
            </div>

            <!-- 底部提示 -->
            <div class="px-4 py-3 bg-bg-page border-t border-border flex items-center justify-between text-sm text-text-tertiary">
              <div class="flex items-center gap-4">
                <span><kbd class="px-1.5 py-0.5 bg-white rounded border border-border text-xs">Enter</kbd> 搜索</span>
                <span><kbd class="px-1.5 py-0.5 bg-white rounded border border-border text-xs">Esc</kbd> 关闭</span>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch, nextTick, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useSearchStore } from '@/stores/search'

const props = defineProps({
  modelValue: Boolean
})

const emit = defineEmits(['update:modelValue'])

const router = useRouter()
const searchStore = useSearchStore()

const inputRef = ref(null)
const query = ref('')
const activeType = ref('all')
const results = ref([])

const searchTypes = [
  { label: '全部', value: 'all' },
  { label: '汉字', value: 'hanzi' },
  { label: '诗词', value: 'poetry' },
  { label: '成语', value: 'idiom' },
  { label: '歇后语', value: 'xiehouyu' }
]

const hotItems = [
  { text: '龙', desc: '五笔：DXV', type: 'hanzi', path: '/hanzi/龙' },
  { text: '静夜思', desc: '李白', type: 'poetry', path: '/poetry/1' },
  { text: '画龙点睛', desc: '褒义词', type: 'idiom', path: '/idiom/画龙点睛' },
  { text: '外甥打灯笼', desc: '照旧（舅）', type: 'xiehouyu', path: '/xiehouyu' }
]

const searchHistory = computed(() => searchStore.history)

watch(() => props.modelValue, (val) => {
  if (val) {
    nextTick(() => {
      inputRef.value?.focus()
    })
  } else {
    query.value = ''
    results.value = []
  }
})

const close = () => {
  emit('update:modelValue', false)
}

const search = () => {
  if (!query.value.trim()) return

  // 添加到搜索历史
  searchStore.addHistory(query.value.trim())

  // TODO: 实际搜索逻辑
  results.value = []

  // 根据类型跳转
  if (activeType.value === 'hanzi' || /^[\u4e00-\u9fa5]$/.test(query.value)) {
    router.push(`/hanzi/${query.value}`)
    close()
  } else if (activeType.value === 'idiom' && query.value.length === 4) {
    router.push(`/idiom/${query.value}`)
    close()
  }
}

const goTo = (item) => {
  router.push(item.path)
  close()
}

const goToResult = (result) => {
  router.push(result.path)
  close()
}

const clearHistory = () => {
  searchStore.clearHistory()
}
</script>
