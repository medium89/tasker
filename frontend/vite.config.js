/* eslint-env node */
/* global process */
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiUrl = env.VITE_API_URL || 'http://nginx'
  const serverPort = Number(env.VITE_DEV_SERVER_PORT || 5173)
  const hmrHost = env.VITE_HMR_HOST || 'localhost'
  const hmrPort = Number(env.VITE_HMR_PORT || 5173)
  const hmrProtocol = env.VITE_HMR_PROTOCOL || 'ws'

  return {
    plugins: [vue()],
    server: {
      host: true, // слушаем 0.0.0.0 внутри контейнера
      port: serverPort,
      strictPort: true,
      hmr: {
        host: hmrHost, // так твой браузер достучится
        port: hmrPort,
        protocol: hmrProtocol,
      },
      proxy: {
        // ИДЁМ НЕ НА localhost, а на имя сервиса из docker-compose: nginx (порт 80)
        '/sanctum': { target: apiUrl, changeOrigin: true },
        '/login': { target: apiUrl, changeOrigin: true },
        '/logout': { target: apiUrl, changeOrigin: true },
        '/register': { target: apiUrl, changeOrigin: true },
        '/user': { target: apiUrl, changeOrigin: true },
        '/api': { target: apiUrl, changeOrigin: true },
      },
    },
  }
})
