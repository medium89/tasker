import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

// ВАЖНО: берём относительный путь и явное расширение
import { auth } from './auth.js'

const app = createApp(App)
app.use(createPinia())
app.use(router)

// подтягиваем пользователя, чтобы бейдж сразу знал статус
auth.fetchUser()

app.mount('#app')
