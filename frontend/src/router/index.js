import { createRouter, createWebHistory } from 'vue-router'
import LoginVue from '@/views/LoginVue.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/auth' },
    { path: '/login', redirect: '/auth' }, // чтобы старый путь вёл на новый
    { path: '/auth', name: 'login', component: LoginVue },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: () => import('@/views/DashboardView.vue'),
      meta: { requiresAuth: true }
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('@/views/ProfileView.vue'),
      meta: { requiresAuth: true }
    }
  ]
})

// Глобальный гвард авторизации
router.beforeEach(async (to, from, next) => {
  if (to.meta.requiresAuth) {
    try {
      const res = await fetch('/user', {
        credentials: 'include',
        headers: { 'Accept': 'application/json' }
      })

      if (!res.ok) {
        // Если не авторизован, перекидываем на /auth
        return next('/auth')
      }
    } catch (e) {
      return next('/auth')
    }
  }
  next()
})

export default router
