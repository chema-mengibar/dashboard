import { reactive } from 'vue'

import { TopSongsList } from './data-service.types'
import TopSongsJsonData from './data/top20songs_1970s-2000s.json'

interface Process {
    isLoading: boolean
}

export default class DataService {

    _data: TopSongsList | null = null

    _process: Process

    constructor() {

        this._process = reactive({
            isLoading: true,

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

}