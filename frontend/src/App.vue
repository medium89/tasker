<template>
  <div>
    <Navbar />
    <router-view />
  </div>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue'
import { auth } from '@/store/auth.js'

// при загрузке проверяем авторизацию
auth.getUser()
</script>
