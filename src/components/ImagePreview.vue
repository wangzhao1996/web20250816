<template>
  <div v-if="show" class="relative w-48 h-48 flex-shrink-0 glass-card rounded-2xl overflow-hidden animate-slide-up border border-secondary-200/50">
    <img :src="imageUrl" alt="Pasted Image" class="w-full h-full object-cover" />
    
    <!-- 图片信息显示 -->
    <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/60 to-transparent text-white text-xs p-3">
      <div class="flex items-center gap-2">
        <svg class="w-3 h-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
          <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd"></path>
        </svg>
        <span class="truncate">{{ imageInfo }}</span>
      </div>
    </div>
    
    <!-- 装饰性边框 -->
    <div class="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-br from-success-500/20 via-primary-500/20 to-accent-500/20 pointer-events-none"></div>
    
    <!-- 悬停效果 -->
    <div class="absolute inset-0 bg-primary-500/10 opacity-0 hover:opacity-100 transition-opacity duration-300"></div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  imageUrl: string
  show: boolean
  fileName?: string
  fileSize?: number
}

const props = defineProps<Props>()

const imageInfo = computed(() => {
  if (props.fileName || props.fileSize) {
    const name = props.fileName || '未知文件'
    const size = props.fileSize ? `${(props.fileSize / 1024).toFixed(1)}KB` : ''
    return `${name}${size ? ` (${size})` : ''}`
  }
  return '粘贴的图片'
})
</script>
