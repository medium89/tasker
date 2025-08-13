<!-- src/views/LoginVue.vue -->
<template>
  <section style="max-width:420px;margin:64px auto;padding:24px;border-radius:16px;box-shadow:0 6px 20px rgba(0,0,0,.08)">
    <h1 style="font-size:20px;font-weight:700;margin-bottom:16px">Авторизация</h1>

    <form @submit.prevent="onSubmit" style="display:grid;gap:12px">
      <input v-model="email" type="email" placeholder="Email" required
             style="padding:10px;border:1px solid #ddd;border-radius:10px" />
      <input v-model="password" type="password" placeholder="Пароль" required
             style="padding:10px;border:1px solid #ddd;border-radius:10px" />

      <button :disabled="loading"
              style="padding:10px;border-radius:12px">
        {{ loading ? 'Входим…' : 'Войти' }}
      </button>

      <p v-if="error" style="color:#d00;font-size:13px">{{ error }}</p>
    </form>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { login } from '@/auth'

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
    await login(email.value, password.value)
    const to = (route.query.redirect && String(route.query.redirect)) || '/dashboard'
    router.replace(to)
  } catch (e) {
    error.value = e?.message || 'Ошибка входа'
  } finally {
    loading.value = false
  }
}
</script>
