<script  lang="ts">
import { defineComponent } from 'vue'
import ScatterPlotWidget from "../components/widgets/scatterPlot.widget.vue";
import HeatMapWidget from "../components/widgets/heatMap.widget.vue";
import { Widgets, WidgetOptions } from '../services/widget-service/widget-service.types'

interface ComponentData {
  selectedWidgetOptions: WidgetOptions
  selectedWidgetType: Widgets | null
}

export default defineComponent({
  name: "Home",
  inject: ["$services"],
  data: (): ComponentData => ({
    selectedWidgetOptions: {
      x: null,
      y: null,
      valueProp: null,
    },
    selectedWidgetType: null,
  }),
  methods: {
    addWidget() {
      this.$services.widgetService.addWidget(this.selectedWidgetType, this.selectedWidgetOptions)
    }
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


<template>
  <div class="block_secondary-menu">
    <!-- widget type -->
    <fieldset>
      <label>Widget type</label>
      <select v-model="selectedWidgetType">
        <option
          v-bind:key="option.label"
          v-for="(option, index) in $services.widgetService.widgetOptions"
          v-bind:value="option.value"
          :selected="index === 0"
        >{{ option.label }}</option>
      </select>
    </fieldset>

    <fieldset v-if="selectedWidgetType === 'scatter-plot'">
      <!-- axis x property -->
      <label>X property</label>
      <select v-model="selectedWidgetOptions.x">
        <option
          v-bind:key="option.label"
          v-for="(option, index) in $services.widgetService.numerableOptions"
          v-bind:value="option.value"
          :selected="index === 0"
        >{{ option.label }}</option>
      </select>

      <!-- axis y property -->
      <label>Y property</label>
      <select v-model="selectedWidgetOptions.y">
        <option
          v-bind:key="option.label"
          v-for="(option, index) in $services.widgetService.numerableOptions"
          v-bind:value="option.value"
          :selected="index === 0"
        >{{ option.label }}</option>
      </select>
    </fieldset>

    <fieldset v-if="selectedWidgetType === 'heatmap'">
      <!-- axis x property -->
      <label>X property</label>
      <select v-model="selectedWidgetOptions.valueProp">
        <option
          v-bind:key="option.label"
          v-for="(option, index) in $services.widgetService.numerableOptions"
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
      <div class="board-content_header">
        <div v-if="$services.dataService.isLoading">loading ...</div>
        <div v-if="!$services.dataService.isLoading">
          <div class="header-legend">
            <div class="decade-legend-title">DECADES:</div>
            <div
              class="decade-legend"
              v-for="(decadeItem, index) in $services.widgetService.decadeLegends"
              :key="index"
            >
              <div class="decade-dot" :style="{ backgroundColor: decadeItem.color }"></div>
              {{ decadeItem.label }}
            </div>
          </div>
        </div>
      </div>

      <div class="widgets-container" v-if="!$services.dataService.isLoading">
        <!-- widget plot -->
        <div
          class="widget"
          v-for="(widget ) in $services.widgetService.boardWidgets"
          :key="widget.id"
        >
          <component
            :is="widget.type"
            :config="widget.config"
            :id="widget.id"
            :dataSet="$services.dataService.data"
          ></component>

          <div
            v-on:click="() => {
              $services.widgetService.removeWidgetById(widget.id)
            }"
            class="button-remove"
          >x</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style  lang="scss">
@import "../styles/media";

.widgets-container {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
}

.widget {
  padding: 10px;
  background-color: var(--app-color);
  box-shadow: -5px 0px 11px -7px rgba(0, 0, 0, 0.1);
  border-radius: 4px;
  flex:1;
  min-width: calc(50% - 10px);
  position: relative;

  transition: opacity 500ms;

  &.removed {
    opacity: 0;
  }

  .button-remove {
    position: absolute;
    width: 20px;
    height: 20px;
    right: 0;
    bottom: 0;
    text-align: center;
    line-height: 20px;
    cursor: pointer;
    opacity: 0.2;
    transition: all 350ms;

    &:hover {
      background-color: var(--app-accent);
      border-radius: 15px;
      width: 30px;
      height: 30px;
      color: var(--button-text-color);
      bottom: -7px;
      right: -7px;
      line-height: 25px;
      border: 2px solid var(--app-color);
      opacity: 1;
    }
  }
}

fieldset {
  width: 100%;
  display: flex;
  flex-direction: column;

  label {
    margin-bottom: 7px;
  }

  select + label{
    margin-top:20px;
  }
}

.header-legend {
  display: flex;

  .decade-legend-title {
    margin-right: 10px;
  }
  .decade-legend {
    display: flex;
    margin-right: 30px;
    align-items: center;

    .decade-dot {
      margin-right: 2px;
      width: 10px;
      height: 10px;
      border-radius: 10px;
    }
  }
}

.block_secondary-menu {
  fieldset + fieldset,
  fieldset + .main-button {
    margin-top: 20px;
  }
}

.main-button {
  background-color: var(--app-accent);
  width: 160px;
  height: 35px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: var(--button-text-color);
  font-family: var(--font-hl);
  font-size: 14px;
  border-radius: 4px;
}
</style>