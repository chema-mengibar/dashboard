<script  lang="ts">
import ScatterPlotWidget from "../components/widgets/scatterPlot.widget.vue";
import HeatMapWidget from "../components/widgets/heatMap.widget.vue";
import { WidgetRegistryEntry, Widgets } from '../components/widgets/widget.types'
import { defineComponent } from 'vue'

interface ComponentData {
  selectedXProp: string | null,
  selectedYProp: string | null,
  selectedWidgetType: Widgets | null
}

export default defineComponent({
  name: "Home",
  inject: ["$services"],
  data: (): ComponentData => ({
    selectedXProp: null,
    selectedYProp: null,
    selectedWidgetType: null
  }),
  methods: {
    addWidget() {
      this.$services.dataService.addWidget(this.selectedWidgetType, this.selectedXProp, this.selectedYProp)
    }
  },
  created() {
    // Nothing to do
  },
  mounted() {

    this.$services.dataService.fetchData().then(() => {
      // Loaded
    });
  },
  components: {
    'scatter-plot': ScatterPlotWidget,
    'heatmap': HeatMapWidget,
  },
});
</script>

<style  lang="scss">
@import "../styles/media";

.widgets-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.widget {
  width: calc(30% - 10px);
  border: 1px solid grey;
}

fieldset {
  width: 100%;
  display: flex;
  flex-direction: column;

  label {
    margin-bottom: 7px;
  }
}

.block_secondary-menu {
  fieldset + fieldset, fieldset + .main-button {
    margin-top: 20px;
  }
}

.main-button{
    background-color:var(--app-accent);
    width:220px;
    height:50px;
    display:flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: var(--button-text-color);
    font-family: var(--font-hl);
    font-size: 16px;
  }


</style>

<template>
  <div class="block_secondary-menu">
    <!-- widget type -->
    <fieldset>
      <label>Widget type</label>
      <select v-model="selectedWidgetType">
        <option
          v-bind:key="option.label"
          v-for="(option, index) in $services.dataService.widgetOptions"
          v-bind:value="option.value"
          :selected="index === 0"
        >{{ option.label }}</option>
      </select>
    </fieldset>

    <!-- axis x property -->
    <fieldset>
      <label>X property</label>
      <select v-model="selectedXProp">
        <option
          v-bind:key="option.label"
          v-for="(option, index) in $services.dataService.numerableOptions"
          v-bind:value="option.value"
          :selected="index === 0"
        >{{ option.label }}</option>
      </select>
    </fieldset>
    <!-- axis y property -->
    <fieldset>
      <label>Y property</label>
      <select v-model="selectedYProp">
        <option
          v-bind:key="option.label"
          v-for="(option, index) in $services.dataService.numerableOptions"
          v-bind:value="option.value"
          :selected="index === 0"
        >{{ option.label }}</option>
      </select>
    </fieldset>
    <!-- Button add -->
    <button class="main-button" @click="addWidget()">Add Widget</button>
  </div>
  <div class="block_board">
    <div class="board-content">
      <div v-if="$services.dataService.isLoading">loading ...</div>

      <div class="widgets-container" v-if="!$services.dataService.isLoading">
        <!-- widget plot -->
        <div
          class="widget"
          v-for="(widget, index) in $services.dataService.boardWidgets"
          :key="index"
        >
          <component
            :is="widget.type"
            :config="widget.config"
            :id="index"
            :dataSet="$services.dataService.data"
          ></component>
        </div>
      </div>
    </div>
  </div>
</template>