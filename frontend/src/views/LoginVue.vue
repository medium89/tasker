<script setup>
import { ref } from 'vue'
const email = ref(''); const password = ref(''); const error = ref(null); const loading = ref(false); const me = ref(null)

const getXsrf = () => {
  const c = document.cookie.split('; ').find(v => v.startsWith('XSRF-TOKEN='))
  return c ? decodeURIComponent(c.split('=')[1]) : ''
}

const login = async () => {
  error.value = null; loading.value = true
  try {
    await fetch('/sanctum/csrf-cookie', {
      method: 'GET',
      credentials: 'include',
      headers: { 'X-Requested-With': 'XMLHttpRequest' }
    })

    const xsrf = getXsrf()
    const res = await fetch('/api/login', {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'X-Requested-With': 'XMLHttpRequest',
        'X-XSRF-TOKEN': xsrf
      },
      body: JSON.stringify({ email: email.value, password: password.value })
    })

    if (!(res.ok || res.status === 204)) {
      let msg = 'Неверный email или пароль'
      try { msg = (await res.json()).message || msg } catch {}
      throw new Error(msg)
    }
    // успех → можно сразу запросить /api/user
  } catch (e) {
    error.value = e.message || 'Ошибка входа'
  } finally { loading.value = false }
}
</script>


<template>
  <form @submit.prevent="login" style="max-width:360px;margin:10vh auto">
    <input v-model="email" type="email" placeholder="Email" required />
    <input v-model="password" type="password" placeholder="Пароль" required style="margin-left:8px" />
    <button type="submit" :disabled="loading" style="margin-left:8px">
      {{ loading ? 'Входим…' : 'Войти' }}
    </button>

    <p v-if="error" style="color:#e11d48;margin-top:8px">{{ error }}</p>
    <pre v-if="me" style="margin-top:8px;white-space:pre-wrap">{{ me }}</pre>
  </form>
</template>
