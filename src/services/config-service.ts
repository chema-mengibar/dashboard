import { reactive } from 'vue'

interface Config {
    locale:string
}

export default class ConfigService {

    _config: Config

    constructor() {

        this._config = reactive({
            locale: 'en',
        }) 
    }

    get config(): Config {
        return this._config
    }

}