<script lang="ts">

import * as d3 from "d3";
import { PropType, defineComponent } from "vue";
import { TopSongsList, TopSongsEntry } from "../../services/data-service/data-service.types";
import { ConfigScatterPlot } from "../../services/widget-service/widget-service.types";

interface Data {
  x: number;
  y: number;
  name: string;
  group: string
}

type Found = Element | null

export default defineComponent({
  inject: ["$services"],
  name: "scatterPlotWidget",
  props: {
    id: { required: true, type: String },
    dataSet: { required: true, type: Object as PropType<TopSongsList>, default: [] },
    config: {
      required: true,
      type: Object as PropType<ConfigScatterPlot>,
      default: null
    },
  },
  methods: {
    selectSame(name: string) {
      const samenameItems = document.querySelectorAll(`[data-ref="${name}"]`);
      samenameItems.forEach(elm => {
        elm.classList.add("hightlight");
      })
    },
    deselectAll() {
      const collection = [...document.getElementsByClassName("hightlight")]
      if (collection.length > 0) {
        collection.forEach(elm => {
          elm.classList.remove("hightlight");
        })
      }
    }
  },
  mounted() {
    const _ = this;
    const data: Data[] = this.dataSet
      //.filter((dataSetItem: TopSongsEntry, index: number ) => index >= 10 && index < 12)
      .map((dataSetItem: TopSongsEntry) => {
        return {
          //@ts-ignore
          y: dataSetItem[this.config.y as keyof TopSongsEntry] as number,
          //@ts-ignore
          x: dataSetItem[this.config!.x as keyof TopSongsEntry] as number,
          name: dataSetItem.Name,
          group: dataSetItem.Decade.toString()
        };
      });

    const margin = {
      top: 10,
      right: 20,
      bottom: 20,
      left: 40,
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

    // get client width, to modify viewBox -> domEl.clientWidth
    const width = parseInt(_width, 10);

    const height = parseInt(_height, 10);

    // domEl.setAttribute('viewBox', `0 0 ${width} ${_height}`)

    const chart = chartSVG
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    const x = d3.scaleLinear().range([0, width - margin.left - margin.right]);
    const y = d3.scaleLinear().range([height - margin.top - margin.bottom, 0]);

    const xMax = d3.max(data, (d) => d.x);
    if (xMax) {
      x.domain([0, xMax]);
    }

    const yMax = d3.max(data, (d) => d.y)

    let yDomain

    if (yMax) {
      yDomain = y.domain([0, yMax]);
    }

    chart
      .append("g")
      .attr("class", "grid")
      .attr(
        "transform",
        `translate(0, ${height - margin.top - margin.bottom})`
      )
      //@ts-ignore
      .call(d3.axisBottom(x).ticks().tickSize(-height).tickFormat(""));

    chart.append("g")
      .attr("class", "grid")
      //@ts-ignore
      .call(d3.axisLeft(y).ticks().tickSize(-width + margin.left + margin.right).tickFormat(""));

    chart
      .append("g")
      .attr("class", "axis")
      .attr(
        "transform",
        `translate(0, ${height - margin.top - margin.bottom})`
      ).call(d3.axisBottom(x));

    chart
      .append("g")
      .attr("class", "axis")
      .call(d3.axisLeft(y));

    const dots = chart
      .selectAll(".point")
      .data(data)
      .join("g")
      .attr("class", "point")
      .attr("data-ref", (d) => d.name)
      .attr("data-x", (d) => d.x)
      .attr("data-y", (d) => d.y)
      .attr("transform", (d) => `translate(${x(d.x)}, ${y(d.y)})`)

    dots.append("circle")
      //.attr('fill', this.$services.widgetService.getColorByProp( this.config.y ))
      .attr('fill', (d) => this.$services.widgetService.getColorByProp(d.group))
      .attr('fill-opacity', 0.70)
      .attr('attr-g', (d) => d.group)
      .attr("r", 5);

    dots.append("title")
      .text((d) => d.name);

    const points = [...domEl.querySelectorAll(".point")];

    chartSVG.on("mousemove", (event) => {

      const [x, y] = d3.pointer(event)

      const found: Found[] = []
      found.length = 0;

      points.forEach(point => {

        //@ts-ignore
        const pX = point.transform.baseVal.consolidate().matrix.e + margin.left
        //@ts-ignore
        const pY = point.transform.baseVal.consolidate().matrix.f + margin.top

        const lim0 = pX < (x + 40) && pX >= x && pY < (y + 40) && pY >= y;
        const lim1 = pX < (x + 40) && pX >= x && pY > (y - 40) && pY <= y;
        const lim2 = pX > (x - 40) && pX <= x && pY > (y - 40) && pY <= y;
        const lim3 = pX > (x - 40) && pX <= x && pY < (y + 40) && pY >= y;

        if (lim0 || lim1 || lim2 || lim3) {
          found.push(point)
        }
        else {
          point.classList.remove("hightlight");
          _.deselectAll()
        }

      })

      if (found.length > 0) {
        found.forEach((foundItem: Found) => {
          if (foundItem) {

            const name = foundItem.getAttribute('data-ref')
            if (name) {
              _.selectSame(name)
            }
            if (!foundItem.classList.contains('hightlight')) {
              foundItem.classList.add("hightlight");
            }
          }
        })
      }
    })

    dots.on("mouseover", function (d) {
      _.deselectAll()
      const name = d.target.parentNode.getAttribute('data-ref')
      _.selectSame(name)
    })

    dots.on("mouseout", function () {
      _.deselectAll()
    })

  },
});
</script>

<template>
  <div :class="$options.name">
    <svg :id="id" width="100%" height="100%" viewBox="0 0 800 250" />
    <div class="widget_title">{{ config.y }} / {{ config.x }}</div>
  </div>
</template>

<style  lang="scss" >
@import "../../styles/media";

.scatterPlotWidget {
  color: var(--grid-color);

  circle {
    cursor: pointer;
    transition: stroke-width 500ms;
  }

  .hightlight {
    circle {
      stroke: var(--app-accent);
      stroke-width: 12px;
      stroke-opacity: 0.5;
      paint-order: stroke;
      fill-opacity: 1;
    }
  }

  .grid line {
    stroke: rgba(var(--grid-color_rgb), 0.3);
    stroke-opacity: 0.7;
    shape-rendering: crispEdges;
  }

  .grid path {
    stroke-width: 0;
  }
}
</style>
