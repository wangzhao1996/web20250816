<template>
  <div class="space-y-4">
    <!-- 原始链接 -->
    <div class="space-y-2">
      <div class="font-medium text-gray-700">原始链接：</div>
      <div class="p-3 bg-slate-50 rounded border border-slate-200">
        <el-tooltip content="点击复制原始链接" placement="top" :show-after="300">
          <div 
            class="font-mono text-sm break-all cursor-pointer hover:bg-yellow-100 px-2 py-1 rounded transition-colors"
            @click="copyValue(url)"
          >
            {{ url }}
          </div>
        </el-tooltip>
      </div>
    </div>

    <!-- 基础信息 -->
    <div class="space-y-2">
      <div class="font-medium text-gray-700">{{ parsedData.isPathOnly ? '基础路径' : '基础链接' }}：</div>
      <div class="p-3 bg-blue-50 rounded border border-blue-200">
        <span class="font-mono text-sm break-all">{{ parsedData.baseUrl }}</span>
      </div>
    </div>

    <!-- Query 参数 -->
    <div v-if="parsedData.queryParams.length > 0" class="space-y-2">
      <div class="font-medium text-gray-700">Query 参数：</div>
      <div class="space-y-1">
        <div 
          v-for="(param, index) in parsedData.queryParams" 
          :key="`query-${index}`"
          class="flex items-center gap-2 p-2 bg-gray-50 rounded border"
        >
          <span class="font-mono text-sm text-blue-600 font-medium">{{ param.key }}:</span>
          <el-tooltip content="点击复制此值" placement="top" :show-after="300">
            <span 
              class="font-mono text-sm flex-1 cursor-pointer hover:bg-yellow-100 px-2 py-1 rounded transition-colors"
              @click="copyValue(param.value)"
            >
              {{ param.value }}
            </span>
          </el-tooltip>
        </div>
      </div>
    </div>

    <!-- Hash 路径 -->
    <div v-if="parsedData.hashPath" class="space-y-2">
      <div class="font-medium text-gray-700">Hash 路径：</div>
      <div class="p-3 bg-green-50 rounded border border-green-200">
        <span class="font-mono text-sm break-all">{{ parsedData.hashPath }}</span>
      </div>
    </div>

    <!-- Hash Query 参数 -->
    <div v-if="parsedData.hashQueryParams.length > 0" class="space-y-2">
      <div class="font-medium text-gray-700">Hash Query 参数：</div>
      <div class="space-y-1">
        <div 
          v-for="(param, index) in parsedData.hashQueryParams" 
          :key="`hash-query-${index}`"
          class="flex items-center gap-2 p-2 bg-gray-50 rounded border"
        >
          <span class="font-mono text-sm text-green-600 font-medium">{{ param.key }}:</span>
          <el-tooltip content="点击复制此值" placement="top" :show-after="300">
            <span 
              class="font-mono text-sm flex-1 cursor-pointer hover:bg-yellow-100 px-2 py-1 rounded transition-colors"
              @click="copyValue(param.value)"
            >
              {{ param.value }}
            </span>
          </el-tooltip>
        </div>
      </div>
    </div>

    <!-- Fragment -->
    <div v-if="parsedData.fragment" class="space-y-2">
      <div class="font-medium text-gray-700">Fragment：</div>
      <div class="p-3 bg-purple-50 rounded border border-purple-200">
        <el-tooltip content="点击复制此值" placement="top" :show-after="300">
          <span 
            class="font-mono text-sm break-all cursor-pointer hover:bg-yellow-100 px-2 py-1 rounded transition-colors"
            @click="copyValue(parsedData.fragment)"
          >
            {{ parsedData.fragment }}
          </span>
        </el-tooltip>
      </div>
    </div>

    <!-- 解析统计 -->
    <div class="text-sm text-gray-500 bg-gray-50 p-3 rounded">
      <div>
        共解析：
        <span class="font-medium">{{ getTotalParams() }}</span> 个参数
        <span v-if="parsedData.hashPath">，包含 Hash 路由</span>
        <span v-if="parsedData.fragment">，包含 Fragment</span>
      </div>
    </div>



    <!-- 复制成功提示 -->
    <transition name="fade">
      <div
        v-if="showCopySuccess"
        class="fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50"
      >
        已复制: {{ copiedValue }}
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
    let fullUrl = url
    
    if (isPathOnly) {
      // 对于路径形式的URL，直接手动解析
      const [pathPart, queryPart] = url.includes('?') ? url.split('?', 2) : [url, '']
      
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
      if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('file://')) {
        fullUrl = 'http://' + url
      }

      const urlObj = new URL(fullUrl)

      // 解析 query 参数
      urlObj.searchParams.forEach((value, key) => {
        result.queryParams.push({ key, value })
      })

      // 处理 hash 部分
      if (urlObj.hash) {
        const hash = urlObj.hash.substring(1) // 移除 # 号
        
        // 检查是否包含路由路径和参数
        if (hash.includes('?')) {
          const [hashPath, hashQuery] = hash.split('?', 2)
          result.hashPath = hashPath
          
          // 解析 hash 中的 query 参数
          const hashParams = new URLSearchParams(hashQuery)
          hashParams.forEach((value, key) => {
            result.hashQueryParams.push({ key, value })
          })
        } else if (hash.includes('/')) {
          // 只有路径，没有参数
          result.hashPath = hash
        } else {
          // 纯 fragment
          result.fragment = hash
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
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
