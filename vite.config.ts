import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: 'index.ts',
      name: 'Vue3Plotly',
      fileName: () => 'index.js'
    },
    rollupOptions: {
      external: ['vue', 'plotly.js-dist-min'],
      output: {
        globals: {
          vue: 'Vue',
          'plotly.js-dist-min': 'Plotly'
        }   
      }
    }
  },
})
