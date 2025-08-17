<template>
  <router-view v-slot="{ Component, route }">
    <!-- 根据路由元数据决定是否使用 KeepAlive -->
    <template v-if="route.meta?.keepAlive">
      <keep-alive>
        <component 
          :is="Component" 
          :key="route.fullPath"
        />
      </keep-alive>
    </template>
    <!-- 不缓存的路由直接渲染 -->
    <template v-else>
      <component 
        :is="Component" 
        :key="route.fullPath"
      />
    </template>
  </router-view>
</template>

<script setup lang="ts">
// App.vue - 支持路由缓存的根组件
</script>
