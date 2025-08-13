<!-- src/views/RegisterView.vue -->
<template>
  <section>
    <h1>Регистрация</h1>

    <form @submit.prevent="onSubmit">
      <input v-model="name" type="text" placeholder="Имя" required />
      <input v-model="email" type="email" placeholder="Email" required />
      <input v-model="password" type="password" placeholder="Пароль" required />
      <input v-model="passwordConfirm" type="password" placeholder="Пароль ещё раз" required />

      <button :disabled="loading">
        {{ loading ? 'Загрузка…' : 'Зарегистрироваться' }}
      </button>

      <p v-if="error">{{ error }}</p>
    </form>
    <p>
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
