import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

/**
 * 编辑器 Vite 配置
 *
 * 架构说明：
 * 编辑器画布使用 apps/editor/src/previews/ 中的纯 HTML/CSS 预览组件，
 * 不依赖 Taro 的 Stencil Web Components 运行时，避免一系列兼容性问题。
 * Taro 组件只在小程序端 (apps/mobile) 使用。
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
});
