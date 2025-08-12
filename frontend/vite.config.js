/* eslint-env node */
/* global process */
import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  // сервис в compose называется `nginx`, его и используем
  const apiUrl = env.VITE_API_URL || 'http://nginx'
  const serverPort = Number(env.VITE_DEV_SERVER_PORT || 5173)
  const hmrHost = env.VITE_HMR_HOST || 'localhost'
  const hmrPort = Number(env.VITE_HMR_PORT || 5173)
  const hmrProtocol = env.VITE_HMR_PROTOCOL || 'ws'

  return {
    plugins: [vue()],
    resolve: {
      alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
    },
    server: {
      host: true,
      port: serverPort,
      strictPort: true,
      hmr: { host: hmrHost, port: hmrPort, protocol: hmrProtocol },
      proxy: {
        '/api': apiUrl, // Laravel контейнер
        '/auth': apiUrl,
        '/logout': apiUrl,
        '/sanctum': apiUrl,
        '/user': apiUrl
      },
      hmr: {
        overlay: true // Показывает красное окно с ошибкой в браузере
      }
    },
  }
})
