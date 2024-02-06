<template>
  <h1>Hello Vue 3 + TypeScript + Vite</h1>
  <input v-model.number="offset" type="number" placeholder="Enter a number" />
  <button @click="getPrefCode">Get Pref Code</button>
  <span>{{ prefCode }}</span>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import axios from 'axios';

export default defineComponent({
  name: 'Home',
  setup() {
    const offset = ref(0);
    const prefCode = ref('');

    const getPrefCode = async () => {
      try {
        const response = await axios.get(`/stones/api/getPrefCode?offset=${offset.value}`);
        prefCode.value = response.data.prefCode;
      } catch (error) {
        console.error('API call failed', error);
        prefCode.value = 'Error fetching data';
      }
    };

    return { offset, prefCode, getPrefCode };
  },
});
</script>

<style lang="scss">
h1 {
  color: blue;
}
</style>