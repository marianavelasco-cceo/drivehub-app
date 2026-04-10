import { createApp } from 'vue'
import './css/style.css'
import App from './App.vue'
import createRouter from '@/router/index.js'
import { createStore } from 'vuex'
import layout from '@/store/layout.js'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import 'primeicons/primeicons.css'
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'

const router = createRouter()
const store = createStore({ modules: { layout } })

createApp(App)
    .use(router)
    .use(store)
    .use(PrimeVue, { theme: { preset: Aura } })
    .use(ToastService)
    .use(ConfirmationService)
    .mount('#app')