import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'

// глобальная настройка axios для Sanctum
axios.defaults.withCredentials = true
axios.defaults.baseURL = 'http://localhost:8080'

// монтируем приложение
createApp(App).use(router).mount('#app')
