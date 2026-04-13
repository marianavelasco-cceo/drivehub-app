<template>
<div class="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-12">
<div class="w-full max-w-4xl grid gap-8 lg:grid-cols-[1.2fr_1fr]">
<section class="rounded-[32px] bg-white/5 border border-white/10 p-8 shadow-2xl backdrop-blur-xl text-slate-100">
<div class="mb-8">
<div class="inline-flex items-center gap-2 mb-4">
<div class="h-12 w-12 rounded-2xl bg-blue-500/10 border border-blue-400/20 flex items-center justify-center text-blue-300">
<span class="font-bold text-lg">DH</span>
</div>
<div>
<p class="text-sm uppercase tracking-[0.32em] text-blue-300/80">DriveHub</p>
<h1 class="text-3xl font-semibold">Inicia sesión</h1>
</div>
</div>
<p class="text-sm text-slate-400">Accede a tus sucursales, vehículos y personal de forma segura.</p>
</div>

<div class="space-y-5">
<div class="space-y-2">
<label class="text-sm font-medium text-slate-200">Correo electrónico</label>
<InputText v-model="form.email" placeholder="correo@ejemplo.com" class="w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 focus:border-blue-400 focus:outline-none" type="email" />
</div>

<div class="space-y-2">
<label class="text-sm font-medium text-slate-200">Contraseña</label>
<div class="relative">
<InputText v-model="form.password" :type="showPassword ? 'text' : 'password'" placeholder="••••••••" class="w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 focus:border-blue-400 focus:outline-none" />
<button type="button" @click="showPassword = !showPassword" class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200">{{ showPassword ? 'Ocultar' : 'Mostrar' }}</button>
</div>
</div>

<Button label="Iniciar sesión" class="w-full rounded-full bg-blue-500 text-white px-6 py-3 font-semibold hover:bg-blue-400 transition" @click="login" />
</div>

<p class="mt-6 text-center text-sm text-slate-400">¿Aún no tienes cuenta? <RouterLink :to="{ name: 'register' }" class="font-semibold text-blue-300 hover:text-blue-200">Regístrate</RouterLink></p>
</section>

<section class="hidden lg:flex flex-col justify-between rounded-[32px] bg-gradient-to-br from-slate-900 to-slate-800 p-10 text-slate-100 shadow-2xl border border-white/10">
<div>
<p class="text-sm uppercase tracking-[0.28em] text-blue-300/70">Bienvenido de vuelta</p>
<h2 class="mt-6 text-4xl font-semibold leading-tight">Tu panel administrativo en un solo lugar</h2>
<p class="mt-4 text-sm text-slate-300">Gestiona sucursales, autos y personal con una experiencia moderna, segura y simple.</p>
</div>
<div class="space-y-3">
<div class="rounded-3xl bg-white/5 p-5 border border-slate-700">
<h3 class="text-lg font-semibold text-white">Acceso seguro</h3>
<p class="mt-2 text-sm text-slate-300">Usa tus credenciales de Supabase para iniciar sesión.</p>
</div>
<div class="rounded-3xl bg-white/5 p-5 border border-slate-700">
<h3 class="text-lg font-semibold text-white">Soporte</h3>
<p class="mt-2 text-sm text-slate-300">Si necesitas una cuenta, crea una ahora o contacta al administrador.</p>
</div>
</div>
</section>
</div>
<Toast position="top-right" />
</div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Toast from "primevue/toast";
import { useToast } from "primevue/usetoast";
import { supabase } from "@/supabase/client.js";

const router = useRouter();
const toast = useToast();
const showPassword = ref(false);
const form = reactive({ email: '', password: '' });

const login = async () => {
if (!form.email || !form.password) {
toast.add({ severity: 'warn', summary: 'Faltan datos', detail: 'Ingresa tu correo y contraseña.', life: 3000 });
return;
}

const { data, error } = await supabase.auth.signInWithPassword({
email: form.email,
password: form.password,
});

if (error) {
toast.add({ severity: 'error', summary: 'Error al iniciar sesión', detail: error.message, life: 4000 });
return;
}

if (!data?.session) {
toast.add({ severity: 'error', summary: 'Error', detail: 'No se pudo iniciar sesión.', life: 4000 });
return;
}

toast.add({ severity: 'success', summary: 'Bienvenido', detail: 'Has iniciado sesión correctamente.', life: 3000 });
router.push({ name: 'dashboard' });
};
</script>
