<template>
  <div class="container py-8">
    <h1 class="text-2xl font-bold text-primary mb-6">
      关于汉字集
    </h1>

    <div class="max-w-3xl mx-auto space-y-8">
      <!-- 项目介绍 -->
      <div class="card p-8">
        <div class="text-center mb-8">
          <div class="w-20 h-20 mx-auto bg-primary/10 rounded-2xl flex items-center justify-center mb-4">
            <span class="text-4xl">字</span>
          </div>
          <h2 class="text-2xl font-bold text-text-primary mb-2">
            汉字集
          </h2>
          <p class="text-text-tertiary">
            传承汉字之美，弘扬中华文化
          </p>
        </div>

        <div class="prose prose-neutral max-w-none text-text-secondary leading-relaxed space-y-4">
          <p>
            汉字集是一个专注于汉字学习与中华文化传承的工具平台。我们致力于为用户提供便捷的汉字查询、
            诗词欣赏、成语学习等功能，帮助用户更好地理解和掌握中华文字的魅力。
          </p>
          <p>
            无论您是学习五笔输入法的初学者，还是热爱古典诗词的文学爱好者，
            亦或是想要丰富成语知识的学生，汉字集都能为您提供实用的帮助。
          </p>
        </div>
      </div>

      <!-- 功能特色 -->
      <div class="card p-8">
        <h3 class="text-lg font-semibold text-text-primary mb-6">
          功能特色
        </h3>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="flex gap-4">
            <div class="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg
                class="w-6 h-6 text-primary"
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
            </div>
            <div>
              <h4 class="font-semibold text-text-primary mb-1">
                汉字查询
              </h4>
              <p class="text-sm text-text-tertiary">
                支持拼音、五笔编码查询，提供笔顺动画演示
              </p>
            </div>
          </div>

          <div class="flex gap-4">
            <div class="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg
                class="w-6 h-6 text-accent"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <div>
              <h4 class="font-semibold text-text-primary mb-1">
                诗词欣赏
              </h4>
              <p class="text-sm text-text-tertiary">
                精选唐诗宋词，配有注释和译文
              </p>
            </div>
          </div>

          <div class="flex gap-4">
            <div class="w-12 h-12 bg-green-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg
                class="w-6 h-6 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <div>
              <h4 class="font-semibold text-text-primary mb-1">
                成语词典
              </h4>
              <p class="text-sm text-text-tertiary">
                收录常用成语，包含释义、出处和故事
              </p>
            </div>
          </div>

          <div class="flex gap-4">
            <div class="w-12 h-12 bg-yellow-500/10 rounded-xl flex items-center justify-center flex-shrink-0">
              <svg
                class="w-6 h-6 text-yellow-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
            </div>
            <div>
              <h4 class="font-semibold text-text-primary mb-1">
                歇后语
              </h4>
              <p class="text-sm text-text-tertiary">
                趣味歇后语大全，感受民间智慧
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- 数据来源 -->
      <div class="card p-8">
        <h3 class="text-lg font-semibold text-text-primary mb-4">
          数据来源
        </h3>
        <ul class="space-y-2 text-text-secondary">
          <li class="flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-primary" />
            五笔编码数据：基于86版五笔字型标准
          </li>
          <li class="flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-primary" />
            诗词数据：整理自中华经典诗词典籍
          </li>
          <li class="flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-primary" />
            成语数据：收录自权威成语词典
          </li>
          <li class="flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full bg-primary" />
            歇后语数据：汇集民间传统歇后语
          </li>
        </ul>
      </div>

      <!-- 技术栈 -->
      <div class="card p-8">
        <h3 class="text-lg font-semibold text-text-primary mb-4">
          技术栈
        </h3>
        <div class="flex flex-wrap gap-2">
          <span class="tag">Vue 3</span>
          <span class="tag">Vite</span>
          <span class="tag">TailwindCSS</span>
          <span class="tag">Pinia</span>
          <span class="tag">Vue Router</span>
          <span class="tag">hanzi-writer</span>
          <span class="tag">pinyin-pro</span>
        </div>
      </div>

      <!-- 版权信息 -->
      <div class="text-center text-text-tertiary text-sm">
        <p>© 2024 汉字集. All rights reserved.</p>
        <p class="mt-1">
          Made with ❤️ for Chinese culture
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
</script>
