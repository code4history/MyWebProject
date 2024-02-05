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
  props: {
    zoom: String, // プロパティとして zoom, lon, lat を受け取る
    lon: String,
    lat: String
  },
  setup(props) {
    const route = useRoute();
    const router = useRouter();
    const map = ref<Map | null>(null);

    const updateUrlAndView = () => {
      const view = map.value!.getView();
      const newCenter = toLonLat(view.getCenter()!);
      const newZoom = view.getZoom()!;
      router.replace(`/${newZoom.toFixed(2)}/${newCenter[0].toFixed(5)}/${newCenter[1].toFixed(5)}`);
    };

    onMounted(() => {
      const initialCenter = fromLonLat([
        parseFloat(route.params.lon as string),
        parseFloat(route.params.lat as string)
      ]);
      const initialZoom = parseFloat(route.params.zoom as string);

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
        updateUrlAndView();
      });

      map.value.getView().on('change:resolution', () => {
        const view = map.value!.getView();
        const newCenter = toLonLat(view.getCenter()!);
        updateUrlAndView();
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

    return { map };
  }
});
</script>

<style>
.map {
  width: 100%;
  height: 400px;
}
</style>