<!-- src/views/RegisterView.vue -->
<template>
  <section style="max-width:420px;margin:64px auto;padding:24px;border-radius:16px;box-shadow:0 6px 20px rgba(0,0,0,.08)">
    <h1 style="font-size:20px;font-weight:700;margin-bottom:16px">Регистрация</h1>

    <form @submit.prevent="onSubmit" style="display:grid;gap:12px">
      <input v-model="name" type="text" placeholder="Имя" required
             style="padding:10px;border:1px solid #ddd;border-radius:10px" />
      <input v-model="email" type="email" placeholder="Email" required
             style="padding:10px;border:1px solid #ddd;border-radius:10px" />
      <input v-model="password" type="password" placeholder="Пароль" required
             style="padding:10px;border:1px solid #ddd;border-radius:10px" />
      <input v-model="passwordConfirm" type="password" placeholder="Пароль ещё раз" required
             style="padding:10px;border:1px solid #ddd;border-radius:10px" />

      <button :disabled="loading"
              style="padding:10px;border-radius:12px">
        {{ loading ? 'Загрузка…' : 'Зарегистрироваться' }}
      </button>

      <p v-if="error" style="color:#d00;font-size:13px">{{ error }}</p>
    </form>
    <p style="margin-top:8px;font-size:14px;text-align:center">
      Уже есть аккаунт?
      <RouterLink to="/login">Войти</RouterLink>
    </p>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { register } from '@/auth'
import { auth } from '@/store/auth.js'

const router = useRouter()

const name = ref('')
const email = ref('')
const password = ref('')
const passwordConfirm = ref('')
const loading = ref(false)
const error = ref('')

async function onSubmit() {
  error.value = ''
  loading.value = true
  try {
    const user = await register(
      name.value,
      email.value,
      password.value,
      passwordConfirm.value
    )
    auth.user = user
    router.replace('/dashboard')
  } catch (e) {
    error.value = e?.message || 'Ошибка регистрации'
  } finally {
    loading.value = false
  }
}
</script>
