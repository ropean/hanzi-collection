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
      v-else-if="hanziInfo"
      class="grid grid-cols-1 lg:grid-cols-3 gap-8"
    >
      <!-- 左侧：笔顺动画 -->
      <div class="lg:col-span-1">
        <div class="card p-6 text-center sticky top-20">
          <!-- 笔顺动画区域 -->
          <div
            ref="writerRef"
            class="w-48 h-48 mx-auto mb-4 border border-border rounded-lg"
          />

          <!-- 控制按钮 -->
          <div class="flex items-center justify-center gap-3">
            <button
              class="btn btn-primary"
              :disabled="isAnimating"
              @click="playAnimation"
            >
              <svg
                class="w-4 h-4 mr-1"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
              </svg>
              播放笔顺
            </button>
            <button
              class="btn btn-secondary"
              @click="startQuiz"
            >
              练习模式
            </button>
          </div>
        </div>
      </div>

      <!-- 右侧：汉字信息 -->
      <div class="lg:col-span-2 space-y-6">
        <!-- 基本信息 -->
        <div class="card p-6">
          <div class="flex items-start justify-between mb-6">
            <span class="text-7xl text-primary font-bold">{{ char }}</span>
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

          <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div class="info-item">
              <span class="info-label">拼音</span>
              <span class="info-value">{{ hanziInfo.pinyin }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">五笔</span>
              <span class="info-value font-mono text-primary">{{ hanziInfo.wubi }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">部首</span>
              <span class="info-value">{{ hanziInfo.radical || '-' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">笔画</span>
              <span class="info-value">{{ hanziInfo.strokes || '-' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">结构</span>
              <span class="info-value">{{ hanziInfo.structure || '-' }}</span>
            </div>
          </div>
        </div>

        <!-- 字根拆解 -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-text-primary mb-4">
            五笔字根拆解
          </h3>
          <div class="bg-bg-page rounded-lg p-4 text-center">
            <div class="flex items-center justify-center gap-3 text-2xl flex-wrap">
              <template v-if="hanziInfo.wubi && hanziInfo.wubi !== '未收录'">
                <span
                  v-for="(code, index) in hanziInfo.wubi.split('')"
                  :key="index"
                  class="inline-flex items-center gap-1"
                >
                  <span class="text-primary">{{ getKeyRoot(code) }}</span>
                  <span class="text-sm text-text-tertiary">({{ code }})</span>
                  <span
                    v-if="index < hanziInfo.wubi.length - 1"
                    class="text-text-tertiary"
                  >+</span>
                </span>
              </template>
              <span
                v-else
                class="text-text-tertiary text-base"
              >暂无拆解信息</span>
            </div>
            <p class="text-sm text-text-tertiary mt-3">
              完整编码：<span class="font-mono text-primary">{{ hanziInfo.wubi }}</span>
            </p>
          </div>
        </div>

        <!-- 组词 -->
        <div class="card p-6">
          <h3 class="text-lg font-semibold text-text-primary mb-4">
            常用组词
          </h3>
          <div class="flex flex-wrap gap-2">
            <router-link
              v-for="word in commonWords"
              :key="word"
              :to="`/hanzi/${word[0]}`"
              class="tag hover:bg-bg-active"
            >
              {{ word }}
            </router-link>
          </div>
        </div>
      </div>
    </div>

    <div
      v-else
      class="text-center py-16 text-text-tertiary"
    >
      <p>未找到该汉字的信息</p>
      <router-link
        to="/hanzi"
        class="text-primary hover:underline mt-2 inline-block"
      >
        返回汉字查询
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue'
import { useRoute } from 'vue-router'
import HanziWriter from 'hanzi-writer'
import { useHanziStore } from '@/stores/hanzi'
import { useFavoritesStore } from '@/stores/favorites'
import { useToastStore } from '@/stores/toast'

const route = useRoute()
const hanziStore = useHanziStore()
const favoritesStore = useFavoritesStore()
const toastStore = useToastStore()

const writerRef = ref(null)
const loading = ref(true)
const isAnimating = ref(false)
let writer = null

const char = computed(() => route.params.char)
const hanziInfo = ref(null)

const isFavorited = computed(() => {
  return favoritesStore.isFavorite('hanzi', char.value)
})

// 常用组词示例
const commonWords = computed(() => {
  const c = char.value
  const words = {
    '龙': ['龙凤', '龙舟', '龙年', '恐龙', '巨龙'],
    '凤': ['凤凰', '龙凤', '凤梨', '凤仙'],
    '福': ['幸福', '福气', '祝福', '福利', '福音'],
    '爱': ['爱情', '热爱', '可爱', '爱心', '爱好'],
    '国': ['国家', '中国', '祖国', '国际', '国民'],
    '家': ['家庭', '国家', '大家', '作家', '家乡'],
    '学': ['学习', '学校', '科学', '文学', '学生'],
    '汉': ['汉字', '汉语', '汉族', '汉朝', '好汉']
  }
  return words[c] || [`${c}字`, `${c}人`, `${c}事`]
})

// 字根映射
const keyRoots = {
  'Q': '金', 'W': '人', 'E': '月', 'R': '白', 'T': '禾',
  'Y': '言', 'U': '立', 'I': '水', 'O': '火', 'P': '之',
  'A': '工', 'S': '木', 'D': '大', 'F': '土', 'G': '王',
  'H': '目', 'J': '日', 'K': '口', 'L': '田', 'M': '山',
  'Z': '纟', 'X': '幺', 'C': '又', 'V': '女', 'B': '子', 'N': '己'
}

const getKeyRoot = (code) => {
  return keyRoots[code.toUpperCase()] || code
}

const initWriter = () => {
  if (!writerRef.value || !char.value) return

  // 清除之前的实例
  if (writer) {
    writerRef.value.innerHTML = ''
    writer = null
  }

  try {
    writer = HanziWriter.create(writerRef.value, char.value, {
      width: 180,
      height: 180,
      padding: 5,
      strokeAnimationSpeed: 1,
      delayBetweenStrokes: 300,
      strokeColor: '#2c3e50',
      radicalColor: '#c0392b',
      showOutline: true,
      showCharacter: true
    })
  } catch (error) {
    console.error('Failed to initialize HanziWriter:', error)
  }
}

const playAnimation = () => {
  if (!writer || isAnimating.value) return

  isAnimating.value = true
  writer.animateCharacter({
    onComplete: () => {
      isAnimating.value = false
    }
  })
}

const startQuiz = () => {
  if (!writer) return

  writer.quiz({
    onMistake: () => {
      toastStore.warning('笔画不对，再试一次')
    },
    onComplete: () => {
      toastStore.success('写得很好！')
    }
  })
}

const toggleFavorite = () => {
  const added = favoritesStore.toggle('hanzi', {
    id: char.value,
    char: char.value,
    pinyin: hanziInfo.value?.pinyin,
    wubi: hanziInfo.value?.wubi
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
    await hanziStore.loadData()
    hanziInfo.value = hanziStore.getHanzi(char.value)
  } finally {
    loading.value = false
  }
}

watch(() => route.params.char, () => {
  loadData()
  setTimeout(initWriter, 100)
})

onMounted(async () => {
  favoritesStore.init()
  await loadData()
  setTimeout(initWriter, 100)
})

onBeforeUnmount(() => {
  if (writer) {
    writerRef.value.innerHTML = ''
    writer = null
  }
})
</script>

<style scoped>
.info-item {
  display: flex;
  flex-direction: column;
}

.info-label {
  font-size: 0.875rem;
  color: var(--color-text-tertiary);
  margin-bottom: 0.25rem;
}

.info-value {
  font-size: 1.125rem;
  color: var(--color-text-primary);
}
</style>
