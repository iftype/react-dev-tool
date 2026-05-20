import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './',   // relative paths → works on GitHub Pages sub-directories

  resolve: {
    alias: {
      // 프로덕션 빌드에서도 React DevTools Profiler가 작동하도록
      // react-dom/profiling 빌드를 사용 (크기가 약간 크지만 프로파일링 지원)
      'react-dom$': 'react-dom/profiling',
    },
  },
})
