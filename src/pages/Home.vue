<template>
  <div class="min-h-screen bg-gray-100">
    <main class="container py-8">
      <h1 class="text-4xl font-bold text-center text-gray-900 mb-8">
        {{ title }}
      </h1>
      <div class="text-center">
        <p class="text-xl mb-4">Count: {{ store.count }}</p>
        <el-button type="primary" @click="store.increment">
          Increment
        </el-button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useMainStore } from '@/stores'

const store = useMainStore()
const title = ref('Vue 3 + TypeScript + Vite')
</script>
