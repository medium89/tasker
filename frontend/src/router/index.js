import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/auth' },
    { path: '/auth', name: 'auth', component: LoginView },
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

router.beforeEach(async (to, from, next) => {
  if (!to.meta.requiresAuth) return next()
  try {
    const res = await fetch('/user', {
      credentials: 'include',
      headers: { Accept: 'application/json' }
    })
    if (res.ok) return next()
  } catch (_) {}
  next('/auth')
})

export default router
