<script lang="ts">

import * as d3 from "d3";
import { PropType, defineComponent } from "vue";

import { TopSongsList, TopSongsEntry } from "../../services/data-service.types";
import { ConfigScatterPlot } from "./widget.types";

interface Data {
  x: number;
  y: number;
  name: string;

}

export default defineComponent({
  inject: ["$services"],
  name: "scatterPlotWidget",
  props: {
    id: { required: true, type: Number },
    dataSet: { required: true, type: Object as PropType<TopSongsList>, default: [] },
    config: {
      required: true,
      type: Object as PropType<ConfigScatterPlot>,
      default: null
    },
  },
  // data: () => ({}),
  mounted() {
    // console.log(this.config.x);
    // console.log(this.config.y);
    // console.log(this.dataSet);

    const data: Data[] = this.dataSet
      .filter((dataSetItem: TopSongsEntry) => dataSetItem.Decade === 60)
      .map((dataSetItem: TopSongsEntry) => {
        // should be number -> typeof dataSetItem[this.config.y];
        return {
          //@ts-ignore
          y: dataSetItem[this.config.y as keyof TopSongsEntry] as number,
          //@ts-ignore
          x: dataSetItem[this.config!.x as keyof TopSongsEntry] as number,
          name: dataSetItem.Name
        };
      });


    const margin = {
      top: 10,
      right: 10,
      bottom: 20,
      left: 35,
    };

    const widgetId = `scatter-plot_${this.id}`;

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

    const x = d3.scaleLinear().range([0, width - margin.left - margin.right]);
    const y = d3.scaleLinear().range([height - margin.top - margin.bottom, 0]);

    const xAxis = chart
      .append("g")
      .attr(
        "transform",
        `translate(0, ${height - margin.top - margin.bottom})`
      );

    const yAxis = chart.append("g");

    const xMax = d3.max(data, (d) => d.x);
    if (xMax) {
      x.domain([0, xMax]);
    }

    const yMax = d3.max(data, (d) => d.y);
    if (yMax) {
      y.domain([0, yMax]);
    }

    xAxis.call(d3.axisBottom(x));
    yAxis.call(d3.axisLeft(y));


    const color = 'var(--button-color-rgb)';

    const dots = chart
      .selectAll(".point")
      .data(data)
      .join("g")
      .attr("class", "point")
      .attr("data-ref", (d) => d.name)
      .attr("transform", (d) => `translate(${x(d.x)}, ${y(d.y)})`)

    dots.append("circle")
      .attr("r", 5)
      .attr("fill", color)

    dots.append("title")
      .text((d) => d.name);

    dots.on("click", function (d) {

      const collection = [...document.getElementsByClassName("hightlight")]
      if (collection.length > 0) {
        collection.forEach(elm => {
          elm.classList.remove("hightlight");
        })
      }

      const name = d.target.parentNode.getAttribute('data-ref')
      const samenameItems = document.querySelectorAll(`[data-ref="${name}"]`);
      samenameItems.forEach(elm => {
        elm.classList.add("hightlight");
      })
    })

  },
  components: {},
});
</script>

<template>
  <div :class="$options.name">
    <svg :id="`scatter-plot_${id}`" width="100%" height="100%" viewBox="0 0 500 500" />
  </div>
</template>

<style  lang="scss" >
// scoped
@import "../../styles/media";

.scatterPlotWidget {
  color: red;

  .hightlight {
    circle {
      fill: green !important;
    }
  }
}
</style>
