<template>
  <div v-if="show" class="relative w-48 h-48 flex-shrink-0 bg-white">
    <img :src="qrCodeUrl" alt="QR Code" class="w-full h-full" />
    
    <!-- 悬停蒙层和按钮 -->
    <div 
      class="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity"
    >
      <div class="absolute inset-4 flex flex-col justify-between">
        <el-button
          type="primary"
          size="large"
          class="!bg-blue-500 !text-white hover:!bg-blue-600 !border-none !w-full !text-left"
          style="margin: 0; padding-left: 12px; padding-right: 12px;"
          @click="handleCopy"
        >
          复制二维码
        </el-button>
        <el-button
          type="danger"
          size="large"
          class="!bg-red-500 !text-white hover:!bg-red-600 !border-none !w-full !text-left"
          style="margin: 0; padding-left: 12px; padding-right: 12px;"
          @click="handleCancel"
        >
          取消
        </el-button>
      </div>
    </div>
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
