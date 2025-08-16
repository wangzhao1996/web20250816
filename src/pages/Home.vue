<template>
  <div class="min-h-screen bg-gray-100">
    <main class="container mx-auto px-4 py-8">
      <h1 class="text-4xl font-bold text-center text-gray-900 mb-8">
        编码转换工具
      </h1>
      <code-converter />
    </main>
  </div>
</template>

<script setup lang="ts">
import CodeConverter from '@/components/CodeConverter.vue'
</script>