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
      <!-- 输入框和二维码区域 -->
      <div class="flex gap-6 items-start">
        <div class="flex-1">
          <el-input
            v-model="inputText"
            type="textarea"
            :rows="6"
            placeholder="请输入要转换的文本"
            class="w-full text-base"
            :autosize="{ minRows: 6, maxRows: 12 }"
            :disabled="showQRCode"
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
          :disabled="!inputText"
          @click="handleReset"
          size="large"
          :class="[
            '!border-red-500 transition-all',
            inputText 
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
      </div>

      <!-- 结果显示 -->
      <div v-if="result" class="mt-6">
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
}

// URL 编码
function handleEncode() {
  try {
    result.value = encodeURIComponent(inputText.value)
  } catch (error) {
    result.value = '编码失败：无效的输入'
  }
}

// URL 解码
function handleDecode() {
  try {
    result.value = decodeURIComponent(inputText.value)
  } catch (error) {
    result.value = '解码失败：无效的输入'
  }
}

// 文本转16进制
function handleToHex() {
  try {
    const hex = Array.from(inputText.value)
      .map(c => c.charCodeAt(0).toString(16).padStart(2, '0'))
      .join('')
    result.value = hex.toUpperCase()
  } catch (error) {
    result.value = '转换失败：无效的输入'
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
  } catch (error) {
    result.value = '解码失败：无效的16进制输入'
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
  } catch (error) {
    result.value = '转换失败：请输入有效的十进制数字，多个数字可用空格或逗号分隔'
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
  } catch (error) {
    result.value = '转换失败：请输入有效的16进制数字（可带0x前缀），多个数字可用空格或逗号分隔'
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