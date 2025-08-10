<script setup>
import { ref } from 'vue'

const email = ref('')
const password = ref('')
const error = ref(null)
const loading = ref(false)
const me = ref(null)

/**
 * Достаём XSRF-TOKEN из cookie (нужен для POST /login).
 */
const getXsrf = () => {
  const c = document.cookie.split('; ').find(v => v.startsWith('XSRF-TOKEN='))
  return c ? decodeURIComponent(c.split('=')[1]) : ''
}

async function login() {
  error.value = null
  loading.value = true
  me.value = null

  try {
    // 1) Получаем CSRF-cookie от Sanctum
    await fetch('/sanctum/csrf-cookie', {
      method: 'GET',
      credentials: 'include',
      headers: { 'X-Requested-With': 'XMLHttpRequest' }
    })

    // 2) Логинимся через web-маршрут (а не /api/login)
    const res = await fetch(`${import.meta.env.VITE_API_URL || ''}/login`, {
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

    // Breeze/Fortify обычно возвращают 204 на успех
    if (!(res.status === 204 || res.ok)) {
      let msg = 'Ошибка входа'
      try {
        const data = await res.clone().json()
        msg = data.message || msg
      } catch {}
      throw new Error(msg)
    }

    // 3) Опционально — подтянуть текущего пользователя (проверка, что сессия живая)
    const who = await fetch('/user', {
      method: 'GET',
      credentials: 'include',
      headers: { 'Accept': 'application/json', 'X-Requested-With': 'XMLHttpRequest' }
    })

    if (who.ok) {
      me.value = await who.json()
    } else {
      // Если /user не отдал пользователя, считаем это ошибкой сессии
      throw new Error('Не удалось получить профиль пользователя')
    }
  } catch (e) {
    error.value = e?.message || 'Ошибка входа'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="login-container">
    <form @submit.prevent="login" class="login-form">
      <h2 class="form-title">Авторизация</h2>
      <div class="form-group">
        <label for="email" class="form-label">Email</label>
        <input id="email" v-model="email" type="email" required autocomplete="username" class="form-input" />
      </div>

      <div class="form-group">
        <label for="password" class="form-label">Пароль</label>
        <input id="password" v-model="password" type="password" required autocomplete="current-password" class="form-input" />
      </div>

      <div class="form-group">
        <button type="submit" :disabled="loading" class="submit-button">
          {{ loading ? 'Входим…' : 'Войти' }}
        </button>
      </div>

      <p v-if="error" class="message error-message">{{ error }}</p>

      <div v-if="me" class="message success-message">
        <strong class="success-title">Вошли как:</strong>
        <pre class="user-data">{{ me }}</pre>
      </div>
    </form>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');

body {
  font-family: 'Roboto', sans-serif;
  background-color: #ffffff; /* Фон страницы стал белым */
}

.login-container {
  /* Позиционирование формы по центру */
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  
  /* Убрали лишние свойства, так как позиционирование теперь абсолютное */
  display: block;
  min-height: auto;
  padding: 0;
  
  width: 100%;
  max-width: 400px; /* Ширина формы максимум 400px */
}

.login-form {
  width: 100%;
  max-width: 400px;
  padding: 40px 70px;
  background: #ffffff;
  border-radius: 12px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.4);
  display: flex;
  flex-direction: column;
  gap: 30px;
  box-sizing: border-box;
  align-items: center;
}

/* Все надписи делаем заглавными */
.form-title,
.form-label,
.submit-button,
.success-title {
  text-transform: uppercase;
}

.form-title {
  text-align: center;
  margin-bottom: 0;
  color: #555555; /* Цвет текста стал приглушенным */
  font-size: 20px; /* Размер шрифта уменьшен */
  font-weight: bold;
}

.form-group {
  display: flex;
  flex-direction: column;
  width: 100%;
}

.form-group:last-child {
  margin-top: 20px;
}

.form-label {
  margin-bottom: 8px;
  font-weight: 500;
  color: #777777; /* Цвет текста стал приглушенным */
  font-size: 12px; /* Размер шрифта уменьшен */
}

.form-input {
  padding: 12px;
  border: 1px solid #e0e0e0; /* Цвет границы стал приглушенным */
  border-radius: 8px;
  font-size: 16px;
  transition: border-color 0.3s, box-shadow 0.3s;
}

.form-input:focus {
  outline: none;
  border-color: #8da9c4; /* Цвет фокуса стал приглушенным */
  box-shadow: 0 0 0 3px rgba(141, 169, 196, 0.25);
}

.submit-button {
  width: 100%;
  padding: 12px;
  background-color: #8da9c4; /* Цвет кнопки стал приглушенным */
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 18px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s, transform 0.1s;
}

.submit-button:hover {
  background-color: #6c8aab; /* Цвет кнопки при наведении стал приглушенным */
}

.submit-button:active {
  transform: scale(0.99);
}

.submit-button:disabled {
  background-color: #e0e0e0; /* Цвет отключенной кнопки стал приглушенным */
  cursor: not-allowed;
}

.message {
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  line-height: 1.5;
  word-break: break-word;
}

.error-message {
  background-color: #fff0f0; /* Цвет фона ошибки стал приглушенным */
  color: #c44d56; /* Цвет текста ошибки стал приглушенным */
  border: 1px solid #f9d7d7; /* Цвет границы ошибки стал приглушенным */
}

.success-message {
  background-color: #f0fff0; /* Цвет фона успеха стал приглушенным */
  color: #4CAF50; /* Цвет текста успеха стал приглушенным */
  border: 1px solid #d7f9d7; /* Цвет границы успеха стал приглушенным */
}

.success-title {
  display: block;
  font-weight: 500;
  margin-bottom: 8px;
}

.user-data {
  background: #f8f8f8; /* Цвет фона данных стал приглушенным */
  border-radius: 6px;
  padding: 8px;
  font-family: 'Courier New', Courier, monospace;
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>