<script  lang="ts">
import { WidgetRegistryEntry } from '../services/widget-service/widget-service.types'
import { defineComponent } from 'vue'

interface ComponentData {
  widgets: WidgetRegistryEntry[]
}

export default defineComponent({
  name: "Home",
  inject: ["$services"],
  methods: {},
  created() {
    // Nothing to do
  },
});
</script>

<style  lang="scss">
@import "../styles/media";
</style>

<template>
  <div class="block_board">
    <div class="board-content"></div>
  </div>
</template>