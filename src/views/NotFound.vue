<template>
  <div class="container py-16">
    <div class="max-w-md mx-auto text-center">
      <div class="text-8xl font-bold text-primary/20 mb-4">
        404
      </div>

      <h1 class="text-2xl font-bold text-text-primary mb-4">
        页面未找到
      </h1>

      <p class="text-text-tertiary mb-8">
        抱歉，您访问的页面不存在或已被移除。
      </p>

      <div class="space-y-4">
        <router-link
          to="/"
          class="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl hover:bg-primary-dark transition-colors"
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
              d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
            />
          </svg>
          返回首页
        </router-link>

        <div class="flex justify-center gap-4 text-sm">
          <router-link
            to="/hanzi"
            class="text-primary hover:underline"
          >
            汉字查询
          </router-link>
          <router-link
            to="/poetry"
            class="text-primary hover:underline"
          >
            诗词欣赏
          </router-link>
          <router-link
            to="/idiom"
            class="text-primary hover:underline"
          >
            成语词典
          </router-link>
        </div>
      </div>

      <!-- 装饰性汉字 -->
      <div class="mt-16 flex justify-center gap-4 text-4xl text-text-tertiary/30">
        <span>迷</span>
        <span>途</span>
        <span>知</span>
        <span>返</span>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>
