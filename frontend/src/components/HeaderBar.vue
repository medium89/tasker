<script setup>
import LogoutButton from './LogoutButton.vue'
</script>

<template>
  <nav>
    <router-link to="/dashboard">Задачи</router-link> |
    <router-link to="/profile">Профиль</router-link> |
    <LogoutButton />
  </nav>
</template>
