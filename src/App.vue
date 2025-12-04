<template>
  <div class="min-h-screen bg-bg-page">
    <!-- 桌面端导航 -->
    <NavBar class="hidden lg:block" />

    <!-- 主内容区域 -->
    <main class="pb-20 lg:pb-0">
      <router-view v-slot="{ Component }">
        <transition
          name="page"
          mode="out-in"
        >
          <component :is="Component" />
        </transition>
      </router-view>
    </main>

    <!-- 移动端底部导航 -->
    <TabBar class="lg:hidden" />

    <!-- Toast 提示 -->
    <Toast />
  </div>
</template>

<script setup>
import NavBar from '@/components/common/NavBar.vue'
import TabBar from '@/components/common/TabBar.vue'
import Toast from '@/components/common/Toast.vue'
</script>
