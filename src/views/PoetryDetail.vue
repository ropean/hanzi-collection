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
      v-else-if="poem"
      class="max-w-3xl mx-auto"
    >
      <!-- 诗词内容 -->
      <div class="card p-8 lg:p-12 text-center mb-8">
        <div class="flex items-center justify-end mb-6 gap-2">
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

        <h1 class="text-3xl lg:text-4xl font-bold text-primary mb-4 font-poetry">
          {{ poem.title }}
        </h1>

        <p
          v-if="poem.subtitle"
          class="text-lg text-text-secondary mb-4 font-poetry"
        >
          {{ poem.subtitle }}
        </p>

        <p class="text-text-secondary mb-8">
          [{{ poem.dynasty }}] {{ poem.author }}
        </p>

        <div class="space-y-3 font-poetry text-xl lg:text-2xl leading-loose text-text-primary">
          <p
            v-for="(line, index) in poem.paragraphs"
            :key="index"
          >
            {{ line }}
          </p>
        </div>

        <div
          v-if="poem.tags"
          class="flex items-center justify-center gap-2 mt-8 flex-wrap"
        >
          <span
            v-for="tag in poem.tags"
            :key="tag"
            class="tag"
          >
            {{ tag }}
          </span>
        </div>
      </div>

      <!-- 注释 -->
      <div
        v-if="poem.notes && poem.notes.length > 0"
        class="card p-6 mb-6"
      >
        <h2 class="text-lg font-semibold text-text-primary mb-4">
          注释
        </h2>
        <div class="space-y-3">
          <div
            v-for="(note, index) in poem.notes"
            :key="index"
            class="flex"
          >
            <span class="text-primary font-medium mr-2">[{{ note.word }}]</span>
            <span class="text-text-secondary">{{ note.meaning }}</span>
          </div>
        </div>
      </div>

      <!-- 译文 -->
      <div
        v-if="poem.translation"
        class="card p-6 mb-6"
      >
        <h2 class="text-lg font-semibold text-text-primary mb-4">
          译文
        </h2>
        <p class="text-text-secondary leading-relaxed">
          {{ poem.translation }}
        </p>
      </div>

      <!-- 赏析 -->
      <div
        v-if="poem.appreciation"
        class="card p-6 mb-6"
      >
        <h2 class="text-lg font-semibold text-text-primary mb-4">
          赏析
        </h2>
        <p class="text-text-secondary leading-relaxed">
          {{ poem.appreciation }}
        </p>
      </div>

      <!-- 作者简介 -->
      <div
        v-if="author"
        class="card p-6"
      >
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-semibold text-text-primary">
            作者简介
          </h2>
          <router-link
            :to="`/author/${author.id}`"
            class="text-sm text-primary hover:underline"
          >
            查看更多作品
          </router-link>
        </div>
        <div class="flex items-start gap-4">
          <div class="w-16 h-16 rounded-full bg-bg-hover flex items-center justify-center text-2xl text-primary flex-shrink-0">
            {{ poem.author.charAt(0) }}
          </div>
          <div>
            <h3 class="font-semibold text-text-primary mb-1">
              {{ author.name }}
              <span
                v-if="author.courtesy"
                class="font-normal text-text-secondary"
              >
                （字{{ author.courtesy }}）
              </span>
            </h3>
            <p class="text-sm text-text-tertiary mb-2">
              {{ author.dynasty }}代
              <span v-if="author.birth && author.death">
                （{{ author.birth }}—{{ author.death }}）
              </span>
            </p>
            <p class="text-text-secondary text-sm line-clamp-3">
              {{ author.description }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <div
      v-else
      class="text-center py-16 text-text-tertiary"
    >
      <p>未找到该诗词</p>
      <router-link
        to="/poetry"
        class="text-primary hover:underline mt-2 inline-block"
      >
        返回诗词列表
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { usePoetryStore } from '@/stores/poetry'
import { useFavoritesStore } from '@/stores/favorites'
import { useToastStore } from '@/stores/toast'

const route = useRoute()
const poetryStore = usePoetryStore()
const favoritesStore = useFavoritesStore()
const toastStore = useToastStore()

const loading = ref(true)
const poem = ref(null)
const author = ref(null)

const isFavorited = computed(() => {
  if (!poem.value) return false
  return favoritesStore.isFavorite('poetry', poem.value.id)
})

const toggleFavorite = () => {
  if (!poem.value) return

  const added = favoritesStore.toggle('poetry', {
    id: poem.value.id,
    title: poem.value.title,
    author: poem.value.author,
    dynasty: poem.value.dynasty
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
    await poetryStore.loadAll()

    const id = route.params.id
    poem.value = poetryStore.getById(id)

    if (poem.value) {
      author.value = poetryStore.getAuthor(poem.value.author)
    }
  } finally {
    loading.value = false
  }
}

watch(() => route.params.id, loadData)

onMounted(() => {
  favoritesStore.init()
  loadData()
})
</script>
