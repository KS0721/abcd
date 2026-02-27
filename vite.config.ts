import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'

// 빌드 시 sw.js의 CACHE_NAME을 자동 갱신하는 플러그인
// → 브라우저가 새 SW를 감지 → 구 캐시 삭제 → 자동 새로고침
function swVersionPlugin(): Plugin {
  return {
    name: 'sw-version',
    writeBundle() {
      const swPath = path.resolve(__dirname, 'dist/sw.js')
      if (!fs.existsSync(swPath)) return
      let content = fs.readFileSync(swPath, 'utf-8')
      const version = `aac-${Date.now()}`
      content = content.replace(/const CACHE_NAME = '.*?'/, `const CACHE_NAME = '${version}'`)
      fs.writeFileSync(swPath, content)
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), swVersionPlugin()],
  base: '/abcd/',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 8000,
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'zustand'],
          capacitor: [
            '@capacitor/core',
            '@capacitor/haptics',
            '@capacitor/preferences',
            '@capacitor/splash-screen',
          ],
        },
      },
    },
  },
})
