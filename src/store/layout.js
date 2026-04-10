import AppLayout from "@/layout/AppLayout.vue";
import AuthLayout from "@/layout/AuthLayout.vue";
import {shallowRef} from "vue";

const appLayout = shallowRef(AppLayout);
const authLayout = shallowRef(AuthLayout);

export default {
    namespaced: true,
    state: {
        current: authLayout,
    },
    actions: {
        setAuthLayout (store) {
            store.state.current = authLayout;
        },
        setAppLayout (store) {
            store.state.current = appLayout;
        }
    }
}