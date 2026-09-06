import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  base: '/shop-web/',
  plugins: [
    vue(),
    vueDevTools(),
  ],
  build: {
    rolldownOptions: {
      output: {
        /**
         * 修复 Rolldown 循环 chunk 引用未初始化绑定导致的 "X is not a function"。
         * 将 Vue 生态 + Element Plus 及其图标打包进同一 vendor chunk，打破 index.js 与
         * _plugin-vue_export-helper(icons) 之间的循环依赖。
         */
        codeSplitting: {
          groups: [
            {
              name: 'vue-vendor',
              test: /[\\/]node_modules[\\/](@vue|vue|vue-router|pinia|element-plus|@element-plus)[\\/]/,
            },
          ],
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
