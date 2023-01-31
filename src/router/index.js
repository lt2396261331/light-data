import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/home'
    },
    {
      path: '/home',
      component: () => import('@/views/home/index.vue')
    },
    {
      path: '/area',
      component: () => import('@/views/area/index.vue')
    },
    {
      path: '/add-area',
      component: () => import('@/views/add-area/index.vue')
    },
    {
      path: '/update-area/:id',
      component: () => import('@/views/add-area/update.vue')
    },
    {
      path: '/light',
      component: () => import('@/views/light/index.vue')
    },
    {
      path: '/deploy-light',
      component: () => import('@/views/light/deploy.vue')
    }
  ]
})

export default router
