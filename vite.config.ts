import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import envCompatible from 'vite-plugin-env-compatible';

export default defineConfig({
  base: "./",
  plugins: [vue(), envCompatible()],
  resolve: {
    alias: {
      vue: 'vue/dist/vue.esm-bundler.js',
    },
  },
  server: {
    proxy: {
      // APIリクエスト用のプロキシ設定
      '/stones/api': {
        target: 'http://localhost:3000', // Expressサーバーのアドレス
        changeOrigin: true,
        secure: false,
      }
    }
  }
});