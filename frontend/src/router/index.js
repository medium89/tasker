import { createRouter, createWebHistory } from 'vue-router'
import LoginVue from '@/views/LoginVue.vue' // имя совпадает с файлом

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', name: 'login', component: LoginVue },
  ],
})
