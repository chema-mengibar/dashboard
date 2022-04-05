import { TopSongsEntry } from "../data-service/data-service.types";

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
  id: string
}


export interface OptionsScatterPlot {
  x: keyof TopSongsEntry | null
  y: keyof TopSongsEntry | null
}


export interface OptionsHeatMap {
  valueProp: keyof TopSongsEntry | null
}


export type WidgetOptions = OptionsScatterPlot & OptionsHeatMap 