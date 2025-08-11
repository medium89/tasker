<!-- DashboardView.vue -->
<template>
    <section style="max-width: 800px; margin: 32px auto; padding: 16px;">
      <h1 style="font-size: 22px; font-weight: 700; margin-bottom: 8px;">
        Привет, {{ user?.name || '...' }} 👋
      </h1>
  
      <p style="color:#555; margin-bottom: 16px;">
        Это твой дашборд. Здесь потом появятся задачи, статистика и т.п.
      </p>
  
      <router-link to="/profile" style="text-decoration: underline;">
        Перейти в профиль →
      </router-link>
  
      <p v-if="loading" style="margin-top: 16px;">Загружаем пользователя…</p>
      <p v-if="error" style="margin-top: 16px; color:#d00;">{{ error }}</p>
    </section>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { fetchUser } from '@/auth'
  
  const user = ref(null)
  const loading = ref(true)
  const error = ref('')
  
  onMounted(async () => {
    try {
      user.value = await fetchUser()
    } catch (e) {
      error.value = e?.message || 'Не удалось получить пользователя'
    } finally {
      loading.value = false
    }
  })
  </script>
  