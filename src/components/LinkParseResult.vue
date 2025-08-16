<template>
  <div class="space-y-4">
    <!-- 原始链接 -->
    <div class="space-y-3">
      <div class="flex items-center gap-2 font-semibold text-secondary-700">
        <div class="w-5 h-5 bg-gradient-to-r from-secondary-500 to-secondary-600 rounded-lg flex items-center justify-center">
          <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.102m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
          </svg>
        </div>
        <span>原始链接</span>
      </div>
      <div class="bg-gradient-to-r from-secondary-50 to-secondary-100 rounded-xl border border-secondary-200/50 p-4 shadow-soft">
        <el-tooltip content="点击复制原始链接" placement="top" :show-after="300">
          <div 
            class="font-mono text-sm break-all cursor-pointer hover:bg-warning-100 p-3 rounded-lg transition-all duration-300 border border-transparent hover:border-warning-300"
            @click="copyValue(url)"
          >
            {{ url }}
          </div>
        </el-tooltip>
      </div>
    </div>

    <!-- 基础信息 -->
    <div class="space-y-3">
      <div class="flex items-center gap-2 font-semibold text-secondary-700">
        <div class="w-5 h-5 bg-gradient-to-r from-primary-500 to-primary-600 rounded-lg flex items-center justify-center">
          <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path>
          </svg>
        </div>
        <span>{{ parsedData.isPathOnly ? '基础路径' : '基础链接' }}</span>
      </div>
      <div class="bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl border border-primary-200/50 p-4 shadow-soft">
        <el-tooltip content="点击复制基础链接" placement="top" :show-after="300">
          <span 
            class="font-mono text-sm break-all text-primary-800 cursor-pointer hover:bg-warning-100 p-2 rounded-lg transition-all duration-300 border border-transparent hover:border-warning-300 block"
            @click="copyValue(parsedData.baseUrl)"
          >
            {{ parsedData.baseUrl }}
          </span>
        </el-tooltip>
      </div>
    </div>

    <!-- Query 参数 -->
    <div v-if="parsedData.queryParams.length > 0" class="space-y-3">
      <div class="flex items-center gap-2 font-semibold text-secondary-700">
        <div class="w-5 h-5 bg-gradient-to-r from-accent-500 to-accent-600 rounded-lg flex items-center justify-center">
          <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
        </div>
        <span>Query 参数</span>
        <span class="px-2 py-0.5 bg-accent-100 text-accent-700 rounded-full text-xs font-medium">{{ parsedData.queryParams.length }}</span>
      </div>
      <div class="space-y-2">
        <div 
          v-for="(param, index) in parsedData.queryParams" 
          :key="`query-${index}`"
          class="flex items-center gap-3 p-3 bg-gradient-to-r from-accent-50 to-white rounded-xl border border-accent-200/50 shadow-soft hover:shadow-md transition-all duration-300"
        >
          <el-tooltip 
            :content="hasLeadingOrTrailingSpaces(param.key) ? '⚠️ 参数名包含前后空格！点击复制' : '点击复制参数名'" 
            placement="top" 
            :show-after="300"
          >
            <span 
              :class="getParamClass(param.key, true)"
              @click="copyValue(param.key)"
            >
              <span :class="getParamTextClass(param.key, 'text-accent-700')">{{ param.key }}:</span>
            </span>
          </el-tooltip>
          <el-tooltip 
            :content="hasLeadingOrTrailingSpaces(param.value) ? '⚠️ 参数值包含前后空格！点击复制' : '点击复制此值'" 
            placement="top" 
            :show-after="300"
          >
            <span 
              :class="getParamClass(param.value)"
              @click="copyValue(param.value)"
            >
              <span :class="getParamTextClass(param.value)">{{ param.value }}</span>
            </span>
          </el-tooltip>
        </div>
      </div>
    </div>

    <!-- Hash 路径 -->
    <div v-if="parsedData.hashPath" class="space-y-3">
      <div class="flex items-center gap-2 font-semibold text-secondary-700">
        <div class="w-5 h-5 bg-gradient-to-r from-success-500 to-success-600 rounded-lg flex items-center justify-center">
          <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 0l4 16M6 9h14M4 15h14"></path>
          </svg>
        </div>
        <span>Hash 路径</span>
      </div>
      <div class="bg-gradient-to-r from-success-50 to-success-100 rounded-xl border border-success-200/50 p-4 shadow-soft">
        <el-tooltip content="点击复制Hash路径" placement="top" :show-after="300">
          <span 
            class="font-mono text-sm break-all text-success-800 cursor-pointer hover:bg-warning-100 p-2 rounded-lg transition-all duration-300 border border-transparent hover:border-warning-300 block"
            @click="copyValue(parsedData.hashPath)"
          >
            {{ parsedData.hashPath }}
          </span>
        </el-tooltip>
      </div>
    </div>

    <!-- Hash Query 参数 -->
    <div v-if="parsedData.hashQueryParams.length > 0" class="space-y-3">
      <div class="flex items-center gap-2 font-semibold text-secondary-700">
        <div class="w-5 h-5 bg-gradient-to-r from-success-500 to-success-600 rounded-lg flex items-center justify-center">
          <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 20l4-16m2 0l4 16M6 9h14M4 15h14"></path>
          </svg>
        </div>
        <span>Hash Query 参数</span>
        <span class="px-2 py-0.5 bg-success-100 text-success-700 rounded-full text-xs font-medium">{{ parsedData.hashQueryParams.length }}</span>
      </div>
      <div class="space-y-2">
        <div 
          v-for="(param, index) in parsedData.hashQueryParams" 
          :key="`hash-query-${index}`"
          class="flex items-center gap-3 p-3 bg-gradient-to-r from-success-50 to-white rounded-xl border border-success-200/50 shadow-soft hover:shadow-md transition-all duration-300"
        >
          <el-tooltip 
            :content="hasLeadingOrTrailingSpaces(param.key) ? '⚠️ 参数名包含前后空格！点击复制' : '点击复制参数名'" 
            placement="top" 
            :show-after="300"
          >
            <span 
              :class="getParamClass(param.key, true)"
              @click="copyValue(param.key)"
            >
              <span :class="getParamTextClass(param.key, 'text-success-700')">{{ param.key }}:</span>
            </span>
          </el-tooltip>
          <el-tooltip 
            :content="hasLeadingOrTrailingSpaces(param.value) ? '⚠️ 参数值包含前后空格！点击复制' : '点击复制此值'" 
            placement="top" 
            :show-after="300"
          >
            <span 
              :class="getParamClass(param.value)"
              @click="copyValue(param.value)"
            >
              <span :class="getParamTextClass(param.value)">{{ param.value }}</span>
            </span>
          </el-tooltip>
        </div>
      </div>
    </div>

    <!-- Fragment -->
    <div v-if="parsedData.fragment" class="space-y-3">
      <div class="flex items-center gap-2 font-semibold text-secondary-700">
        <div class="w-5 h-5 bg-gradient-to-r from-accent-500 to-accent-600 rounded-lg flex items-center justify-center">
          <svg class="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
          </svg>
        </div>
        <span>Fragment</span>
      </div>
      <div class="bg-gradient-to-r from-accent-50 to-accent-100 rounded-xl border border-accent-200/50 p-4 shadow-soft">
        <el-tooltip content="点击复制此值" placement="top" :show-after="300">
          <span 
            class="font-mono text-sm break-all cursor-pointer hover:bg-warning-100 px-3 py-2 rounded-lg transition-all duration-300 border border-transparent hover:border-warning-300 text-accent-800"
            @click="copyValue(parsedData.fragment)"
          >
            {{ parsedData.fragment }}
          </span>
        </el-tooltip>
      </div>
    </div>

    <!-- 解析统计 -->
    <div class="bg-gradient-to-r from-secondary-50 to-secondary-100 p-4 rounded-xl border border-secondary-200/50 shadow-soft">
      <div class="flex items-center gap-2 text-sm text-secondary-600">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
        </svg>
        <span>共解析：</span>
        <span class="font-semibold text-secondary-700">{{ getTotalParams() }}</span>
        <span>个参数</span>
        <span v-if="parsedData.hashPath" class="px-2 py-0.5 bg-success-100 text-success-700 rounded-full text-xs font-medium ml-2">包含 Hash 路由</span>
        <span v-if="parsedData.fragment" class="px-2 py-0.5 bg-accent-100 text-accent-700 rounded-full text-xs font-medium ml-1">包含 Fragment</span>
      </div>
    </div>



    <!-- 复制成功提示 -->
    <transition name="slide-down">
      <div
        v-if="showCopySuccess"
        class="fixed top-6 right-6 bg-gradient-to-r from-success-500 to-success-600 text-white px-4 py-3 rounded-xl shadow-lg z-50 flex items-center gap-2 animate-bounce-in"
      >
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        <span class="font-medium">已复制: {{ copiedValue }}</span>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { ElMessage } from 'element-plus'

interface ParsedParam {
  key: string
  value: string
}



interface ParsedLinkData {
  baseUrl: string
  queryParams: ParsedParam[]
  hashPath: string
  hashQueryParams: ParsedParam[]
  fragment: string
  isPathOnly: boolean
}

interface Props {
  url: string
}

const props = defineProps<Props>()

const showCopySuccess = ref(false)
const copiedValue = ref('')

// 解析链接数据
const parsedData = computed<ParsedLinkData>(() => {
  return parseUrl(props.url)
})

// 解析 URL 函数
function parseUrl(url: string): ParsedLinkData {
  const result: ParsedLinkData = {
    baseUrl: '',
    queryParams: [],
    hashPath: '',
    hashQueryParams: [],
    fragment: '',
    isPathOnly: false
  }

  // 基础链接：取第一个 ? 之前的内容
  result.baseUrl = url.includes('?') ? url.split('?')[0] : url

  // 检查是否是纯路径（以 / 开头）
  const isPathOnly = url.startsWith('/') && !url.startsWith('//')
  result.isPathOnly = isPathOnly

  try {
    if (isPathOnly) {
      // 对于路径形式的URL，直接手动解析
      const [, queryPart] = url.includes('?') ? url.split('?', 2) : [url, '']
      
      // 解析查询参数
      if (queryPart) {
        const [queryOnly, hashPart] = queryPart.includes('#') ? queryPart.split('#', 2) : [queryPart, '']
        
        const searchParams = new URLSearchParams(queryOnly)
        searchParams.forEach((value, key) => {
          result.queryParams.push({ key, value })
        })
        
        // 处理 hash 部分
        if (hashPart) {
          if (hashPart.includes('?')) {
            const [hashPath, hashQuery] = hashPart.split('?', 2)
            result.hashPath = hashPath
            
            const hashParams = new URLSearchParams(hashQuery)
            hashParams.forEach((value, key) => {
              result.hashQueryParams.push({ key, value })
            })
          } else if (hashPart.includes('/')) {
            result.hashPath = hashPart
          } else {
            result.fragment = hashPart
          }
        }
      }
    } else {
      // 处理完整URL
      // 注意：不能直接使用 URL 对象解析查询参数，因为它会自动移除参数值的空格
      // 我们需要手动解析查询字符串以保留空格
      
      const [, queryAndHashPart] = url.includes('?') ? url.split('?', 2) : [url, '']
      
      if (queryAndHashPart) {
        const [queryPart, hashPart] = queryAndHashPart.includes('#') ? queryAndHashPart.split('#', 2) : [queryAndHashPart, '']
        
        // 手动解析查询参数（保留空格）
        if (queryPart) {
          const searchParams = new URLSearchParams(queryPart)
          searchParams.forEach((value, key) => {
            result.queryParams.push({ key, value })
          })
        }
        
        // 处理 hash 部分
        if (hashPart) {
          if (hashPart.includes('?')) {
            const [hashPath, hashQuery] = hashPart.split('?', 2)
            result.hashPath = hashPath
            
            // 解析 hash 中的 query 参数
            const hashParams = new URLSearchParams(hashQuery)
            hashParams.forEach((value, key) => {
              result.hashQueryParams.push({ key, value })
            })
          } else if (hashPart.includes('/')) {
            // 只有路径，没有参数
            result.hashPath = hashPart
          } else {
            // 纯 fragment
            result.fragment = hashPart
          }
        }
      }
    }

  } catch (error) {
    // 如果解析失败，尝试手动解析
    result.baseUrl = url.includes('?') ? url.split('?')[0] : url
    ElMessage.warning('链接格式可能不标准，尝试基础解析')
  }

  return result
}

// 获取总参数数量
function getTotalParams(): number {
  return parsedData.value.queryParams.length + parsedData.value.hashQueryParams.length
}

// 检测字符串前后是否有空格
function hasLeadingOrTrailingSpaces(value: string): boolean {
  return value !== value.trim()
}

// 获取参数的样式类
function getParamClass(value: string, isKey: boolean = false): string {
  const baseClass = 'font-mono text-sm cursor-pointer px-3 py-2 rounded-lg transition-all duration-300 border border-transparent'
  const hoverClass = 'hover:bg-warning-100 hover:border-warning-300'
  const warningClass = hasLeadingOrTrailingSpaces(value) ? 'text-red-600 bg-red-50 border-red-200' : ''
  
  if (isKey) {
    return `${baseClass} font-semibold min-w-0 flex-shrink-0 ${warningClass} ${hoverClass}`
  } else {
    return `${baseClass} flex-1 break-all ${warningClass} ${hoverClass}`
  }
}

// 获取参数的颜色类（用于文本颜色）
function getParamTextClass(value: string, defaultColor: string = ''): string {
  return hasLeadingOrTrailingSpaces(value) ? 'text-red-600' : defaultColor
}



// 复制值
async function copyValue(value: string) {
  try {
    await navigator.clipboard.writeText(value)
    copiedValue.value = value.length > 20 ? value.substring(0, 20) + '...' : value
    showCopySuccess.value = true
    setTimeout(() => {
      showCopySuccess.value = false
    }, 2000)
  } catch (error) {
    ElMessage.error('复制失败')
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(4px);
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-20px) scale(0.95);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px) scale(0.98);
}

/* 悬停效果增强 */
.cursor-pointer:hover {
  transform: translateY(-1px);
}

/* 参数行动画 */
.space-y-2 > div {
  animation: slideInUp 0.3s ease-out;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 渐变边框悬停效果 */
.hover\:border-warning-300:hover {
  box-shadow: 0 0 15px rgba(251, 191, 36, 0.3);
}
</style>
