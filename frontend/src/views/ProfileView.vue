<!-- ProfileView.vue -->
<template>
    <section style="max-width: 600px; margin: 32px auto; padding: 16px;">
      <h1 style="font-size: 22px; font-weight: 700; margin-bottom: 16px;">Профиль</h1>
  
      <div v-if="loading">Загружаем профиль…</div>
      <div v-else-if="error" style="color:#d00;">{{ error }}</div>
      <div v-else-if="user">
        <p><strong>Имя:</strong> {{ user.name }}</p>
        <p><strong>Email:</strong> {{ user.email }}</p>
        <p><strong>Создан:</strong> {{ new Date(user.created_at).toLocaleString() }}</p>
      </div>
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
      error.value = e?.message || 'Не удалось загрузить профиль'
    } finally {
      loading.value = false
    }
  })
  </script>
  