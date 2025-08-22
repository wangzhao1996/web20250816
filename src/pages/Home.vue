<template>
  <div class="min-h-screen overflow-x-hidden">
    <!-- 背景装饰 -->
    <div class="fixed inset-0 -z-10">
      <!-- 渐变圆圈装饰 -->
      <div class="absolute top-20 left-10 w-72 h-72 bg-primary-300/20 rounded-full blur-3xl animate-pulse-soft"></div>
      <div class="absolute top-40 right-16 w-96 h-96 bg-accent-300/15 rounded-full blur-3xl animate-pulse-soft" style="animation-delay: 1s;"></div>
      <div class="absolute bottom-20 left-1/3 w-80 h-80 bg-success-300/10 rounded-full blur-3xl animate-pulse-soft" style="animation-delay: 2s;"></div>
    </div>

    <main class="container mx-auto px-4 py-12 relative">
      <!-- 页面标题区域 -->
      <div class="text-center mb-16 animate-fade-in">
        <div class="inline-flex items-center gap-4 mb-6">
          <div class="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl flex items-center justify-center shadow-lg animate-float">
            <svg class="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
            </svg>
          </div>
          <h1 class="text-5xl md:text-6xl font-bold title-gradient">
            编码转换工具
          </h1>
        </div>
        <p class="text-xl text-secondary-600 max-w-2xl mx-auto leading-relaxed">
          功能强大的多合一编码转换平台，支持 URL 编码、Base64 编码、进制转换、二维码生成解析、链接解析、JSON 处理等丰富功能
        </p>
        
        <!-- 功能特性标签 -->
        <div class="flex flex-wrap justify-center gap-3 mt-8">
          <span class="px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium">URL 编码</span>
          <span class="px-4 py-2 bg-purple-100 text-purple-700 rounded-full text-sm font-medium">Base64 编码</span>
          <span class="px-4 py-2 bg-accent-100 text-accent-700 rounded-full text-sm font-medium">进制转换</span>
          <span class="px-4 py-2 bg-success-100 text-success-700 rounded-full text-sm font-medium">二维码工具</span>
          <span class="px-4 py-2 bg-warning-100 text-warning-700 rounded-full text-sm font-medium">链接解析</span>
          <span class="px-4 py-2 bg-cyan-100 text-cyan-700 rounded-full text-sm font-medium">JSON 工具</span>
        </div>
      </div>
      
      <!-- 转换器列表 -->
      <div class="space-y-12">
        <div 
          v-for="(_, index) in converters"
          :key="index"
          class="animate-slide-up"
          :style="{ animationDelay: `${index * 0.1}s` }"
        >
          <code-converter
            :ref="el => { if (el) converterRefs[index] = el }"
            :show-close-button="index === converters.length - 1 && converters.length > 1"
            @remove="removeConverter(index)"
          />
        </div>
        
        <!-- 操作按钮区域 -->
        <div class="max-w-6xl mx-auto animate-slide-up" :style="{ animationDelay: `${converters.length * 0.1}s` }">
          <div class="flex gap-4">
            <!-- 清除多余转换器按钮 -->
            <button
              v-if="converters.length > 1"
              @click="clearExtraConverters"
              class="group flex-shrink-0 bg-gradient-to-r from-warning-500 to-warning-600 hover:from-warning-600 hover:to-warning-700 
                     text-white font-medium px-6 py-6 rounded-2xl shadow-lg hover:shadow-xl
                     transform hover:-translate-y-1 transition-all duration-300 ease-out
                     border-0 focus:ring-4 focus:ring-warning-200 relative overflow-hidden"
            >
              <!-- 按钮背景动画 -->
              <div class="absolute inset-0 bg-gradient-to-r from-warning-400 to-warning-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div class="relative flex items-center justify-center gap-3">
                <div class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <el-icon class="text-xl">
                    <delete />
                  </el-icon>
                </div>
                <span class="text-lg font-semibold whitespace-nowrap">清除多余</span>
              </div>
              
              <!-- 装饰性光效 -->
              <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </button>
            
            <!-- 添加新转换器的按钮 -->
            <button
              @click="addConverter"
              class="group flex-1 bg-gradient-to-r from-success-500 to-success-600 hover:from-success-600 hover:to-success-700 
                     text-white font-medium px-8 py-6 rounded-2xl shadow-lg hover:shadow-xl
                     transform hover:-translate-y-1 transition-all duration-300 ease-out
                     border-0 focus:ring-4 focus:ring-success-200 relative overflow-hidden"
            >
              <!-- 按钮背景动画 -->
              <div class="absolute inset-0 bg-gradient-to-r from-success-400 to-success-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div class="relative flex items-center justify-center gap-3">
                <div class="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center group-hover:rotate-90 transition-transform duration-300">
                  <el-icon class="text-2xl">
                    <plus />
                  </el-icon>
                </div>
                <span class="text-xl font-semibold">添加新的转换器</span>
              </div>
              
              <!-- 装饰性光效 -->
              <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </button>
          </div>
        </div>
      </div>

      <!-- 导航链接区域 -->
      <div class="max-w-6xl mx-auto mt-16 animate-slide-up" :style="{ animationDelay: `${(converters.length + 1) * 0.1}s` }">
        <div class="text-center">
          <h3 class="text-2xl font-bold text-secondary-800 mb-8">了解更多</h3>
          <div class="flex flex-wrap justify-center gap-6">
            <!-- 关于我们链接 -->
            <router-link 
              to="/about"
              class="group glass-card rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ease-out border-0 focus:ring-4 focus:ring-primary-200 relative overflow-hidden"
            >
              <!-- 卡片背景动画 -->
              <div class="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-accent-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div class="relative flex items-center gap-4">
                <div class="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-500 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                </div>
                <div class="text-left">
                  <h4 class="text-lg font-semibold text-secondary-800 group-hover:text-primary-600 transition-colors duration-200">
                    关于我们
                  </h4>
                  <p class="text-sm text-secondary-600 mt-1">
                    了解项目背景和技术架构
                  </p>
                </div>
                <svg class="w-5 h-5 text-secondary-400 group-hover:text-primary-500 group-hover:translate-x-1 transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </div>
              
              <!-- 装饰性光效 -->
              <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </router-link>

            <!-- GitHub 链接 -->
            <a 
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              class="group glass-card rounded-2xl p-6 shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 ease-out border-0 focus:ring-4 focus:ring-gray-200 relative overflow-hidden"
            >
              <!-- 卡片背景动画 -->
              <div class="absolute inset-0 bg-gradient-to-br from-gray-500/5 to-gray-700/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              
              <div class="relative flex items-center gap-4">
                <div class="w-12 h-12 bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </div>
                <div class="text-left">
                  <h4 class="text-lg font-semibold text-secondary-800 group-hover:text-gray-700 transition-colors duration-200">
                    GitHub 仓库
                  </h4>
                  <p class="text-sm text-secondary-600 mt-1">
                    查看源代码和贡献指南
                  </p>
                </div>
                <svg class="w-5 h-5 text-secondary-400 group-hover:text-gray-500 group-hover:translate-x-1 transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                </svg>
              </div>
              
              <!-- 装饰性光效 -->
              <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            </a>
          </div>
        </div>
      </div>

      <!-- 页脚信息 -->
      <footer class="text-center mt-20 text-secondary-500 text-sm">
        <div class="flex items-center justify-center gap-2 mb-2">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.56-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.56.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clip-rule="evenodd"></path>
          </svg>
          <span>基于 Vue 3 + TypeScript + Tailwind CSS 构建</span>
        </div>
        <p>&copy; 2024 编码转换工具 - 让编码转换变得简单高效</p>
      </footer>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue'
import { Plus, Delete } from '@element-plus/icons-vue'
import CodeConverter from '@/components/CodeConverter.vue'

const converters = ref([1]) // 初始化一个转换器
const converterRefs = ref<any[]>([]) // 存储转换器组件的引用

async function addConverter() {
  converters.value.push(1)
  
  // 等待DOM更新完成
  await nextTick()
  
  // 滚动到页面底部
  window.scrollTo({
    top: document.documentElement.scrollHeight,
    behavior: 'smooth'
  })
  
  // 等待滚动动画完成后再聚焦文本框
  setTimeout(() => {
    focusLatestConverter()
  }, 800) // 给滚动动画留出时间
}

function focusLatestConverter() {
  try {
    // 尝试通过组件引用调用聚焦方法
    const lastConverterIndex = converters.value.length - 1
    const lastConverter = converterRefs.value[lastConverterIndex]
    
    if (lastConverter && typeof lastConverter.focusTextarea === 'function') {
      lastConverter.focusTextarea()
      return
    }
    
    // 备用方案：直接查找DOM元素
    const textareas = document.querySelectorAll('.el-textarea__inner')
    const lastTextarea = textareas[textareas.length - 1] as HTMLTextAreaElement
    if (lastTextarea) {
      lastTextarea.focus()
      lastTextarea.select()
    }
  } catch (error) {
    console.warn('无法聚焦到文本框:', error)
  }
}

function removeConverter(index: number) {
  converters.value.splice(index, 1)
}

function clearExtraConverters() {
  // 只保留第一个转换器
  converters.value = [1]
  // 清空组件引用数组
  converterRefs.value = []
}
</script>