<!-- src/views/LoginVue.vue -->
<template>
  <section>
    <h1>Авторизация</h1>

    <form @submit.prevent="onSubmit">
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Пароль" required />

      <button :disabled="loading">
        {{ loading ? 'Загрузка…' : 'Войти' }}
      </button>

      <p v-if="error">{{ error }}</p>
    </form>
    <p>
      Нет аккаунта?
      <RouterLink to="/register">Регистрация</RouterLink>
    </p>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { login } from '@/auth'
import { auth } from '@/store/auth.js'

const router = useRouter()
const route = useRoute()

const email = ref('')
const password = ref('')
const loading = ref(false)
const error = ref('')

async function onSubmit() {
  error.value = ''
  loading.value = true
  try {
    const user = await login(email.value, password.value)
    auth.user = user
    const to = (route.query.redirect && String(route.query.redirect)) || '/dashboard'
    router.replace(to)
  } catch (e) {
    error.value = e?.message || 'Ошибка входа'
  } finally {
    loading.value = false
  }
}
</script>
