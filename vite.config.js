import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    AutoImport({
      resolvers: [ElementPlusResolver()]
    }),
    Components({
      resolvers: [ElementPlusResolver()]
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      '/hx': {
        target: 'http://40.73.36.45',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/hx/, '')
      },
      '/fl': {
        target: 'http://47.101.133.246:8089',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/fl/, '')
      }
    }
  }
})
