import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), nodePolyfills()],
  base: '/ton-react/',
  optimizeDeps: {
    exclude: ['vite.svg'], // исключаем vite.svg
    include: ['icon.png'] // добавляем newFile.svg
  }
});
