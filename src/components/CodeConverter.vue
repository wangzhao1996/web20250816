<template>
  <div class="max-w-6xl mx-auto p-8 bg-white rounded-lg shadow-md">
    <div class="space-y-6">
      <!-- 输入框 -->
      <div>
        <el-input
          v-model="inputText"
          type="textarea"
          :rows="4"
          placeholder="请输入要转换的文本"
          class="w-full text-base"
          :autosize="{ minRows: 4, maxRows: 10 }"
        />
      </div>

      <!-- 按钮组 -->
      <div class="flex flex-wrap gap-3 justify-center">
        <el-button
          type="danger"
          :disabled="!inputText"
          @click="handleReset"
          size="large"
          class="!bg-red-500 !text-white hover:!bg-red-600 disabled:!bg-gray-200"
        >
          重置
        </el-button>
        
        <el-button
          type="primary"
          :disabled="!inputText"
          @click="handleEncode"
          size="large"
          class="!bg-blue-500 !text-white hover:!bg-blue-600 disabled:!bg-gray-200"
        >
          encode编码
        </el-button>
        
        <el-button
          type="primary"
          :disabled="!inputText"
          @click="handleDecode"
          size="large"
          class="!bg-blue-500 !text-white hover:!bg-blue-600 disabled:!bg-gray-200"
        >
          decode解码
        </el-button>
        
        <el-button
          type="primary"
          :disabled="!inputText"
          @click="handleToHex"
          size="large"
          class="!bg-blue-500 !text-white hover:!bg-blue-600 disabled:!bg-gray-200"
        >
          16进制编码
        </el-button>
        
        <el-button
          type="primary"
          :disabled="!inputText"
          @click="handleFromHex"
          size="large"
          class="!bg-blue-500 !text-white hover:!bg-blue-600 disabled:!bg-gray-200"
        >
          16进制解码
        </el-button>

        <el-button
          type="primary"
          :disabled="!inputText"
          @click="handleDecToHex"
          size="large"
          class="!bg-blue-500 !text-white hover:!bg-blue-600 disabled:!bg-gray-200"
        >
          10进制转16进制
        </el-button>

        <el-button
          type="primary"
          :disabled="!inputText"
          @click="handleHexToDec"
          size="large"
          class="!bg-blue-500 !text-white hover:!bg-blue-600 disabled:!bg-gray-200"
        >
          16进制转10进制
        </el-button>
      </div>

      <!-- 结果显示 -->
      <div v-if="result" class="mt-6">
        <div class="font-medium text-gray-700 mb-3">转换结果：</div>
        <div class="p-6 bg-gray-50 rounded-lg border border-gray-200 break-all">
          {{ result }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const inputText = ref('')
const result = ref('')

// 重置功能
function handleReset() {
  inputText.value = ''
  result.value = ''
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
      .map(n => {
        const hex = parseInt(n, 10).toString(16).toUpperCase()
        return `${n} -> 0x${hex}`
      })
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
      .map(n => {
        const dec = parseInt(n, 16)
        return `0x${n.toUpperCase()} -> ${dec}`
      })
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
  border: none !important;
}
</style>