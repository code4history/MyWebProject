import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import MapView from '../components/MapView.vue';
import Home from '../components/Home.vue'; // ルートページ用のコンポーネント
import NotFound from '../components/NotFound.vue'; // 404ページ用のコンポーネント
import Watch from '../components/Watch.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/stones/',
    name: 'Home',
    component: Home, // ルート（ホーム）ページのコンポーネント
  },
  {
    path: '/stones/map/:zoom/:lon/:lat',
    name: 'MapView',
    component: MapView,
    props: true,
  },
  {
    path: '/:pathMatch(.*)*', // すべての未定義パスにマッチするキャッチオールルート
    name: 'NotFound',
    component: NotFound, // 404ページのコンポーネント
  },
  {
    path: '/stones/watch',
    name: 'Watch',
    component: Watch,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;