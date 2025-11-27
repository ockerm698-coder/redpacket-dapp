import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // 优化构建输出，适合Cloudflare Pages
    outDir: 'dist',
    sourcemap: false,
    rollupOptions: {
      output: {
        manualChunks: {
          // 将大型依赖分离成单独的chunk
          vendor: ['react', 'react-dom'],
          wagmi: ['wagmi', 'viem', '@tanstack/react-query'],
          rainbow: ['@rainbow-me/rainbowkit'],
        },
      },
    },
  },
  // 为了兼容性，使用现代浏览器特性
  optimizeDeps: {
    esbuildOptions: {
      target: 'es2020',
    },
  },
})
