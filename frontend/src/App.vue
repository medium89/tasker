<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

async function logout() {
  await fetch('/logout', {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Accept': 'application/json',
      'X-Requested-With': 'XMLHttpRequest'
    }
  })
  router.push('/login') // после выхода отправляем на страницу входа
}
</script>

<template>
  <div style="padding: 10px; background: #f0f0f0;">
    <button @click="logout" style="margin-right: 10px;">Выйти</button>
    <router-link to="/profile">Профиль</router-link>
    <router-link to="/dashboard">Доска</router-link>
  </div>

  <router-view />
</template>
