import { ref } from "vue";
import { LayoutDashboard, Building2, Car, Users } from "lucide-vue-next";

const modules = ref([
    {
        label: 'Dashboard',
        route: 'dashboard',
        icon: LayoutDashboard
    },
    {
        label: 'Sucursales',
        route: 'sucursales',
        icon: Building2,
    },
    {
        label: 'Carros',
        route: 'carros',
        icon: Car,
    },
    {
        label: 'Personal',
        route: 'personal',
        icon: Users,
    }
]);

export { modules };