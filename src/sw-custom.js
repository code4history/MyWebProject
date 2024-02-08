// src/sw-custom.js
import { precacheAndRoute } from 'workbox-precaching';
import { registerRoute } from 'workbox-routing';
import { StaleWhileRevalidate } from 'workbox-strategies';

// workbox-precachingによるプリキャッシュの設定
precacheAndRoute(self.__WB_MANIFEST);

// 独自のキャッシュ戦略を使用する例
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/'),
  new StaleWhileRevalidate({
    cacheName: 'api-cache',
  })
);

// ここに他の独自ロジックを追加