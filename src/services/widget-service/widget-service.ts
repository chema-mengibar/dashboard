
import { reactive } from 'vue'

import { TopSongsEntry } from '../data-service/data-service.types'
import { WidgetRegistryEntry, Widgets, WidgetOptions } from './widget-service.types'

interface Config {
  boardWidgets: WidgetRegistryEntry[]
}

interface Palette {
  [key: string]: string
}

export default class WidgetService {

  _config: Config

  palette: Palette

  constructor() {

    const initialBoardWidgets: WidgetRegistryEntry[] = [
      {
        type: Widgets.scatterPlot,
        config: {
          x: "Rank",
          y: "key",
        },
        id: 'initial-01'
      },
      {
        type: Widgets.heatmap,
        config: {
          colProp: "Rank",
          rowProp: 'Decade',
          valueProp: "danceability",
        },
        id: 'initial-02'
      },
    ]

    // const d3Palette = d3.schemeSet3
    const customPalette = [
      '#1F77B4', '#FF7F0E', '#2CA02C', '#D62728', '#9467BD',
      '#8C564B', '#E377C2', '#7F7F7F', '#BCBD22', '#17BECF',
      '#FF9896', '#C49C94', '#0CC582'
    ]

    this.palette = {
      'Rank': customPalette[0],
      'danceability': customPalette[1],
      'energy': customPalette[2],
      'key': customPalette[3],
      'loudness': customPalette[4],
      'speechiness': customPalette[5],
      'acousticness': customPalette[6],
      'instrumentalness': customPalette[7],
      'liveness': customPalette[8],
      'valence': customPalette[9],
      'tempo': customPalette[10],
      'duration_ms': customPalette[11],
      'time_signature': customPalette[12],

      '60': customPalette[0],
      '70': customPalette[1],
      '80': customPalette[2],
      '90': customPalette[3],
      '2000': customPalette[4],
    }

    this._config = reactive({
      isLoading: true,
      boardWidgets: initialBoardWidgets
    })

  }

  get boardWidgets() {
    return this._config.boardWidgets
  }


  get numerableProps(): string[] {
    return [
      'Rank',
      'danceability',
      'energy',
      'key',
      'loudness',
      'speechiness',
      'acousticness',
      'instrumentalness',
      'liveness',
      'valence',
      'tempo',
      'duration_ms',
      'time_signature',
    ]
  }

  get numerableOptions() {
    return this.numerableProps.map((prop: string) => ({
      label: prop,
      value: prop,
    }))
  }

  get widgetOptions() {
    return [
      {
        label: 'Scatter Plot',
        value: Widgets.scatterPlot,
      },
      {
        label: 'Heat Map',
        value: Widgets.heatmap,
      }
    ]
  }

  getColorByProp(propName: string) {
    return this.palette[propName]
  }

  get decadeLegends() {
    return [
      {
        label: '60',
        color: this.palette['60']
      },
      {
        label: '70',
        color: this.palette['70']
      },
      {
        label: '80',
        color: this.palette['80']
      },
      {
        label: '90',
        color: this.palette['90']
      },
      {
        label: '2000',
        color: this.palette['2000']
      }
    ]
  }


  removeWidgetById(widgetId: string) {

    const domEl = document.getElementById(widgetId);

    if (domEl && domEl.parentElement && domEl.parentElement.parentElement) {

      domEl.parentElement.parentElement.classList.add('removed');

      setTimeout(() => {
        const filtered = this._config.boardWidgets.filter(item => item.id !== widgetId)
        this._config.boardWidgets = [...filtered]
      }, 600)
    }
  }

  addWidget(
    widgetName: Widgets | null,
    options: WidgetOptions,
  ) {

    let widgetConfig: WidgetRegistryEntry | null = null;

    if (widgetName === Widgets.heatmap && options.valueProp) {

      widgetConfig = {
        type: Widgets.heatmap,
        config: {
          colProp: 'Rank',
          rowProp: 'Decade',
          valueProp: options.valueProp as keyof TopSongsEntry,
        },
        id: `widget-${Date.now()}`
      };

    } else if (widgetName === Widgets.scatterPlot && options.x && options.y) {

      widgetConfig = {
        type: Widgets.scatterPlot,
        config: {
          x: options.x as keyof TopSongsEntry,
          y: options.y as keyof TopSongsEntry,
        },
        id: `widget-${Date.now()}`
      };
    }

    if (widgetConfig) {
      this._config.boardWidgets.push(widgetConfig)
    }
  }
}