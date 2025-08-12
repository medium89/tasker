<template>
    <nav class="navbar">
      <ul>
        <template v-if="auth.user">
          <li>{{ auth.user.name }}</li>
          <li><router-link to="/profile">Профиль</router-link></li>
          <li><router-link to="/dashboard">Доска</router-link></li>
          <li><button @click="logout">Выйти</button></li>
        </template>
  
        <template v-else>
          <li><router-link to="/auth">Авторизация</router-link></li>
        </template>
      </ul>
    </nav>
  </template>
  
  <script setup>
  import { auth } from '../store/auth.js'
  
  function logout() {
    auth.logout()
  }
  </script>
  
  <style>
  .navbar {
    background: #eee;
    padding: 10px;
  }
  .navbar ul {
    display: flex;
    list-style: none;
    gap: 10px;
    margin: 0;
    padding: 0;
  }
  </style>
  