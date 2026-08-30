// import { fileURLToPath, URL } from 'node:url'
// import vue from '@vitejs/plugin-vue'
// import { defineConfig } from 'vite'

// export default defineConfig({
//   plugins: [vue()],
//   resolve: {
//     alias: {
//       '@': fileURLToPath(new URL('./src', import.meta.url))
//     }
//   },
//   css: {
//     postcss: './postcss.config.js'
//   }
// })

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },

  server: {
    port: 5173,

    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },

      '/uploads': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
})