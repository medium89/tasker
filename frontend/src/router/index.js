// src/router/index.js (или .ts)
import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '@/views/LoginPage.vue'

const routes = [
  { path: '/login', component: LoginPage },
  // другие маршруты
]

export default createRouter({
  history: createWebHistory(),
  routes,
})
