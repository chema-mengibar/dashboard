import { TopSongsEntry } from "../../services/data-service.types";

export enum Widgets {
  scatterPlot = 'scatter-plot',
  heatmap = 'heatmap'
}

export interface ConfigScatterPlot {
  x: keyof TopSongsEntry
  y: keyof TopSongsEntry;
}

export interface ConfigHeatMap {
  colProp: keyof TopSongsEntry
  rowProp: keyof TopSongsEntry;
  valueProp: keyof TopSongsEntry;
}

export interface WidgetRegistryEntry {
  type: Widgets
  config: ConfigScatterPlot | ConfigHeatMap
}

