<template>
  <div v-if="show" class="relative w-48 h-48 flex-shrink-0 bg-white rounded-2xl overflow-hidden shadow-lg border border-secondary-200/50 animate-bounce-in">
    <img :src="qrCodeUrl" alt="QR Code" class="w-full h-full object-contain p-2" />
    
    <!-- 悬停蒙层和按钮 -->
    <div 
      class="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-black/60 opacity-0 hover:opacity-100 transition-all duration-300 backdrop-blur-sm"
    >
      <div class="absolute inset-4 flex flex-col justify-between">
        <button
          class="btn-primary flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transform hover:scale-105"
          @click="handleCopy"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
          </svg>
          复制二维码
        </button>
        <button
          class="btn-danger flex items-center justify-center gap-2 px-4 py-3 text-sm font-medium transform hover:scale-105"
          @click="handleCancel"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
          取消
        </button>
      </div>
    </div>
    
    <!-- 装饰性边框 -->
    <div class="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-br from-primary-500/20 via-accent-500/20 to-primary-500/20 pointer-events-none"></div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { ElMessage } from 'element-plus'
import QRCode from 'qrcode'

interface Props {
  text: string
  show: boolean
}

const props = defineProps<Props>()

const emit = defineEmits<{
  cancel: []
}>()

const qrCodeUrl = ref('')

// 监听文本变化，自动生成二维码
watch(() => props.text, async (newText) => {
  if (newText && props.show) {
    await generateQRCode(newText)
  }
}, { immediate: true })

// 监听显示状态变化
watch(() => props.show, async (show) => {
  if (show && props.text) {
    await generateQRCode(props.text)
  } else if (!show) {
    qrCodeUrl.value = ''
  }
})

// 生成二维码
async function generateQRCode(text: string) {
  try {
    qrCodeUrl.value = await QRCode.toDataURL(text, {
      width: 192,
      margin: 1,
      color: {
        dark: '#000',
        light: '#fff'
      }
    })
  } catch (error) {
    ElMessage.error('生成二维码失败')
  }
}

// 复制二维码
async function handleCopy() {
  try {
    const response = await fetch(qrCodeUrl.value)
    const blob = await response.blob()
    await navigator.clipboard.write([
      new ClipboardItem({
        [blob.type]: blob
      })
    ])
    ElMessage.success('二维码已复制')
  } catch (error) {
    ElMessage.error('复制二维码失败')
  }
}

// 取消二维码
function handleCancel() {
  emit('cancel')
}
</script>
