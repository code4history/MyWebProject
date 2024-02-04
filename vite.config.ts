import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import envCompatible from 'vite-plugin-env-compatible';

export default defineConfig({
  plugins: [vue(), envCompatible()],
  resolve: {
    alias: {
      vue: 'vue/dist/vue.esm-bundler.js',
    },
  },
  server: {
    proxy: {
      // APIリクエスト用のプロキシ設定
      '/api': {
        target: 'http://localhost:5174', // Expressサーバーのアドレス
        changeOrigin: true,
        secure: false,
      }
    }
  }
});