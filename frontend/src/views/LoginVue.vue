<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const email = ref('')
const password = ref('')
const error = ref(null)
const loading = ref(false)

const API = import.meta.env.VITE_API_URL || ''

// Достаём XSRF-TOKEN из cookie
const getXsrf = () => {
  const c = document.cookie.split('; ').find(v => v.startsWith('XSRF-TOKEN='))
  return c ? decodeURIComponent(c.split('=')[1]) : ''
}

async function login() {
  error.value = null
  loading.value = true

  try {
    await fetch('/sanctum/csrf-cookie', {
      method: 'GET',
      credentials: 'include',
      headers: { 'X-Requested-With': 'XMLHttpRequest' }
    })

    const res = await fetch(`/login`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'X-XSRF-TOKEN': getXsrf()
      },
      body: JSON.stringify({ email: email.value, password: password.value })
    })

    const who = await fetch('/user', {
      method:'GET', credentials:'include',
      headers:{ 'Accept':'application/json', 'X-Requested-With':'XMLHttpRequest' }
    })

    if (!(res.status === 204 || res.ok)) throw new Error('Ошибка входа')

    router.push('/dashboard') // редирект
  } catch (e) {
    error.value = e?.message || 'Ошибка входа'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form @submit.prevent="login">
    <h2>Авторизация</h2>
    <input v-model="email" type="email" placeholder="Email" required />
    <input v-model="password" type="password" placeholder="Пароль" required />
    <button type="submit" :disabled="loading">
      {{ loading ? 'Входим…' : 'Войти' }}
    </button>
    <p v-if="error" style="color: red">{{ error }}</p>
  </form>
</template>
