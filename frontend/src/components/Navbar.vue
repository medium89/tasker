<!-- eslint-disable vue/multi-word-component-names -->
<template>
    <nav>
      <ul>
        <template v-if="auth.user">
          <li>{{ auth.user.name }}</li>
          <li><router-link to="/profile">Профиль</router-link></li>
          <li><router-link to="/dashboard">Доска</router-link></li>
          <li><a href="#" @click.prevent="logout">Выйти</a></li>
        </template>
        <template v-else>
          <li><router-link to="/register">Регистрация</router-link></li>
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
  
  