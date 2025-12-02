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
      v-else-if="author"
      class="max-w-4xl mx-auto"
    >
      <!-- 作者信息 -->
      <div class="card p-8 mb-8">
        <div class="flex items-start gap-6">
          <div class="w-24 h-24 rounded-full bg-bg-hover flex items-center justify-center text-4xl text-primary flex-shrink-0">
            {{ author.name.charAt(0) }}
          </div>
          <div class="flex-1">
            <h1 class="text-3xl font-bold text-primary mb-2">
              {{ author.name }}
            </h1>
            <div class="flex items-center gap-4 text-text-secondary mb-4 flex-wrap">
              <span v-if="author.courtesy">字 {{ author.courtesy }}</span>
              <span v-if="author.alias">号 {{ author.alias }}</span>
              <span
                v-if="author.title"
                class="text-accent"
              >{{ author.title }}</span>
            </div>
            <p class="text-text-tertiary mb-4">
              {{ author.dynasty }}代
              <span v-if="author.birth && author.death">
                （{{ author.birth }}—{{ author.death }}）
              </span>
            </p>
            <p class="text-text-secondary leading-relaxed">
              {{ author.description }}
            </p>
          </div>
        </div>
      </div>

      <!-- 作品列表 -->
      <div>
        <h2 class="text-xl font-semibold text-text-primary mb-6">
          作品列表（{{ works.length }}首）
        </h2>

        <div
          v-if="works.length > 0"
          class="grid grid-cols-1 md:grid-cols-2 gap-4"
        >
          <router-link
            v-for="work in works"
            :key="work.id"
            :to="`/poetry/${work.id}`"
            class="card p-5 group"
          >
            <h3 class="text-lg font-semibold text-primary group-hover:text-accent transition-colors mb-2">
              {{ work.title }}
            </h3>
            <div class="font-poetry text-text-secondary text-sm leading-relaxed">
              <p
                v-for="(line, index) in work.paragraphs.slice(0, 2)"
                :key="index"
              >
                {{ line }}
              </p>
              <p
                v-if="work.paragraphs.length > 2"
                class="text-text-tertiary"
              >
                ...
              </p>
            </div>
          </router-link>
        </div>

        <div
          v-else
          class="text-center py-8 text-text-tertiary"
        >
          暂无作品
        </div>
      </div>
    </div>

    <div
      v-else
      class="text-center py-16 text-text-tertiary"
    >
      <p>未找到该作者信息</p>
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
import { ref, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { usePoetryStore } from '@/stores/poetry'

const route = useRoute()
const poetryStore = usePoetryStore()

const loading = ref(true)
const author = ref(null)
const works = ref([])

const loadData = async () => {
  loading.value = true

  try {
    await poetryStore.loadAll()

    const authorId = route.params.id
    author.value = poetryStore.authors[authorId] || Object.values(poetryStore.authors).find(a => a.id === authorId)

    if (author.value) {
      works.value = poetryStore.getByAuthor(author.value.name)
    }
  } finally {
    loading.value = false
  }
}

watch(() => route.params.id, loadData)

onMounted(loadData)
</script>
