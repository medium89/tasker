<!-- eslint-disable vue/multi-word-component-names -->
<!-- UserStatus.vue -->
<template>
  <div>
    <template v-if="loading">Загрузка…</template>
    <template v-else-if="user">Привет, {{ user.name }} <button @click="onLogout" class="btn btn-secondary">Выйти</button></template>
    <template v-else>Вы не авторизованы</template>
  </div>
</template>

<script setup>
 
import { ref, onMounted } from 'vue'
import { fetchUser, logout } from './login'

const user = ref(null)
const loading = ref(true)

async function load() {
  loading.value = true
  try {
    user.value = await fetchUser()
  } finally {
    loading.value = false
  }
}

async function onLogout() {
  await logout()
  user.value = null
  // по желанию: window.location.reload()
}

onMounted(load)
</script>
