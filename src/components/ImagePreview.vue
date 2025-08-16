<template>
  <div v-if="show" class="relative w-48 h-48 flex-shrink-0 bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
    <img :src="imageUrl" alt="Pasted Image" class="w-full h-full object-cover" />
    
    <!-- 图片信息显示 -->
    <div class="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs p-2">
      <div>{{ imageInfo }}</div>
    </div>
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
