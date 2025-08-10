<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const user = ref({ name: '', email: '' })
const loading = ref(false)
const message = ref('')
const error = ref('')

// Загружаем данные профиля
onMounted(async () => {
  try {
    const res = await fetch('/user', {
      credentials: 'include',
      headers: { 'Accept': 'application/json' }
    })
    if (!res.ok) throw new Error('Не удалось загрузить профиль')
    user.value = await res.json()
  } catch (e) {
    error.value = e.message
  }
})

// Сохраняем изменения
async function saveProfile() {
  loading.value = true
  message.value = ''
  error.value = ''

  try {
    const res = await fetch('/user/profile-information', {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(user.value)
    })
    if (!res.ok) throw new Error('Ошибка сохранения')
    message.value = 'Профиль обновлён'
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}

// Удаляем аккаунт
async function deleteAccount() {
  if (!confirm('Точно удалить аккаунт? Это действие необратимо!')) return

  loading.value = true
  try {
    const res = await fetch('/user', {
      method: 'DELETE',
      credentials: 'include',
      headers: { 'Accept': 'application/json' }
    })
    if (!res.ok) throw new Error('Ошибка удаления')
    router.push('/login')
  } catch (e) {
    error.value = e.message
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div>
    <h2>Мой профиль</h2>

    <p v-if="error" style="color:red">{{ error }}</p>
    <p v-if="message" style="color:green">{{ message }}</p>

    <div>
      <label>Имя:</label>
      <input v-model="user.name" type="text" />
    </div>

    <div>
      <label>Email:</label>
      <input v-model="user.email" type="email" />
    </div>

    <button @click="saveProfile" :disabled="loading">Сохранить</button>
    <button @click="deleteAccount" :disabled="loading" style="margin-left: 10px; color: red;">
      Удалить аккаунт
    </button>
  </div>
</template>
