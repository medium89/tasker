<script setup>
import { useRouter } from 'vue-router'
import { auth } from '@/stores/auth'

const router = useRouter()

async function logout() {
  await fetch('/logout', {
    method: 'POST',
    credentials: 'include',
    headers: { 'Accept': 'application/json' }
  })
  auth.logout()
  router.push('/login')
}
</script>

<template>
  <button @click="logout">Выйти</button>
</template>
