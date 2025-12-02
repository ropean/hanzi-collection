<template>
  <div class="container py-8">
    <!-- 返回按钮 -->
    <button
      class="flex items-center gap-2 text-text-secondary hover:text-primary mb-6 transition-colors"
      @click="$router.back()"
    >
      <svg
        class="w-5 h-5"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M15 19l-7-7 7-7"
        />
      </svg>
      返回
    </button>

    <div
      v-if="loading"
      class="flex items-center justify-center h-64"
    >
      <div class="animate-pulse text-text-tertiary">
        加载中...
      </div>
    </div>

    <div
      v-else-if="idiom"
      class="max-w-3xl mx-auto"
    >
      <!-- 成语标题 -->
      <div class="card p-8 text-center mb-6">
        <div class="flex items-center justify-end mb-4">
          <button
            class="p-2 rounded-lg hover:bg-bg-hover transition-colors"
            :class="isFavorited ? 'text-accent' : 'text-text-tertiary'"
            @click="toggleFavorite"
          >
            <svg
              class="w-6 h-6"
              :fill="isFavorited ? 'currentColor' : 'none'"
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
          </button>
        </div>

        <h1 class="text-4xl font-bold text-primary mb-3">
          {{ idiom.word }}
        </h1>
        <p class="text-lg text-text-secondary mb-4">
          {{ idiom.pinyin }}
        </p>
        <span
          v-if="idiom.emotion"
          class="inline-block px-3 py-1 rounded-full text-sm"
          :class="{
            'bg-green-100 text-green-600': idiom.emotion === '褒义',
            'bg-red-100 text-red-600': idiom.emotion === '贬义',
            'bg-gray-100 text-gray-600': idiom.emotion === '中性'
          }"
        >
          {{ idiom.emotion }}
        </span>
      </div>

      <!-- 释义 -->
      <div class="card p-6 mb-6">
        <h2 class="text-lg font-semibold text-text-primary mb-4">
          释义
        </h2>
        <p class="text-text-secondary leading-relaxed">
          {{ idiom.explanation }}
        </p>
      </div>

      <!-- 出处 -->
      <div
        v-if="idiom.derivation"
        class="card p-6 mb-6"
      >
        <h2 class="text-lg font-semibold text-text-primary mb-4">
          出处
        </h2>
        <p class="text-text-secondary leading-relaxed font-poetry">
          {{ idiom.derivation }}
        </p>
      </div>

      <!-- 例句 -->
      <div
        v-if="idiom.example"
        class="card p-6 mb-6"
      >
        <h2 class="text-lg font-semibold text-text-primary mb-4">
          例句
        </h2>
        <p class="text-text-secondary leading-relaxed">
          {{ idiom.example }}
        </p>
      </div>

      <!-- 用法 -->
      <div
        v-if="idiom.usage"
        class="card p-6 mb-6"
      >
        <h2 class="text-lg font-semibold text-text-primary mb-4">
          用法
        </h2>
        <p class="text-text-secondary leading-relaxed">
          {{ idiom.usage }}
        </p>
      </div>

      <!-- 近义词/反义词 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div
          v-if="idiom.synonyms && idiom.synonyms.length > 0"
          class="card p-6"
        >
          <h2 class="text-lg font-semibold text-text-primary mb-4">
            近义词
          </h2>
          <div class="flex flex-wrap gap-2">
            <router-link
              v-for="word in idiom.synonyms"
              :key="word"
              :to="`/idiom/${word}`"
              class="tag hover:bg-bg-active"
            >
              {{ word }}
            </router-link>
          </div>
        </div>

        <div
          v-if="idiom.antonyms && idiom.antonyms.length > 0"
          class="card p-6"
        >
          <h2 class="text-lg font-semibold text-text-primary mb-4">
            反义词
          </h2>
          <div class="flex flex-wrap gap-2">
            <router-link
              v-for="word in idiom.antonyms"
              :key="word"
              :to="`/idiom/${word}`"
              class="tag hover:bg-bg-active"
            >
              {{ word }}
            </router-link>
          </div>
        </div>
      </div>

      <!-- 成语故事 -->
      <div
        v-if="idiom.story"
        class="card p-6"
      >
        <h2 class="text-lg font-semibold text-text-primary mb-4">
          成语故事
        </h2>
        <p class="text-text-secondary leading-relaxed">
          {{ idiom.story }}
        </p>
      </div>
    </div>

    <div
      v-else
      class="text-center py-16 text-text-tertiary"
    >
      <p>未找到该成语</p>
      <router-link
        to="/idiom"
        class="text-primary hover:underline mt-2 inline-block"
      >
        返回成语列表
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useIdiomStore } from '@/stores/idiom'
import { useFavoritesStore } from '@/stores/favorites'
import { useToastStore } from '@/stores/toast'

const route = useRoute()
const idiomStore = useIdiomStore()
const favoritesStore = useFavoritesStore()
const toastStore = useToastStore()

const loading = ref(true)
const idiom = ref(null)

const isFavorited = computed(() => {
  if (!idiom.value) return false
  return favoritesStore.isFavorite('idiom', idiom.value.word)
})

const toggleFavorite = () => {
  if (!idiom.value) return

  const added = favoritesStore.toggle('idiom', {
    id: idiom.value.word,
    word: idiom.value.word,
    pinyin: idiom.value.pinyin,
    explanation: idiom.value.explanation
  })

  if (added) {
    toastStore.success('已添加到收藏')
  } else {
    toastStore.info('已取消收藏')
  }
}

const loadData = async () => {
  loading.value = true

  try {
    await idiomStore.loadData()

    const word = route.params.word
    idiom.value = idiomStore.getByWord(word)
  } finally {
    loading.value = false
  }
}

watch(() => route.params.word, loadData)

onMounted(() => {
  favoritesStore.init()
  loadData()
})
</script>
