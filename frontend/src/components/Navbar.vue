<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <nav class="navbar">
    <ul class="navbar__list">
      <template v-if="auth.user">
        <li class="navbar__item">{{ auth.user.name }}</li>
        <li class="navbar__item"><router-link to="/profile">Профиль</router-link></li>
        <li class="navbar__item"><router-link to="/dashboard">Доска</router-link></li>
        <li class="navbar__item"><a href="#" @click.prevent="logout">Выйти</a></li>
      </template>
      <template v-else>
        <li class="navbar__item"><router-link to="/register">Регистрация</router-link></li>
      </template>
    </ul>
  </nav>
</template>
  
  <script setup>
   
import { auth } from '../store/auth.js'

import { useRouter } from 'vue-router'
const router = useRouter()


async function logout() {
  await auth.logout()
  router.push('/login')
}
  </script>
  
  