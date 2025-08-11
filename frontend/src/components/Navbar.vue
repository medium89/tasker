<!-- Navbar.vue -->
<template>
    <nav style="display:flex; align-items:center; justify-content:space-between; padding:12px 16px; border-bottom:1px solid #eee;">
      <div style="font-weight:600;">Tasker</div>
      <div>
        <template v-if="loading">Проверяем вход…</template>
        <template v-else-if="user">
          Привет, {{ user.name }}
          <button @click="onLogout" style="margin-left: 8px; text-decoration: underline;">Выйти</button>
        </template>
        <template v-else>
          <router-link to="/login">Войти</router-link>
        </template>
      </div>
    </nav>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { fetchUser, logout } from '@/auth';
  import { useRouter } from 'vue-router';
  
  const router = useRouter();
  const user = ref(null);
  const loading = ref(true);
  
  async function load() {
    loading.value = true;
    try {
      user.value = await fetchUser();
    } finally {
      loading.value = false;
    }
  }
  
  async function onLogout() {
    await logout();
    user.value = null;
    router.replace('/login');
  }
  
  onMounted(load);
  </script>
  