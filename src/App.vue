<template>
  <div>
    <header class="header">
      <h1>ページタイトル</h1>
      <div class="hamburger-menu" @click="toggleMenu">☰</div>
      <div class="menu-items" :class="{ show: menuVisible }">
        <router-link to="/stones/">トップページ</router-link>
        <router-link to="/stones/map/17/139.6917/35.6895">地図ページ</router-link>
        <router-link to="/stones/watch">WebSocketページ</router-link>
      </div>
    </header>
    <router-view/>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';

export default defineComponent({
  setup() {
    const menuVisible = ref(false);

    function toggleMenu() {
      menuVisible.value = !menuVisible.value;
    }

    return { menuVisible, toggleMenu };
  }
});
</script>

<style lang="scss">
</style>