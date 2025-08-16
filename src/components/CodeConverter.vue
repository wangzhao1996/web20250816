<template>
  <div class="max-w-6xl mx-auto glass-card rounded-3xl relative overflow-hidden">
    <!-- macOS 风格导航栏 -->
    <div class="flex items-center justify-between px-6 py-4 bg-gradient-to-r from-secondary-50/80 to-secondary-100/80 backdrop-blur-sm border-b border-secondary-200/50">
      <!-- 左侧窗口控制按钮 -->
      <div class="flex items-center gap-2">
        <!-- 关闭按钮 -->
        <button
          :disabled="!showCloseButton"
          @click="emit('remove')"
          :class="[
            'w-4 h-4 rounded-full transition-all duration-300 group',
            showCloseButton 
              ? 'bg-red-500 hover:bg-red-600 cursor-pointer shadow-sm hover:shadow-md' 
              : 'bg-secondary-300 cursor-not-allowed'
          ]"
        >
          <div v-if="showCloseButton" class="w-full h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <svg class="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </div>
        </button>
        
        <!-- 最小化按钮（装饰用） -->
        <el-tooltip content="好看，没用" placement="top" :show-after="300">
          <div class="w-4 h-4 rounded-full bg-yellow-500 hover:bg-yellow-600 transition-all duration-300 cursor-pointer group">
            <div class="w-full h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <svg class="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M20 12H4"></path>
              </svg>
            </div>
          </div>
        </el-tooltip>
        
        <!-- 展开/收起按钮 -->
        <button
          @click="toggleCollapse"
          class="w-4 h-4 rounded-full bg-green-500 hover:bg-green-600 cursor-pointer transition-all duration-300 shadow-sm hover:shadow-md group"
        >
          <div class="w-full h-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
            <svg v-if="isCollapsed" class="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
            <svg v-else class="w-2 h-2 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
            </svg>
          </div>
        </button>
      </div>
      
      <!-- 中间标题 -->
      <div class="flex-1 flex items-center justify-center">
        <h3 class="text-sm font-medium text-secondary-700 flex items-center gap-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
          </svg>
          编码转换器
        </h3>
      </div>
      
      <!-- 右侧状态指示器 -->
      <div class="flex items-center gap-2">
        <div v-if="result" class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
        <div v-else class="w-2 h-2 rounded-full bg-secondary-300"></div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div v-show="!isCollapsed" class="p-8 space-y-6 transition-all duration-300">
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
      <div v-if="!showQRCode" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <button
          :disabled="!inputText && !showPastedImage"
          @click="handleReset"
          :class="[
            'font-medium px-4 py-3 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 ease-out border-0 focus:ring-4 text-sm',
            (inputText || showPastedImage)
              ? 'btn-danger'
              : 'btn-disabled'
          ]"
        >
          重置
        </button>
        
        <button
          :disabled="!inputText"
          @click="handleEncode"
          :class="[
            'font-medium px-4 py-3 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 ease-out border-0 focus:ring-4 text-sm',
            inputText 
              ? 'btn-primary'
              : 'btn-disabled'
          ]"
        >
          encode编码
        </button>
        
        <button
          :disabled="!inputText"
          @click="handleDecode"
          :class="[
            'font-medium px-4 py-3 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 ease-out border-0 focus:ring-4 text-sm',
            inputText 
              ? 'btn-primary'
              : 'btn-disabled'
          ]"
        >
          decode解码
        </button>
        
        <button
          :disabled="!inputText"
          @click="handleToHex"
          :class="[
            'font-medium px-4 py-3 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 ease-out border-0 focus:ring-4 text-sm',
            inputText 
              ? 'btn-primary'
              : 'btn-disabled'
          ]"
        >
          文本转16进制
        </button>
        
        <button
          :disabled="!inputText"
          @click="handleFromHex"
          :class="[
            'font-medium px-4 py-3 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 ease-out border-0 focus:ring-4 text-sm',
            inputText 
              ? 'btn-primary'
              : 'btn-disabled'
          ]"
        >
          16进制转文本
        </button>

        <button
          :disabled="!inputText"
          @click="handleDecToHex"
          :class="[
            'font-medium px-4 py-3 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 ease-out border-0 focus:ring-4 text-sm',
            inputText 
              ? 'btn-primary'
              : 'btn-disabled'
          ]"
        >
          10进制转16进制
        </button>

        <button
          :disabled="!inputText"
          @click="handleHexToDec"
          :class="[
            'font-medium px-4 py-3 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 ease-out border-0 focus:ring-4 text-sm',
            inputText 
              ? 'btn-primary'
              : 'btn-disabled'
          ]"
        >
          16进制转10进制
        </button>

        <button
          :disabled="!inputText"
          @click="handleGenerateQRCode"
          :class="[
            'font-medium px-4 py-3 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 ease-out border-0 focus:ring-4 text-sm',
            inputText 
              ? 'btn-primary'
              : 'btn-disabled'
          ]"
        >
          生成二维码
        </button>

        <button
          :disabled="!showPastedImage"
          @click="handleParseQRCode"
          :class="[
            'font-medium px-4 py-3 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 ease-out border-0 focus:ring-4 text-sm',
            showPastedImage 
              ? 'btn-success'
              : 'btn-disabled'
          ]"
        >
          解析二维码
        </button>

        <button
          :disabled="!inputText || !isValidUrl(inputText) || isValidJson(inputText)"
          @click="handleParseLink"
          :class="[
            'font-medium px-4 py-3 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 ease-out border-0 focus:ring-4 text-sm',
            (inputText && isValidUrl(inputText) && !isValidJson(inputText))
              ? 'btn-warning'
              : 'btn-disabled'
          ]"
        >
          解析链接
        </button>

        <button
          :disabled="!inputText || !isValidJson(inputText)"
          @click="handleFormatJson"
          :class="[
            'font-medium px-4 py-3 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 ease-out border-0 focus:ring-4 text-sm',
            (inputText && isValidJson(inputText))
              ? 'btn-info'
              : 'btn-disabled'
          ]"
        >
          JSON格式化
        </button>

        <button
          :disabled="!inputText || !isValidJson(inputText)"
          @click="handleCompressJson"
          :class="[
            'font-medium px-4 py-3 rounded-xl shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-300 ease-out border-0 focus:ring-4 text-sm',
            (inputText && isValidJson(inputText))
              ? 'btn-info'
              : 'btn-disabled'
          ]"
        >
          JSON压缩
        </button>
      </div>

      <!-- 链接解析结果 -->
      <div v-if="showLinkResult && linkParseResult" class="mt-8 animate-fade-in">
        <div class="flex items-center gap-2 font-semibold text-secondary-700 mb-4">
          <div class="w-6 h-6 bg-gradient-to-r from-warning-500 to-warning-600 rounded-lg flex items-center justify-center">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.102m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
            </svg>
          </div>
          <span>链接解析结果</span>
        </div>
        <div class="glass-card p-6 rounded-2xl border border-secondary-200/50">
          <LinkParseResult :url="linkParseResult" />
        </div>
      </div>

      <!-- 普通结果显示 -->
      <div v-if="result && !showLinkResult" class="mt-8 animate-fade-in">
        <div class="flex items-center gap-2 font-semibold text-secondary-700 mb-4">
          <div class="w-6 h-6 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
            <svg class="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <span>转换结果</span>
        </div>
        <el-tooltip
          content="点击复制结果"
          placement="top"
          :show-after="500"
        >
          <div 
            class="result-area p-6 break-words relative group font-mono text-sm leading-6 whitespace-pre-wrap overflow-auto"
            @click="copyResult"
          >
            <div class="relative z-10">{{ result }}</div>
            <transition name="fade">
              <div
                v-if="showCopySuccess"
                class="absolute top-3 right-3 text-xs text-success-700 bg-success-100 px-3 py-1.5 rounded-full shadow-sm animate-bounce-in"
              >
                ✓ 已复制
              </div>
            </transition>
            
            <!-- 复制提示 -->
            <div class="absolute bottom-3 right-3 text-xs text-secondary-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/80 px-2 py-1 rounded-md">
              点击复制
            </div>
          </div>
        </el-tooltip>
      </div>
    </div>

    <!-- 收起状态下的简化视图 -->
    <div v-show="isCollapsed" class="px-8 py-4 transition-all duration-300">
      <!-- 简化的结果显示 -->
      <div v-if="result && !showLinkResult" class="animate-fade-in">
        <div class="flex items-center gap-2 font-medium text-secondary-600 mb-3 text-sm">
          <div class="w-4 h-4 bg-gradient-to-r from-primary-500 to-primary-600 rounded-md flex items-center justify-center">
            <svg class="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <span>转换结果</span>
        </div>
        <div 
          class="bg-gradient-to-br from-secondary-50/80 to-primary-50/80 backdrop-blur-sm border border-secondary-200/50 rounded-xl p-4 font-mono text-sm leading-relaxed cursor-pointer hover:shadow-md transition-all duration-300 whitespace-pre-wrap"
          @click="copyResult"
        >
          <div class="line-clamp-3">{{ result }}</div>
        </div>
      </div>

      <!-- 链接解析结果的简化视图 -->
      <div v-else-if="showLinkResult && linkParseResult" class="animate-fade-in">
        <div class="flex items-center gap-2 font-medium text-secondary-600 mb-3 text-sm">
          <div class="w-4 h-4 bg-gradient-to-r from-warning-500 to-warning-600 rounded-md flex items-center justify-center">
            <svg class="w-2.5 h-2.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.102m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
            </svg>
          </div>
          <span>链接解析结果</span>
        </div>
        <div class="bg-gradient-to-br from-secondary-50/80 to-warning-50/80 backdrop-blur-sm border border-secondary-200/50 rounded-xl p-4">
          <LinkParseResult :url="linkParseResult" />
        </div>
      </div>

      <!-- 无结果时的提示 -->
      <div v-else class="text-center py-8 text-secondary-500">
        <svg class="w-8 h-8 mx-auto mb-2 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        <p class="text-sm">点击展开按钮开始使用转换器</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { ElMessage, ElTooltip } from 'element-plus'
import QRCodeGenerator from './QRCodeGenerator.vue'
import ImagePreview from './ImagePreview.vue'
import LinkParseResult from './LinkParseResult.vue'
import QrScanner from 'qr-scanner'

defineProps<{
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
const isCollapsed = ref(false)

// 切换收起/展开状态
function toggleCollapse() {
  isCollapsed.value = !isCollapsed.value
}

// 聚焦到文本框
function focusTextarea() {
  if (textareaRef.value) {
    // 如果转换器是收起状态，先展开它
    if (isCollapsed.value) {
      isCollapsed.value = false
    }
    
    // 等待DOM更新后聚焦
    nextTick(() => {
      try {
        const textarea = textareaRef.value.textarea || textareaRef.value.$el?.querySelector('.el-textarea__inner')
        if (textarea) {
          textarea.focus()
          textarea.select()
        }
      } catch (error) {
        console.warn('聚焦文本框失败:', error)
      }
    })
  }
}

// 暴露方法给父组件使用
defineExpose({
  focusTextarea,
  textareaRef
})

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

// 检查是否为有效JSON
function isValidJson(text: string): boolean {
  if (!text || !text.trim()) {
    return false
  }
  
  try {
    JSON.parse(text.trim())
    return true
  } catch {
    return false
  }
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

// JSON 格式化
function handleFormatJson() {
  try {
    // 移除前后空白字符
    const trimmedInput = inputText.value.trim()
    if (!trimmedInput) {
      result.value = '格式化失败：输入为空'
      showLinkResult.value = false
      return
    }

    // 尝试解析 JSON
    const jsonObject = JSON.parse(trimmedInput)
    
    // 格式化输出，使用2个空格缩进
    result.value = JSON.stringify(jsonObject, null, 2)
    showLinkResult.value = false
    ElMessage.success('JSON 格式化成功')
  } catch (error) {
    result.value = 'JSON 格式化失败：输入的不是有效的 JSON 格式\n\n错误详情：' + (error as Error).message
    showLinkResult.value = false
    ElMessage.error('JSON 格式化失败，请检查输入格式')
  }
}

// JSON 压缩
function handleCompressJson() {
  try {
    // 移除前后空白字符
    const trimmedInput = inputText.value.trim()
    if (!trimmedInput) {
      result.value = '压缩失败：输入为空'
      showLinkResult.value = false
      return
    }

    // 尝试解析 JSON
    const jsonObject = JSON.parse(trimmedInput)
    
    // 压缩输出，不使用空格和换行
    result.value = JSON.stringify(jsonObject)
    showLinkResult.value = false
    ElMessage.success('JSON 压缩成功')
  } catch (error) {
    result.value = 'JSON 压缩失败：输入的不是有效的 JSON 格式\n\n错误详情：' + (error as Error).message
    showLinkResult.value = false
    ElMessage.error('JSON 压缩失败，请检查输入格式')
  }
}
</script>

<style scoped>
/* Element Plus 输入框样式覆盖 */
:deep(.el-textarea) {
  border: none !important;
  box-shadow: none !important;
}

:deep(.el-textarea__inner) {
  font-family: 'JetBrains Mono', 'Fira Code', monospace !important;
  font-size: 16px !important;
  line-height: 1.6 !important;
  padding: 16px !important;
  border-radius: 12px !important;
  border: 2px solid #e2e8f0 !important;
  background: rgba(255, 255, 255, 0.95) !important;
  backdrop-filter: blur(4px) !important;
  transition: all 0.3s ease !important;
  box-shadow: 0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04) !important;
  box-sizing: border-box !important;
}

:deep(.el-textarea__inner:focus) {
  border-color: #0ea5e9 !important;
  box-shadow: 0 0 0 4px rgba(14, 165, 233, 0.1), 0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04) !important;
}

:deep(.el-textarea__inner:disabled) {
  background: rgba(248, 250, 252, 0.8) !important;
  color: #94a3b8 !important;
  cursor: not-allowed !important;
}

/* 按钮网格响应式调整 */
@media (max-width: 768px) {
  .grid-cols-2 {
    grid-template-columns: repeat(1, minmax(0, 1fr));
  }
}

@media (max-width: 1024px) {
  .md\:grid-cols-3 {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

/* 动画定义 */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(4px);
}

/* 卡片悬停效果增强 */
.glass-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 40px 0 rgba(31, 38, 135, 0.15), 0 8px 32px 0 rgba(31, 38, 135, 0.2);
}

/* 自定义滚动条 */
:deep(.el-textarea__inner)::-webkit-scrollbar {
  width: 6px;
}

:deep(.el-textarea__inner)::-webkit-scrollbar-track {
  background: #f1f5f9;
  border-radius: 3px;
}

:deep(.el-textarea__inner)::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

:deep(.el-textarea__inner)::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

/* 输入框容器装饰效果 */
.input-container {
  position: relative;
}

.input-container::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, #0ea5e9, #d946ef);
  border-radius: 14px;
  padding: 2px;
  z-index: -1;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.input-container:focus-within::before {
  opacity: 1;
}

/* 文本截断样式 */
.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

/* macOS 风格按钮动画 */
.group:hover .w-4.h-4 {
  transform: scale(1.05);
}

/* 收起/展开动画 */
.v-show-enter-active,
.v-show-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.v-show-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}

.v-show-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>