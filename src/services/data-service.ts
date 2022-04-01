import { reactive } from 'vue'

import { WidgetRegistryEntry, Widgets } from '../components/widgets/widget.types'
import { TopSongsList, TopSongsEntry } from './data-service.types'
import TopSongsJsonData from './data/top20songs_1970s-2000s.json'

interface Process {
    isLoading: boolean
    boardWidgets: WidgetRegistryEntry[]
}

export default class DataService {

    _data: TopSongsList | null = null

    _process: Process

    constructor() {


        const initialBoardWidgets: WidgetRegistryEntry[] = [
            {
                type: Widgets.scatterPlot,
                config: {
                    x: "Rank",
                    y: "valence",
                },
            },
            {
                type: Widgets.heatmap,
                config: {
                    colProp: "Rank",
                    rowProp: 'Decade',
                    valueProp: "valence",
                },
            },
        ]

        this._process = reactive({
            isLoading: true,
            boardWidgets: initialBoardWidgets
        })
    }

    async fetchData() {

        this._process.isLoading = true;

        await new Promise((resolve) => {
            setTimeout(() => {
                this._data = TopSongsJsonData;
                this._process.isLoading = false;
                resolve(null);
            }, 1000)
        });
    }


    get data() {
        return this._data
    }

    get isLoading() {
        return this._process.isLoading
    }

    get boardWidgets() {
        return this._process.boardWidgets
    }


    get numerableProps(): string[] {
        return [
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

    addWidget(widgetName: Widgets, xname: string, yName: string) {

        let widgetConfig: WidgetRegistryEntry | null = null;

        if (widgetName === Widgets.heatmap) {

            widgetConfig = {
                type: Widgets.heatmap,
                config: {
                    colProp: "Rank",
                    rowProp: 'Decade',
                    valueProp: xname as keyof TopSongsEntry,
                },
            };

        } else if (widgetName === Widgets.scatterPlot) {

            widgetConfig = {
                type: Widgets.scatterPlot,
                config: {
                    x: xname as keyof TopSongsEntry,
                    y: yName as keyof TopSongsEntry,
                },
            };
        }

        console.log(widgetConfig)

        if (widgetConfig) {
            this._process.boardWidgets.push(
                widgetConfig
            )
        }





    }

}