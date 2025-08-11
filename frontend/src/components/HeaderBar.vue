<!-- src/components/HeaderBar.vue -->
<script setup>
import { isAuthenticated, userName } from '@/auth' // добавили
</script>

<template>
  <header class="header">
    <div class="left">
      <slot name="logo">Tasker</slot>
    </div>

    <div class="right">
      <!-- Бейдж статуса -->
      <span
        class="auth-badge"
        :class="isAuthenticated ? 'ok' : 'nope'"
        title="Статус авторизации"
      >
        {{ isAuthenticated ? 'Авторизован' : 'Не авторизован' }}
      </span>

      <!-- Опционально покажем имя -->
      <span v-if="isAuthenticated" class="user-name">· {{ userName }}</span>

      <slot name="actions" />
    </div>
  </header>
</template>

<style scoped>
.header {
  display: flex; align-items: center; justify-content: space-between;
  padding: 10px 16px; border-bottom: 1px solid #eee; background: #fff;
}
.right { display: flex; align-items: center; gap: 8px; }
.auth-badge {
  padding: 4px 8px; border-radius: 9999px; font-size: 12px; line-height: 1;
  border: 1px solid transparent;
}
.auth-badge.ok { background: #e8f7ef; color: #0f8f4e; border-color: #bde6cf; }
.auth-badge.nope { background: #fdeaea; color: #c33; border-color: #f5c2c2; }
.user-name { color: #666; font-size: 12px; }
</style>
