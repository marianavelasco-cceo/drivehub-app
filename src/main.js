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
import { supabase } from '@/supabase/client.js'

const router = createRouter()
const store = createStore({ modules: { layout } })

router.beforeEach(async (to, from, next) => {
    if (to.meta.requiresAuth || to.meta.guest) {
        const { data } = await supabase.auth.getSession()
        const session = data?.session

        if (to.meta.requiresAuth && !session) {
            return next({ name: 'login' })
        }

        if (to.meta.guest && session) {
            return next({ name: 'dashboard' })
        }
    }

    return next()
})

createApp(App)
    .use(router)
    .use(store)
    .use(PrimeVue, { theme: { preset: Aura } })
    .use(ToastService)
    .use(ConfirmationService)
    .mount('#app')