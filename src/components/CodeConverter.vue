<template>
  <div class="max-w-6xl mx-auto p-8 bg-white rounded-lg shadow-md relative">
    <!-- 关闭按钮 -->
    <div
      v-if="showCloseButton"
      class="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-red-500 hover:bg-red-600 cursor-pointer flex items-center justify-center shadow-lg transition-colors z-10"
      @click="$emit('remove')"
    >
      <el-icon class="text-white text-lg">
        <close />
      </el-icon>
    </div>

    <div class="space-y-6">
      <!-- 输入框、图片预览和二维码区域 -->
      <div class="flex gap-6 items-start">
        <!-- 图片预览区域 -->
        <ImagePreview
          :image-url="pastedImageUrl"
          :show="showPastedImage"
          :file-name="pastedImageName"
          :file-size="pastedImageSize"
        />

        <div class="flex-1">
          <el-input
            ref="textareaRef"
            v-model="inputText"
            type="textarea"
            :rows="6"
            placeholder="请输入要转换的文本（或粘贴图片进行二维码解析）"
            class="w-full text-base"
            :autosize="{ minRows: 6, maxRows: 12 }"
            :disabled="showQRCode || showPastedImage"
            @paste="handlePaste"
          />
        </div>
        
        <!-- 二维码组件 -->
        <QRCodeGenerator
          :text="inputText"
          :show="showQRCode"
          @cancel="handleCancelQRCode"
        />
      </div>

      <!-- 按钮组 -->
      <div v-if="!showQRCode" class="flex flex-wrap gap-3 justify-center">
        <el-button
          type="danger"
          :disabled="!inputText && !showPastedImage"
          @click="handleReset"
          size="large"
          :class="[
            '!border-red-500 transition-all',
            (inputText || showPastedImage)
              ? '!bg-red-500 !text-white hover:!bg-red-600'
              : '!bg-transparent !text-red-500'
          ]"
        >
          重置
        </el-button>
        
        <el-button
          type="primary"
          :disabled="!inputText"
          @click="handleEncode"
          size="large"
          :class="[
            '!border-blue-500 transition-all',
            inputText 
              ? '!bg-blue-500 !text-white hover:!bg-blue-600'
              : '!bg-transparent !text-blue-500'
          ]"
        >
          encode编码
        </el-button>
        
        <el-button
          type="primary"
          :disabled="!inputText"
          @click="handleDecode"
          size="large"
          :class="[
            '!border-blue-500 transition-all',
            inputText 
              ? '!bg-blue-500 !text-white hover:!bg-blue-600'
              : '!bg-transparent !text-blue-500'
          ]"
        >
          decode解码
        </el-button>
        
        <el-button
          type="primary"
          :disabled="!inputText"
          @click="handleToHex"
          size="large"
          :class="[
            '!border-blue-500 transition-all',
            inputText 
              ? '!bg-blue-500 !text-white hover:!bg-blue-600'
              : '!bg-transparent !text-blue-500'
          ]"
        >
          文本转16进制
        </el-button>
        
        <el-button
          type="primary"
          :disabled="!inputText"
          @click="handleFromHex"
          size="large"
          :class="[
            '!border-blue-500 transition-all',
            inputText 
              ? '!bg-blue-500 !text-white hover:!bg-blue-600'
              : '!bg-transparent !text-blue-500'
          ]"
        >
          16进制转文本
        </el-button>

        <el-button
          type="primary"
          :disabled="!inputText"
          @click="handleDecToHex"
          size="large"
          :class="[
            '!border-blue-500 transition-all',
            inputText 
              ? '!bg-blue-500 !text-white hover:!bg-blue-600'
              : '!bg-transparent !text-blue-500'
          ]"
        >
          10进制转16进制
        </el-button>

        <el-button
          type="primary"
          :disabled="!inputText"
          @click="handleHexToDec"
          size="large"
          :class="[
            '!border-blue-500 transition-all',
            inputText 
              ? '!bg-blue-500 !text-white hover:!bg-blue-600'
              : '!bg-transparent !text-blue-500'
          ]"
        >
          16进制转10进制
        </el-button>

        <el-button
          type="primary"
          :disabled="!inputText"
          @click="handleGenerateQRCode"
          size="large"
          :class="[
            '!border-blue-500 transition-all',
            inputText 
              ? '!bg-blue-500 !text-white hover:!bg-blue-600'
              : '!bg-transparent !text-blue-500'
          ]"
        >
          生成二维码
        </el-button>

        <el-button
          type="success"
          :disabled="!showPastedImage"
          @click="handleParseQRCode"
          size="large"
          :class="[
            '!border-green-500 transition-all',
            showPastedImage 
              ? '!bg-green-500 !text-white hover:!bg-green-600'
              : '!bg-transparent !text-green-500'
          ]"
        >
          解析二维码
        </el-button>

        <el-button
          type="warning"
          :disabled="!inputText || !isValidUrl(inputText)"
          @click="handleParseLink"
          size="large"
          :class="[
            '!border-orange-500 transition-all',
            (inputText && isValidUrl(inputText))
              ? '!bg-orange-500 !text-white hover:!bg-orange-600'
              : '!bg-transparent !text-orange-500'
          ]"
        >
          解析链接
        </el-button>
      </div>

      <!-- 链接解析结果 -->
      <div v-if="showLinkResult && linkParseResult" class="mt-6">
        <div class="font-medium text-gray-700 mb-3">链接解析结果：</div>
        <div class="p-6 bg-gray-50 rounded-lg border border-gray-200">
          <LinkParseResult :url="linkParseResult" />
        </div>
      </div>

      <!-- 普通结果显示 -->
      <div v-if="result && !showLinkResult" class="mt-6">
        <div class="font-medium text-gray-700 mb-3">转换结果：</div>
        <el-tooltip
          content="点击复制结果"
          placement="top"
          :show-after="500"
        >
          <div 
            class="p-6 bg-gray-50 rounded-lg border border-gray-200 break-all cursor-pointer hover:bg-gray-100 transition-colors relative group"
            @click="copyResult"
          >
            {{ result }}
            <transition name="fade">
              <div
                v-if="showCopySuccess"
                class="absolute top-2 right-2 text-sm text-green-600 bg-green-50 px-2 py-1 rounded"
              >
                已复制
              </div>
            </transition>
          </div>
        </el-tooltip>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Close } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import QRCodeGenerator from './QRCodeGenerator.vue'
import ImagePreview from './ImagePreview.vue'
import LinkParseResult from './LinkParseResult.vue'
import QrScanner from 'qr-scanner'

const props = defineProps<{
  showCloseButton?: boolean
}>()

const emit = defineEmits<{
  remove: []
}>()

const inputText = ref('')
const result = ref('')
const showCopySuccess = ref(false)
const showQRCode = ref(false)
const showPastedImage = ref(false)
const pastedImageUrl = ref('')
const pastedImageName = ref('')
const pastedImageSize = ref(0)
const pastedImageFile = ref<File | null>(null)
const textareaRef = ref()
const linkParseResult = ref('')
const showLinkResult = ref(false)

// 处理粘贴事件
async function handlePaste(event: ClipboardEvent) {
  const items = event.clipboardData?.items
  if (!items) return

  for (const item of items) {
    if (item.type.startsWith('image/')) {
      event.preventDefault()
      const file = item.getAsFile()
      if (file) {
        pastedImageFile.value = file
        pastedImageName.value = file.name || `image.${file.type.split('/')[1]}`
        pastedImageSize.value = file.size
        pastedImageUrl.value = URL.createObjectURL(file)
        showPastedImage.value = true
        ElMessage.success('图片已粘贴，可以点击"解析二维码"按钮进行解析')
      }
      break
    }
  }
}

// 解析二维码
async function handleParseQRCode() {
  if (!pastedImageFile.value) {
    ElMessage.error('没有可解析的图片')
    return
  }

  try {
    const qrResult = await QrScanner.scanImage(pastedImageFile.value, {
      returnDetailedScanResult: true
    })
    result.value = qrResult.data
    showLinkResult.value = false
    ElMessage.success('二维码解析成功')
  } catch (error) {
    ElMessage.error('二维码解析失败，请确保图片包含有效的二维码')
  }
}

// 检查是否为有效URL
function isValidUrl(text: string): boolean {
  const urlPattern = /^(https?:\/\/|www\.|[a-zA-Z0-9-]+\.[a-zA-Z]{2,})/i
  const schemePattern = /^[a-zA-Z][a-zA-Z0-9+.-]*:/
  return urlPattern.test(text) || schemePattern.test(text) || text.includes('://') || text.includes('?') || text.includes('#')
}

// 解析链接
function handleParseLink() {
  if (!inputText.value || !isValidUrl(inputText.value)) {
    ElMessage.error('请输入有效的链接')
    return
  }

  linkParseResult.value = inputText.value
  showLinkResult.value = true
  result.value = ''
  ElMessage.success('链接解析完成')
}

// 生成二维码
function handleGenerateQRCode() {
  showQRCode.value = true
}

// 取消二维码
function handleCancelQRCode() {
  showQRCode.value = false
}

// 复制结果
async function copyResult() {
  try {
    await navigator.clipboard.writeText(result.value)
    showCopySuccess.value = true
    setTimeout(() => {
      showCopySuccess.value = false
    }, 2000)
  } catch (error) {
    ElMessage.error('复制失败，请手动复制')
  }
}

// 重置功能
function handleReset() {
  inputText.value = ''
  result.value = ''
  showQRCode.value = false
  showPastedImage.value = false
  showLinkResult.value = false
  linkParseResult.value = ''
  if (pastedImageUrl.value) {
    URL.revokeObjectURL(pastedImageUrl.value)
  }
  pastedImageUrl.value = ''
  pastedImageName.value = ''
  pastedImageSize.value = 0
  pastedImageFile.value = null
}

// URL 编码
function handleEncode() {
  try {
    result.value = encodeURIComponent(inputText.value)
    showLinkResult.value = false
  } catch (error) {
    result.value = '编码失败：无效的输入'
    showLinkResult.value = false
  }
}

// URL 解码
function handleDecode() {
  try {
    result.value = decodeURIComponent(inputText.value)
    showLinkResult.value = false
  } catch (error) {
    result.value = '解码失败：无效的输入'
    showLinkResult.value = false
  }
}

// 文本转16进制
function handleToHex() {
  try {
    const hex = Array.from(inputText.value)
      .map(c => c.charCodeAt(0).toString(16).padStart(2, '0'))
      .join('')
    result.value = hex.toUpperCase()
    showLinkResult.value = false
  } catch (error) {
    result.value = '转换失败：无效的输入'
    showLinkResult.value = false
  }
}

// 16进制转文本
function handleFromHex() {
  try {
    const hex = inputText.value.replace(/\s/g, '') // 移除所有空白字符
    if (!/^[0-9A-Fa-f]+$/.test(hex) || hex.length % 2 !== 0) {
      throw new Error('无效的16进制字符串')
    }
    const bytes = hex.match(/.{2}/g) || []
    result.value = bytes
      .map(byte => String.fromCharCode(parseInt(byte, 16)))
      .join('')
    showLinkResult.value = false
  } catch (error) {
    result.value = '解码失败：无效的16进制输入'
    showLinkResult.value = false
  }
}

// 10进制转16进制
function handleDecToHex() {
  try {
    // 支持多个数字的转换，以空格或逗号分隔
    const numbers = inputText.value
      .split(/[\s,]+/)
      .filter(n => n.trim() !== '')
    
    if (numbers.some(n => !/^\d+$/.test(n))) {
      throw new Error('包含非数字字符')
    }

    result.value = numbers
      .map(n => parseInt(n, 10).toString(16).toUpperCase())
      .join('\n')
    showLinkResult.value = false
  } catch (error) {
    result.value = '转换失败：请输入有效的十进制数字，多个数字可用空格或逗号分隔'
    showLinkResult.value = false
  }
}

// 16进制转10进制
function handleHexToDec() {
  try {
    // 支持多个16进制数的转换，以空格或逗号分隔
    // 支持带0x前缀和不带前缀的16进制数
    const numbers = inputText.value
      .split(/[\s,]+/)
      .filter(n => n.trim() !== '')
      .map(n => n.toLowerCase().replace(/^0x/, ''))
    
    if (numbers.some(n => !/^[0-9a-f]+$/.test(n))) {
      throw new Error('包含非16进制字符')
    }

    result.value = numbers
      .map(n => parseInt(n, 16).toString())
      .join('\n')
    showLinkResult.value = false
  } catch (error) {
    result.value = '转换失败：请输入有效的16进制数字（可带0x前缀），多个数字可用空格或逗号分隔'
    showLinkResult.value = false
  }
}
</script>

<style>
.el-textarea__inner {
  font-family: monospace;
  font-size: 16px !important;
  line-height: 1.6 !important;
  padding: 12px !important;
}

.el-button {
  min-width: 120px;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>