import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import MapView from '../components/MapView.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/:zoom/:lon/:lat',
    name: 'MapView',
    component: MapView,
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

export default router;