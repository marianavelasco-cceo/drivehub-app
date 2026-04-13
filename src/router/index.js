import { createRouter, createWebHistory } from "vue-router";

const routes = [
    // Auth
    {
        path: '/login',
        name: 'login',
        component: () => import("@/views/auth/LoginView.vue"),
        meta: { guest: true }
    },
    {
        path: '/register',
        name: 'register',
        component: () => import("@/views/auth/RegisterView.vue"),
        meta: { guest: true }
    },

    // Sistema (protegidas)
    {
        path: '/',
        component: () => import("@/layout/AppLayout.vue"),
        meta: { requiresAuth: true },
        children: [
            {
                path: '',
                name: 'dashboard',
                component: () => import("@/views/dashboard/DashboardView.vue"),
            },
            {
                path: 'sucursales',
                name: 'sucursales',
                component: () => import("@/views/branches/BranchesView.vue"),
            },
            {
                path: 'carros',
                name: 'carros',
                component: () => import("@/views/cars/CarsView.vue"),
            },
            {
                path: 'personal',
                name: 'personal',
                component: () => import("@/views/people/PersonalView.vue"),
            },
            
        ]
    },

    // 404
    {
        path: '/:pathMatch(.*)*',
        name: 'Error404',
        component: () => import("@/views/error/Error404.vue"),
    }
];

export default function () {
    return createRouter({
        history: createWebHistory(import.meta.env.BASE_URL),
        routes
    });
}