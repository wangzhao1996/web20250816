<template>
  <div class="min-h-screen bg-gray-100">
    <main class="container mx-auto px-4 py-8">
      <h1 class="text-4xl font-bold text-center text-gray-900 mb-8">
        编码转换工具
      </h1>
      
      <div class="space-y-8">
        <!-- 现有的转换器列表 -->
        <code-converter
          v-for="(_, index) in converters"
          :key="index"
          :show-close-button="index > 0"
          @remove="removeConverter(index)"
        />
        
        <!-- 添加新转换器的按钮 -->
        <div class="max-w-6xl mx-auto">
          <el-button
            type="success"
            size="large"
            class="w-full !bg-green-500 hover:!bg-green-600 !text-white !border-none !h-16 !text-lg"
            @click="addConverter"
          >
            <div class="flex items-center justify-center gap-2">
              <el-icon class="text-2xl">
                <plus />
              </el-icon>
              <span>添加新的转换器</span>
            </div>
          </el-button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import CodeConverter from '@/components/CodeConverter.vue'

const converters = ref([1]) // 初始化一个转换器

function addConverter() {
  converters.value.push(1)
}

function removeConverter(index: number) {
  converters.value.splice(index, 1)
}
</script>