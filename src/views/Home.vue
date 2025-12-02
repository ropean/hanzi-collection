<template>
  <div class="min-h-screen">
    <!-- Hero Section -->
    <section class="py-16 lg:py-24 bg-gradient-to-b from-white to-bg-page">
      <div class="container text-center">
        <h1 class="text-4xl lg:text-5xl font-bold text-primary mb-4">
          汉 字 集
        </h1>
        <p class="text-lg text-text-secondary mb-8">
          探索汉字之美，品味诗词之韵
        </p>

        <!-- 搜索框 -->
        <div class="max-w-xl mx-auto mb-6">
          <SearchBar
            v-model="searchQuery"
            placeholder="搜索汉字、诗词、成语..."
            @search="handleSearch"
          />
        </div>

        <!-- 快捷筛选 -->
        <div class="flex items-center justify-center gap-3 flex-wrap">
          <router-link
            v-for="item in quickLinks"
            :key="item.path"
            :to="item.path"
            class="px-4 py-2 rounded-full text-sm border border-border hover:border-primary hover:text-primary transition-colors"
          >
            {{ item.name }}
          </router-link>
        </div>
      </div>
    </section>

    <!-- 快捷入口 -->
    <section class="py-12 container">
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        <router-link
          v-for="entry in quickEntries"
          :key="entry.path"
          :to="entry.path"
          class="card p-6 text-center group"
        >
          <div
            class="w-14 h-14 mx-auto mb-4 rounded-xl flex items-center justify-center text-2xl"
            :class="entry.bgClass"
          >
            {{ entry.icon }}
          </div>
          <h3 class="font-semibold text-text-primary mb-1">
            {{ entry.title }}
          </h3>
          <p class="text-sm text-text-tertiary">
            {{ entry.desc }}
          </p>
        </router-link>
      </div>
    </section>

    <!-- 今日诗词 -->
    <section class="py-12 container">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-semibold text-text-primary">
          今日诗词
        </h2>
        <button
          class="text-sm text-text-tertiary hover:text-primary transition-colors"
          @click="refreshDaily"
        >
          换一首
        </button>
      </div>

      <div
        v-if="dailyPoem"
        class="card p-8 text-center"
      >
        <h3 class="text-2xl font-bold text-primary mb-2 font-poetry">
          {{ dailyPoem.title }}
        </h3>
        <p class="text-text-secondary mb-6">
          [{{ dailyPoem.dynasty }}] {{ dailyPoem.author }}
        </p>
        <div class="max-w-2xl mx-auto space-y-2 font-poetry text-lg leading-loose">
          <p
            v-for="(line, index) in dailyPoem.paragraphs.slice(0, 4)"
            :key="index"
          >
            {{ line }}
          </p>
          <p
            v-if="dailyPoem.paragraphs.length > 4"
            class="text-text-tertiary"
          >
            ...
          </p>
        </div>
        <router-link
          :to="`/poetry/${dailyPoem.id}`"
          class="inline-flex items-center gap-1 mt-6 text-primary hover:underline"
        >
          阅读全文
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </router-link>
      </div>
      <div
        v-else
        class="card p-8"
      >
        <div class="flex items-center justify-center h-40">
          <div class="animate-pulse text-text-tertiary">
            加载中...
          </div>
        </div>
      </div>
    </section>

    <!-- 热门汉字 -->
    <section class="py-12 container">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-semibold text-text-primary">
          热门汉字
        </h2>
        <router-link
          to="/hanzi"
          class="text-sm text-text-tertiary hover:text-primary transition-colors flex items-center gap-1"
        >
          查看更多
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </router-link>
      </div>

      <div class="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-10 gap-3">
        <router-link
          v-for="char in hotChars"
          :key="char.char"
          :to="`/hanzi/${char.char}`"
          class="card p-4 text-center"
        >
          <span class="text-3xl text-primary block mb-2">{{ char.char }}</span>
          <span class="text-xs text-text-tertiary font-mono">{{ char.wubi }}</span>
        </router-link>
      </div>
    </section>

    <!-- 成语精选 -->
    <section class="py-12 container">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-semibold text-text-primary">
          成语精选
        </h2>
        <router-link
          to="/idiom"
          class="text-sm text-text-tertiary hover:text-primary transition-colors flex items-center gap-1"
        >
          查看更多
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </router-link>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <router-link
          v-for="idiom in featuredIdioms"
          :key="idiom.word"
          :to="`/idiom/${idiom.word}`"
          class="card p-5"
        >
          <h3 class="text-lg font-semibold text-primary mb-2">
            {{ idiom.word }}
          </h3>
          <p class="text-sm text-text-secondary line-clamp-2">
            {{ idiom.explanation }}
          </p>
        </router-link>
      </div>
    </section>

    <!-- 歇后语 -->
    <section class="py-12 container pb-20 lg:pb-12">
      <div class="flex items-center justify-between mb-6">
        <h2 class="text-xl font-semibold text-text-primary">
          歇后语
        </h2>
        <router-link
          to="/xiehouyu"
          class="text-sm text-text-tertiary hover:text-primary transition-colors flex items-center gap-1"
        >
          查看更多
          <svg
            class="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 5l7 7-7 7"
            />
          </svg>
        </router-link>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div
          v-for="xhy in featuredXiehouyu"
          :key="xhy.id"
          class="card p-5"
        >
          <p class="text-text-primary mb-2">
            {{ xhy.riddle }} ——
          </p>
          <p class="text-primary font-semibold">
            {{ xhy.answer }}
          </p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { usePoetryStore } from '@/stores/poetry'
import { useIdiomStore } from '@/stores/idiom'
import { useXiehouyuStore } from '@/stores/xiehouyu'
import SearchBar from '@/components/common/SearchBar.vue'

const router = useRouter()
const poetryStore = usePoetryStore()
const idiomStore = useIdiomStore()
const xiehouyuStore = useXiehouyuStore()

const searchQuery = ref('')
const dailyPoem = ref(null)
const featuredIdioms = ref([])
const featuredXiehouyu = ref([])

const quickLinks = [
  { name: '汉字', path: '/hanzi' },
  { name: '诗词', path: '/poetry' },
  { name: '成语', path: '/idiom' },
  { name: '歇后语', path: '/xiehouyu' }
]

const quickEntries = [
  {
    title: '五笔查字',
    desc: '86版五笔编码查询',
    path: '/hanzi',
    icon: '字',
    bgClass: 'bg-blue-50 text-blue-600'
  },
  {
    title: '唐诗欣赏',
    desc: '千古名篇',
    path: '/poetry/tang',
    icon: '诗',
    bgClass: 'bg-green-50 text-green-600'
  },
  {
    title: '宋词品读',
    desc: '婉约豪放',
    path: '/poetry/song',
    icon: '词',
    bgClass: 'bg-purple-50 text-purple-600'
  },
  {
    title: '成语学习',
    desc: '博大精深',
    path: '/idiom',
    icon: '语',
    bgClass: 'bg-orange-50 text-orange-600'
  }
]

const hotChars = [
  { char: '龙', wubi: 'DXV' },
  { char: '凤', wubi: 'MCI' },
  { char: '福', wubi: 'PYGL' },
  { char: '爱', wubi: 'EPDC' },
  { char: '国', wubi: 'LGYI' },
  { char: '家', wubi: 'PEU' },
  { char: '学', wubi: 'IPBF' },
  { char: '诗', wubi: 'YFFY' },
  { char: '词', wubi: 'YNGK' },
  { char: '文', wubi: 'YYGY' }
]

const handleSearch = (query) => {
  if (!query.trim()) return

  // 判断搜索类型
  if (/^[\u4e00-\u9fa5]$/.test(query)) {
    // 单个汉字
    router.push(`/hanzi/${query}`)
  } else if (/^[\u4e00-\u9fa5]{4}$/.test(query)) {
    // 四字成语
    router.push(`/idiom/${query}`)
  } else {
    // 默认搜索诗词
    router.push({ path: '/poetry', query: { q: query } })
  }
}

const refreshDaily = () => {
  dailyPoem.value = poetryStore.getRandom()
}

onMounted(async () => {
  // 加载数据
  await Promise.all([
    poetryStore.loadAll(),
    idiomStore.loadData(),
    xiehouyuStore.loadData()
  ])

  // 设置今日诗词
  dailyPoem.value = poetryStore.getDailyRecommend()

  // 设置精选成语
  featuredIdioms.value = idiomStore.getRandom(4)

  // 设置精选歇后语
  featuredXiehouyu.value = xiehouyuStore.getRandom(4)
})
</script>
