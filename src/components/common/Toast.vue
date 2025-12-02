<template>
  <Teleport to="body">
    <Transition name="slide-down">
      <div
        v-if="visible"
        class="fixed top-20 left-1/2 -translate-x-1/2 z-[200] px-4 py-3 bg-white rounded-lg shadow-lg flex items-center gap-3"
        :class="typeClass"
      >
        <component
          :is="icon"
          class="w-5 h-5 flex-shrink-0"
        />
        <span class="text-sm font-medium">{{ message }}</span>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { computed, h } from 'vue'
import { useToastStore } from '@/stores/toast'

const toastStore = useToastStore()

const visible = computed(() => toastStore.visible)
const message = computed(() => toastStore.message)
const type = computed(() => toastStore.type)

const typeClass = computed(() => {
  const classes = {
    success: 'border-l-4 border-green-500',
    error: 'border-l-4 border-red-500',
    warning: 'border-l-4 border-yellow-500',
    info: 'border-l-4 border-blue-500'
  }
  return classes[type.value] || classes.info
})

const SuccessIcon = () => h('svg', {
  fill: 'none',
  stroke: 'currentColor',
  viewBox: '0 0 24 24',
  class: 'text-green-500'
}, [
  h('path', {
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'stroke-width': '2',
    d: 'M5 13l4 4L19 7'
  })
])

const ErrorIcon = () => h('svg', {
  fill: 'none',
  stroke: 'currentColor',
  viewBox: '0 0 24 24',
  class: 'text-red-500'
}, [
  h('path', {
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'stroke-width': '2',
    d: 'M6 18L18 6M6 6l12 12'
  })
])

const WarningIcon = () => h('svg', {
  fill: 'none',
  stroke: 'currentColor',
  viewBox: '0 0 24 24',
  class: 'text-yellow-500'
}, [
  h('path', {
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'stroke-width': '2',
    d: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z'
  })
])

const InfoIcon = () => h('svg', {
  fill: 'none',
  stroke: 'currentColor',
  viewBox: '0 0 24 24',
  class: 'text-blue-500'
}, [
  h('path', {
    'stroke-linecap': 'round',
    'stroke-linejoin': 'round',
    'stroke-width': '2',
    d: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
  })
])

const icon = computed(() => {
  const icons = {
    success: SuccessIcon,
    error: ErrorIcon,
    warning: WarningIcon,
    info: InfoIcon
  }
  return icons[type.value] || icons.info
})
</script>

<style scoped>
.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.3s ease;
}

.slide-down-enter-from {
  opacity: 0;
  transform: translate(-50%, -20px);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translate(-50%, -20px);
}
</style>
