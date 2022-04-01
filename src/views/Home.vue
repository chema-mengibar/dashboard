<script  lang="ts">
import { WidgetRegistryEntry, Widgets } from '../components/widgets/widget.types'
import { defineComponent } from 'vue'

interface ComponentData {
  widgets: WidgetRegistryEntry[]
}

export default defineComponent({
  name: "Home",
  inject: ["$services"],
  // data: (): ComponentData  => ({

  // }),
  methods: {},
  created() {
    // Nothing to do
  },
  mounted() {


  },
  components: {

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