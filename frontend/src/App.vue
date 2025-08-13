<template>
  <div class="app">
    <Navbar v-if="showNavbar" />
    <div class="content">
      <router-view />
    </div>
  </div>
</template>

<script setup>
import Navbar from '@/components/Navbar.vue'
import { auth } from '@/store/auth.js'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

// при загрузке проверяем авторизацию
auth.getUser()

const route = useRoute()
const showNavbar = computed(() => !['/login', '/register'].includes(route.path))
</script>