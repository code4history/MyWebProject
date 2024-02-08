import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import envCompatible from 'vite-plugin-env-compatible';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: "./",
  plugins: [
    vue(),
    envCompatible(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png', 'masked-icon.svg'],
      injectRegister: 'auto',
      srcDir: 'src',
      filename: 'sw-custom.js', // カスタムService Workerファイル名
      strategies: 'injectManifest', // injectManifestモードを使用
      manifest: {
        // ここにmanifest.jsonの内容を配置
        name: 'My PWA App',
        short_name: 'PWA App',
        start_url: '.',
        display: 'standalone',
        theme_color: '#ffffff',
        background_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          // 他のアイコン設定...
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            // APIのエンドポイントなど、動的にデータを取得するURLのキャッシュ戦略
            urlPattern: /^https:\/\/api\.example\.com/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24, // 1日
              },
            },
          },
          {
            // Google Fontsなどの外部リソースのキャッシュ戦略
            urlPattern: /^https:\/\/fonts\.googleapis\.com/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-stylesheets',
              expiration: {
                maxEntries: 20,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1年
              },
            },
          },
        ]
      }
    })
  ],
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