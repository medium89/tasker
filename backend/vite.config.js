import { defineConfig } from 'vite'
import laravel from 'laravel-vite-plugin'

export default defineConfig({
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    hmr: { host: 'localhost', port: 5173, protocol: 'ws' },
  },
  plugins: [
    laravel({
      input: ['resources/js/app.js'],   // стандартно
      refresh: true,
    }),
  ],
})
