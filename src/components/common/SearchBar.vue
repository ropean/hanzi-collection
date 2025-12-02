<template>
  <div class="relative">
    <div
      class="flex items-center gap-3 px-4 py-3 bg-white rounded-full border border-border shadow-sm transition-all"
      :class="{ 'ring-2 ring-primary/20 border-primary': isFocused }"
    >
      <svg
        class="w-5 h-5 text-text-tertiary flex-shrink-0"
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
      <input
        ref="inputRef"
        v-model="localValue"
        type="text"
        :placeholder="placeholder"
        class="flex-1 text-base outline-none placeholder:text-text-tertiary bg-transparent"
        @focus="isFocused = true"
        @blur="isFocused = false"
        @keyup.enter="handleSearch"
      >
      <button
        v-if="localValue"
        class="p-1 hover:bg-bg-hover rounded-full transition-colors"
        @click="clear"
      >
        <svg
          class="w-4 h-4 text-text-tertiary"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  },
  placeholder: {
    type: String,
    default: '搜索...'
  }
})

const emit = defineEmits(['update:modelValue', 'search'])

const inputRef = ref(null)
const isFocused = ref(false)
const localValue = ref(props.modelValue)

watch(() => props.modelValue, (val) => {
  localValue.value = val
})

watch(localValue, (val) => {
  emit('update:modelValue', val)
})

const handleSearch = () => {
  emit('search', localValue.value)
}

const clear = () => {
  localValue.value = ''
  inputRef.value?.focus()
}

const focus = () => {
  inputRef.value?.focus()
}

defineExpose({ focus })
</script>
