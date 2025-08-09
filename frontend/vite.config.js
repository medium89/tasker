import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  server: {
    host: true,          // слушаем 0.0.0.0 внутри контейнера
    port: 5173,
    strictPort: true,
    hmr: {
      host: 'localhost', // так твой браузер достучится
      port: 5173,
      protocol: 'ws',
    },
    proxy: {
      // ИДЁМ НЕ НА localhost, а на имя сервиса из docker-compose: nginx (порт 80)
      '/sanctum':  { target: 'http://nginx', changeOrigin: true },
      '/login':    { target: 'http://nginx', changeOrigin: true },
      '/logout':   { target: 'http://nginx', changeOrigin: true },
      '/register': { target: 'http://nginx', changeOrigin: true },
      '/user':     { target: 'http://nginx', changeOrigin: true },
      '/api':      { target: 'http://nginx', changeOrigin: true },
    },
  },
})
