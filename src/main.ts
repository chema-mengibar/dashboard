import { createApp } from 'vue'
import App from './App.vue'
import AppRouter from './router/router'
import serviceContainer from './services/service-container';

const app = createApp(App)
app.use(AppRouter)
app.provide('$services', serviceContainer )
app.mount('#app')