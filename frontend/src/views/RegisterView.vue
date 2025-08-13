<!-- src/views/RegisterView.vue -->
<template>
  <section
    style="max-width:420px;margin:64px auto;padding:24px;border-radius:16px;box-shadow:0 6px 20px rgba(0,0,0,.08)"
    class="register"
  >
    <h1 style="font-size:20px;font-weight:700;margin-bottom:16px" class="register__title">
      Регистрация
    </h1>

    <form @submit.prevent="onSubmit" style="display:grid;gap:12px" class="register__form">
      <input
        v-model="name"
        type="text"
        placeholder="Имя"
        required
        style="padding:10px;border:1px solid #ddd;border-radius:10px"
        class="register__input register__input--name"
      />
      <input
        v-model="email"
        type="email"
        placeholder="Email"
        required
        style="padding:10px;border:1px solid #ddd;border-radius:10px"
        class="register__input register__input--email"
      />
      <input
        v-model="password"
        type="password"
        placeholder="Пароль"
        required
        style="padding:10px;border:1px solid #ddd;border-radius:10px"
        class="register__input register__input--password"
      />
      <input
        v-model="passwordConfirm"
        type="password"
        placeholder="Пароль ещё раз"
        required
        style="padding:10px;border:1px solid #ddd;border-radius:10px"
        class="register__input register__input--password-confirm"
      />

      <button
        :disabled="loading"
        style="padding:10px;border-radius:12px"
        class="register__submit"
      >
        {{ loading ? 'Загрузка…' : 'Зарегистрироваться' }}
      </button>

      <p v-if="error" style="color:#d00;font-size:13px" class="register__error">{{ error }}</p>
    </form>
    <p style="margin-top:8px;font-size:14px;text-align:center" class="register__login">
      Уже есть аккаунт?
      <RouterLink to="/login" class="register__login-link">Войти</RouterLink>
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
