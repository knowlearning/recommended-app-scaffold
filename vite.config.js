import { defineConfig } from 'vite'
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    port: 6161,
  },
  build: {
    target: 'esnext'
  },
  plugins: [
    basicSsl()
  ]
})
