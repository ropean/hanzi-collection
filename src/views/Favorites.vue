<template>
  <div class="container py-8">
    <h1 class="text-2xl font-bold text-primary mb-6">
      我的收藏
    </h1>

    <!-- 分类标签 -->
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
        <span
          v-if="getCounts(tab.value)"
          class="ml-1 opacity-75"
        >
          ({{ getCounts(tab.value) }})
        </span>
      </button>
    </div>

    <!-- 汉字收藏 -->
    <div
      v-if="activeTab === 'all' || activeTab === 'hanzi'"
      class="mb-8"
    >
      <div v-if="hanziList.length > 0">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-text-primary">
            汉字 ({{ hanziList.length }})
          </h2>
        </div>
        <div class="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
          <router-link
            v-for="item in hanziList"
            :key="item.id"
            :to="`/hanzi/${item.char}`"
            class="card p-3 text-center"
          >
            <span class="text-2xl text-primary block">{{ item.char }}</span>
            <span class="text-xs text-text-tertiary font-mono">{{ item.wubi }}</span>
          </router-link>
        </div>
      </div>
      <div
        v-else-if="activeTab === 'hanzi'"
        class="text-center py-12 text-text-tertiary"
      >
        <p>暂无汉字收藏</p>
        <router-link
          to="/hanzi"
          class="text-primary hover:underline mt-2 inline-block"
        >
          去看看汉字
        </router-link>
      </div>
    </div>

    <!-- 诗词收藏 -->
    <div
      v-if="activeTab === 'all' || activeTab === 'poetry'"
      class="mb-8"
    >
      <div v-if="poetryList.length > 0">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-text-primary">
            诗词 ({{ poetryList.length }})
          </h2>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <router-link
            v-for="item in poetryList"
            :key="item.id"
            :to="`/poetry/${item.id}`"
            class="card p-4"
          >
            <h3 class="font-semibold text-primary">
              {{ item.title }}
            </h3>
            <p class="text-sm text-text-tertiary">
              [{{ item.dynasty }}] {{ item.author }}
            </p>
          </router-link>
        </div>
      </div>
      <div
        v-else-if="activeTab === 'poetry'"
        class="text-center py-12 text-text-tertiary"
      >
        <p>暂无诗词收藏</p>
        <router-link
          to="/poetry"
          class="text-primary hover:underline mt-2 inline-block"
        >
          去看看诗词
        </router-link>
      </div>
    </div>

    <!-- 成语收藏 -->
    <div
      v-if="activeTab === 'all' || activeTab === 'idiom'"
      class="mb-8"
    >
      <div v-if="idiomList.length > 0">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-text-primary">
            成语 ({{ idiomList.length }})
          </h2>
        </div>
        <div class="flex flex-wrap gap-2">
          <router-link
            v-for="item in idiomList"
            :key="item.id"
            :to="`/idiom/${item.word}`"
            class="tag hover:bg-bg-active"
          >
            {{ item.word }}
          </router-link>
        </div>
      </div>
      <div
        v-else-if="activeTab === 'idiom'"
        class="text-center py-12 text-text-tertiary"
      >
        <p>暂无成语收藏</p>
        <router-link
          to="/idiom"
          class="text-primary hover:underline mt-2 inline-block"
        >
          去看看成语
        </router-link>
      </div>
    </div>

    <!-- 空状态 -->
    <div
      v-if="activeTab === 'all' && totalCount === 0"
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
          d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
        />
      </svg>
      <p>还没有收藏内容</p>
      <p class="text-sm mt-2">
        浏览时点击爱心图标即可收藏
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useFavoritesStore } from '@/stores/favorites'

const favoritesStore = useFavoritesStore()

const activeTab = ref('all')

const tabs = [
  { label: '全部', value: 'all' },
  { label: '汉字', value: 'hanzi' },
  { label: '诗词', value: 'poetry' },
  { label: '成语', value: 'idiom' }
]

const hanziList = computed(() => favoritesStore.items.hanzi || [])
const poetryList = computed(() => favoritesStore.items.poetry || [])
const idiomList = computed(() => favoritesStore.items.idiom || [])
const totalCount = computed(() => favoritesStore.totalCount)

const getCounts = (type) => {
  if (type === 'all') return totalCount.value
  return favoritesStore.getCount(type)
}

onMounted(() => {
  favoritesStore.init()
})
</script>
