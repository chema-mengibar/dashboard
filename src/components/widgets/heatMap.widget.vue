<script lang="ts">

import * as d3 from "d3";
import { PropType, defineComponent } from "vue";

import { TopSongsList, TopSongsEntry } from "../../services/data-service/data-service.types";
import { ConfigHeatMap } from "../../services/widget-service/widget-service.types";

interface Data {
  col: number;
  row: number;
  value: number;
  name: string;
}

export default defineComponent({
  inject: ["$services"],
  name: "heatMapWidget",
  props: {
    id: { required: true, type: String },
    dataSet: { required: true, type: Object as PropType<TopSongsList>, default: [] },
    config: {
      required: true,
      type: Object as PropType<ConfigHeatMap>,
      default: null
    },
  },
  mounted() {

    const groupsCol = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20].map(item => item.toString());
    const groupsRow = [60, 70, 80, 90, 2000].map(item => item.toString());

    const data = this.dataSet
      .map((dataSetItem: TopSongsEntry): Data => {
        // should be number -> typeof dataSetItem[this.config.y];
        return {
          //@ts-ignore
          col: dataSetItem[this.config.colProp as keyof TopSongsEntry].toString(),
          //@ts-ignore
          row: dataSetItem[this.config.rowProp as keyof TopSongsEntry].toString(),
          //@ts-ignore
          value: dataSetItem[this.config.valueProp as keyof TopSongsEntry] as number,
          name: dataSetItem.Name
        };
      });

    const margin = {
      top: 10,
      right: 10,
      bottom: 20,
      left: 35,
    };

    const widgetId = this.id;

    const chartSVG = d3.select(`#${widgetId}`);

    const domEl = document.getElementById(widgetId);

    if (!domEl) {
      return;
    }
    const viewBox = domEl.getAttribute("viewBox");

    if (!viewBox) {
      return;
    }

    const [, , _width, _height] = viewBox.split(" ");
    const width = parseInt(_width, 10);
    const height = parseInt(_height, 10);

    const chart = chartSVG
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    var x = d3.scaleBand()
      .range([0, width - margin.left - margin.right])
      .domain(groupsCol)
      .padding(0.04);

    chart.append("g")
      .attr("class", "grid")
      .attr("transform", `translate(0, ${height - margin.top - margin.bottom})`)
      .call(d3.axisBottom(x))

    var y = d3.scaleBand()
      .range([height - margin.top - margin.bottom, 0])
      .domain(groupsRow)
      .padding(0.04);

    chart.append("g")
      .attr("class", "grid")
      .call(d3.axisLeft(y));


    //@ts-ignore
    const valueMin = Math.min(0, d3.min(data, (d) => d.value)); // negative number as min
    const valueMax = d3.max(data, (d) => d.value);

    const color = this.$services.widgetService.getColorByProp(this.config.valueProp)

    //@ts-ignore
    var myColor = d3.scaleLinear().range(["white", color]).domain([valueMin, valueMax])

    const rects = chart.selectAll()
      //@ts-ignore
      .data(data, function (d) { return d.col + ':' + d.row; })
      .enter()
      .append("rect")
      .attr("data-ref", (d) => d.name)
      //@ts-ignore
      .attr("x", (d) => { return x(d.col) })
      //@ts-ignore
      .attr("y", (d) => { return y(d.row) })
      .attr("width", x.bandwidth())
      .attr("height", y.bandwidth())
      .style("fill", function (d) { return myColor(d.value) })

    rects.append("title")
      .text((d) => d.name)


    rects.on("mouseover", function (d) {

      const collection = [...document.getElementsByClassName("hightlight")]
      if (collection.length > 0) {
        collection.forEach(elm => {
          elm.classList.remove("hightlight");
        })
      }

      const name = d.target.getAttribute('data-ref')
      const samenameItems = document.querySelectorAll(`[data-ref="${name}"]`);
      samenameItems.forEach(elm => {
        elm.classList.add("hightlight");
      })
    })


    rects.on("mouseout", function (d) {
      const collection = [...document.getElementsByClassName("hightlight")]
      if (collection.length > 0) {
        collection.forEach(elm => {
          elm.classList.remove("hightlight");
        })
      }
    })

  },
});
</script>

<template>
  <div :class="$options.name">
    <svg :id="`${id}`" width="100%" height="100%" viewBox="0 0 800 250" />
    <div class="widget_title">{{ config.rowProp }} / {{ config.colProp }} : {{ config.valueProp }}</div>
  </div>
</template>

<style  lang="scss">
@import "../../styles/media";

.heatMapWidget {
  rect {
    cursor: pointer;
    transition: stroke-width 500ms;
  }

  .grid {
    color: rgba(var(--grid-color_rgb), 1);
  }
  .grid path {
    stroke-width: 0;
  }

  .hightlight {
    stroke: var(--app-accent);
    stroke-width: 7px;
    stroke-opacity: 0.5;
  }
}
</style>
