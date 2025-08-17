<template>
  <div class="min-h-screen overflow-x-hidden flex items-center justify-center">
    <!-- 背景装饰 -->
    <div class="fixed inset-0 -z-10">
      <div class="absolute top-20 left-10 w-72 h-72 bg-danger-300/20 rounded-full blur-3xl animate-pulse-soft"></div>
      <div class="absolute top-40 right-16 w-96 h-96 bg-warning-300/15 rounded-full blur-3xl animate-pulse-soft" style="animation-delay: 1s;"></div>
      <div class="absolute bottom-20 left-1/3 w-80 h-80 bg-secondary-300/10 rounded-full blur-3xl animate-pulse-soft" style="animation-delay: 2s;"></div>
    </div>

    <div class="text-center p-8 animate-fade-in">
      <!-- 404 图标 -->
      <div class="mb-8 animate-bounce">
        <div class="inline-flex items-center justify-center w-32 h-32 bg-gradient-to-br from-danger-500 to-warning-500 rounded-full shadow-2xl">
          <svg class="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33l-.147-.15C5.774 12.52 5.774 12.48 5.773 12.479L5.772 12.479"></path>
          </svg>
        </div>
      </div>

      <!-- 标题 -->
      <h1 class="text-8xl md:text-9xl font-bold title-gradient mb-6">
        404
      </h1>
      
      <!-- 副标题 -->
      <h2 class="text-3xl md:text-4xl font-semibold text-secondary-700 mb-4">
        页面未找到
      </h2>
      
      <!-- 描述 -->
      <p class="text-xl text-secondary-600 mb-12 max-w-2xl mx-auto leading-relaxed">
        抱歉，您访问的页面不存在或已被移除。让我们帮您回到正轨！
      </p>

      <!-- 操作按钮 -->
      <div class="flex flex-col sm:flex-row gap-4 justify-center items-center">
        <!-- 返回首页按钮 -->
        <button
          @click="goHome"
          class="group bg-gradient-to-r from-primary-500 to-accent-500 hover:from-primary-600 hover:to-accent-600 
                 text-white font-medium px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl
                 transform hover:-translate-y-1 transition-all duration-300 ease-out
                 border-0 focus:ring-4 focus:ring-primary-200 relative overflow-hidden"
        >
          <!-- 按钮背景动画 -->
          <div class="absolute inset-0 bg-gradient-to-r from-primary-400 to-accent-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          
          <div class="relative flex items-center gap-3">
            <svg class="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
            </svg>
            <span class="text-lg font-semibold">返回首页</span>
          </div>
          
          <!-- 装饰性光效 -->
          <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        </button>

        <!-- 关于页面按钮 -->
        <button
          @click="goAbout"
          class="group bg-white hover:bg-secondary-50 text-secondary-700 hover:text-secondary-800 
                 font-medium px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl
                 transform hover:-translate-y-1 transition-all duration-300 ease-out
                 border-2 border-secondary-200 hover:border-secondary-300 focus:ring-4 focus:ring-secondary-200 relative overflow-hidden"
        >
          <div class="relative flex items-center gap-3">
            <svg class="w-5 h-5 group-hover:rotate-12 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <span class="text-lg font-semibold">了解更多</span>
          </div>
        </button>
      </div>

      <!-- 建议链接 -->
      <div class="mt-16 space-y-4">
        <p class="text-secondary-500 font-medium">您可能想要：</p>
        <div class="flex flex-wrap justify-center gap-4">
          <router-link
            to="/"
            class="px-4 py-2 bg-primary-100 hover:bg-primary-200 text-primary-700 rounded-full text-sm font-medium transition-colors duration-200"
          >
            编码转换工具
          </router-link>
          <router-link
            to="/about"
            class="px-4 py-2 bg-accent-100 hover:bg-accent-200 text-accent-700 rounded-full text-sm font-medium transition-colors duration-200"
          >
            关于我们
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

function goHome() {
  router.push('/')
}

function goAbout() {
  router.push('/about')
}
</script>
