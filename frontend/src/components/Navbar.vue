<template>
    <nav style="margin-bottom: 20px; border-bottom: 1px solid #ccc; padding: 10px;">
      <span v-if="user">Логин: {{ user.name }}</span>
      <span v-else>Не авторизован</span>
    </nav>
  </template>
  
  <script>
  export default {
    data() {
      return {
        user: null
      }
    },
    mounted() {
      fetch('/user', {
        credentials: 'include',
        headers: {
          'Accept': 'application/json',
          'X-Requested-With': 'XMLHttpRequest'
        }
      })
        .then(res => {
          if (!res.ok) throw new Error('Не авторизован');
          return res.json();
        })
        .then(data => {
          this.user = data;
        })
        .catch(() => {
          this.user = null;
        });
    }
  }
  </script>
  