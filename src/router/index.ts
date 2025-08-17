import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: () => import('@/pages/Home.vue'),
    meta: {
      title: '编码转换工具',
      keepAlive: true
    }
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('@/pages/About.vue'),
    meta: {
      title: '关于我们',
      keepAlive: true
    }
  },
  {
    path: '/404',
    name: 'notFound',
    component: () => import('@/pages/NotFound.vue'),
    meta: {
      title: '页面未找到',
      keepAlive: false
    }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/404'
  }
]

const router = createRouter({
  history: createWebHistory('/web20250816/'),
  routes,
})

// 全局前置守卫 - 设置页面标题
router.beforeEach((to, _from, next) => {
  // 设置页面标题
  if (to.meta?.title) {
    document.title = `${to.meta.title} - 编码转换工具`
  } else {
    document.title = '编码转换工具'
  }
  next()
})

export default router
