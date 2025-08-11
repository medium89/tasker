// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import LoginVue from '@/views/LoginView.vue'
import { fetchUser } from '@/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/auth' },
    { path: '/auth', name: 'login', component: LoginVue }, // публичный
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/DashboardView.vue'),
      meta: { requiresAuth: true },
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue'),
      meta: { requiresAuth: true },
    },
  ],
})

router.beforeEach(async (to) => {
  if (!to.meta?.requiresAuth) return true
  const me = await fetchUser().catch(() => null)
  if (!me) return { name: 'login', query: { redirect: to.fullPath } }
  return true
})

export default router
