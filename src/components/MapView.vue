<template>
  <div id="map" class="map"></div>
  <p>Zoom: {{ zoom }}</p>
  <p>Latitude: {{ lat }}</p>
  <p>Longitude: {{ lon }}</p>
</template>

<script lang="ts">
import 'ol/ol.css';
import { defineComponent, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { Map, View } from 'ol';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import { fromLonLat, toLonLat } from 'ol/proj';
import { Coordinate } from 'ol/coordinate';

export default defineComponent({
  setup() {
    const route = useRoute();
    const router = useRouter();
    const map = ref<Map | null>(null);
    const lastZoom = ref<number>(parseFloat(route.params.zoom as string) || 10);
    const zoom = ref<number>(10);
    const lat = ref<number>(35.6895);
    const lon = ref<number>(139.6917);

    const updateUrlAndView = (newZoom: number, newCenter: Coordinate) => {
      zoom.value = newZoom;
      lat.value = newCenter[1];
      lon.value = newCenter[0];
      router.replace(`/${newZoom.toFixed(2)}/${newCenter[0].toFixed(5)}/${newCenter[1].toFixed(5)}`);
    };

    onMounted(() => {
      const initialCenter = fromLonLat([
        parseFloat(route.params.lon as string) || lon.value,
        parseFloat(route.params.lat as string) || lat.value
      ]);
      const initialZoom = parseFloat(route.params.zoom as string) || zoom.value;

      map.value = new Map({
        target: 'map',
        layers: [new TileLayer({ source: new OSM() })],
        view: new View({
          center: initialCenter,
          zoom: initialZoom
        })
      });

      map.value.getView().on('change:center', () => {
        const view = map.value!.getView();
        const newCenter = toLonLat(view.getCenter()!);
        updateUrlAndView(view.getZoom()!, newCenter);
      });

      map.value.getView().on('change:resolution', () => {
        const view = map.value!.getView();
        const newCenter = toLonLat(view.getCenter()!);
        updateUrlAndView(view.getZoom()!, newCenter);
      });
    });

    // URLの変更を監視し、地図の状態を更新
    watch(() => [route.params.zoom, route.params.lon, route.params.lat], () => {
      if (map.value) {
        const newCenter = fromLonLat([parseFloat(route.params.lon as string), parseFloat(route.params.lat as string)]);
        const newZoom = parseFloat(route.params.zoom as string);
        map.value.getView().setCenter(newCenter);
        map.value.getView().setZoom(newZoom);
      }
    });

    return { map, zoom, lat, lon };
  }
});
</script>

<style>
.map {
  width: 100%;
  height: 400px;
}
</style>