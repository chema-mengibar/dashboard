<script lang="ts">

import * as d3 from "d3";
import { PropType, defineComponent } from "vue";

import { TopSongsList, TopSongsEntry } from "../../services/data-service.types";
import { ConfigHeatMap } from "./widget.types";


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
    id: { required: true, type: Number },
    dataSet: { required: true, type: Object as PropType<TopSongsList>, default: [] },
    config: {
      required: true,
      type: Object as PropType<ConfigHeatMap>,
      default: null
    },
  },
  // data: () => ({}),
  mounted() {
    // console.log(this.config.colProp);
    // console.log(this.config.rowProp);
    // console.log(this.config.valueProp);
    // console.log(this.dataSet);


    const groupsCol = [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20].map( item => item.toString());
    const groupsRow = [60,70,80,90, 2000].map( item => item.toString());


    const data = this.dataSet
      .map((dataSetItem: TopSongsEntry): Data => {
        // should be number -> typeof dataSetItem[this.config.y];
        return {
          //@ts-ignore
          col: dataSetItem[this.config.colProp as keyof TopSongsEntry ].toString(),
          //@ts-ignore
          row: dataSetItem[this.config.rowProp as keyof TopSongsEntry ].toString(),
          //@ts-ignore
          value: dataSetItem[this.config.valueProp as keyof TopSongsEntry ] as number,
          name: dataSetItem.Name
        };
      });

      console.log(data)

    const margin = {
      top: 10,
      right: 10,
      bottom: 20,
      left: 35,
    };


    const widgetId = `heatmap_${this.id}`;

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
      .range([0, width- margin.left - margin.right])
      .domain(groupsCol)
      .padding(0.04);

    chart.append("g")
      .attr("transform", `translate(0, ${height  - margin.top - margin.bottom})`)
      .call(d3.axisBottom(x))

    var y = d3.scaleBand()
      .range([height  - margin.top - margin.bottom, 0])
      .domain(groupsRow)
      .padding(0.04);

    chart.append("g")
      .call(d3.axisLeft(y));

    
    const valueMin = Math.min(0, d3.min(data, (d) => d.value)); // negative number as min
    const valueMax = d3.max(data, (d) => d.value);


    const color = getComputedStyle(document.body).getPropertyValue('--app-accent');;

    var myColor = d3.scaleLinear()
      .range(["white", color])
      .domain([valueMin, valueMax])

    const rects = chart.selectAll()
      .data(data, function (d) { return d.col + ':' + d.row; })
      .enter()
      .append("rect")
      .attr("data-ref", (d) => d.name)
      .attr("x", (d) => { return x(d.col) })
      .attr("y", (d) => { return y(d.row) })
      .attr("width", x.bandwidth())
      .attr("height", y.bandwidth())
      .style("fill", function (d) { return myColor(d.value) })
      
      rects.append("title")
      .text((d) =>  d.name)


     rects.on("click", function (d) {

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


  },
  components: {},
});
</script>

<template>
  <div :class="$options.name">
    <svg :id="`heatmap_${id}`" width="100%" height="100%" viewBox="0 0 500 500" />
  </div>
</template>

<style  lang="scss">
@import "../../styles/media";

.heatMapWidget {
  color: red;


  .hightlight{
    fill: green !important;
  }

}
</style>
