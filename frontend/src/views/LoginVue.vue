<script setup>
import { ref } from 'vue'

const email = ref(''); const password = ref('')
const error = ref(null); const loading = ref(false)

const getXsrf = () => {
  const c = document.cookie.split('; ').find(v => v.startsWith('XSRF-TOKEN='))
  return c ? decodeURIComponent(c.split('=')[1]) : ''
}

async function login() {
  error.value = null; loading.value = true
  try {
    await fetch('/sanctum/csrf-cookie', { method:'GET', credentials:'include', headers:{'X-Requested-With':'XMLHttpRequest'} })

    const res = await fetch('/login', {
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

    if (!(res.status === 204 || res.ok)) {
      let msg = 'Ошибка входа'
      try { msg = (await res.clone().json()).message || msg } catch { /* ignore */ }
      throw new Error(msg)
    }

    // опционально: подтянуть пользователя
    // const me = await fetch('/api/user', { credentials:'include', headers:{'Accept':'application/json','X-Requested-With':'XMLHttpRequest'} })
    // console.log('me status:', me.status, me.ok && await me.json())
  } catch (e) {
    error.value = e.message || 'Ошибка входа'
  } finally {
    loading.value = false
  }
}
</script>


<template>
  <form @submit.prevent="login">
    <div>
      <label>Email:</label>
      <input v-model="email" type="email" required />
    </div>
    <div>
      <label>Пароль:</label>
      <input v-model="password" type="password" required />
    </div>
    <button type="submit">Войти</button>
    <p v-if="error" style="color:red">{{ error }}</p>
  </form>
</template>
