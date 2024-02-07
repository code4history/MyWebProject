<template>
  <div>
    <input v-model="seconds" placeholder="秒数を入力" type="number" />
    <button @click="sendSeconds">開始</button>
    <p>{{ message }}</p>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  setup() {
    const seconds = ref('');
    const message = ref('');
    const ws = new WebSocket('ws://localhost:3000');

    ws.onmessage = (event) => {
      message.value = event.data;
    };

    function sendSeconds() {
      if (seconds.value) {
        ws.send(seconds.value);
        seconds.value = ''; // メッセージ送信後は入力をクリア
      }
    }

    return { seconds, message, sendSeconds };
  },
};
</script>