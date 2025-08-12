import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './axios'

// монтируем приложение
createApp(App).use(router).mount('#app')
