import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './axios'
import './main.css'

// монтируем приложение
createApp(App).use(router).mount('#app')
