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
							<h1 class="text-3xl font-semibold">Crea tu cuenta</h1>
						</div>
					</div>
					<p class="text-sm text-slate-400">Regístrate para acceder al panel de sucursales, vehículos y personal.</p>
				</div>

				<div class="space-y-5">
					<div class="space-y-2">
						<label class="text-sm font-medium text-slate-200">Nombre completo</label>
						<div class="relative">
							<InputText v-model="form.name" placeholder="Ej. María Pérez" class="w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 focus:border-blue-400 focus:outline-none" />
						</div>
					</div>

					<div class="space-y-2">
						<label class="text-sm font-medium text-slate-200">Correo electrónico</label>
						<div class="relative">
							<InputText v-model="form.email" placeholder="correo@ejemplo.com" class="w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 focus:border-blue-400 focus:outline-none" type="email" />
						</div>
					</div>

					<div class="space-y-2">
						<label class="text-sm font-medium text-slate-200">Contraseña</label>
						<div class="relative">
							<InputText v-model="form.password" :type="showPassword ? 'text' : 'password'" placeholder="••••••••" class="w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 focus:border-blue-400 focus:outline-none" />
							<button type="button" @click="showPassword = !showPassword" class="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200">
								<span v-if="!showPassword">Mostrar</span>
								<span v-else>Ocultar</span>
							</button>
						</div>
					</div>

					<div class="space-y-2">
						<label class="text-sm font-medium text-slate-200">Confirmar contraseña</label>
						<InputText v-model="form.confirmPassword" :type="showPassword ? 'text' : 'password'" placeholder="••••••••" class="w-full rounded-3xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm text-slate-100 focus:border-blue-400 focus:outline-none" />
					</div>

					<Button label="Crear cuenta" class="w-full rounded-full bg-blue-500 text-white px-6 py-3 font-semibold hover:bg-blue-400 transition" @click="register" />
				</div>
				<p class="mt-6 text-center text-sm text-slate-400">Ya tienes cuenta? <RouterLink :to="{ name: 'login' }" class="font-semibold text-blue-300 hover:text-blue-200">Inicia sesión</RouterLink></p>
			</section>

			<section class="hidden lg:flex flex-col justify-between rounded-[32px] bg-gradient-to-br from-slate-900 to-slate-800 p-10 text-slate-100 shadow-2xl border border-white/10">
				<div>
					<p class="text-sm uppercase tracking-[0.28em] text-blue-300/70">Bienvenido a DriveHub</p>
					<h2 class="mt-6 text-4xl font-semibold leading-tight">Administra tu flota con estilo</h2>
					<p class="mt-4 text-sm text-slate-300">Regístrate y comienza a gestionar sucursales, vehículos y personal en un solo lugar, con acceso seguro y eficiente.</p>
				</div>
				<div class="space-y-3">
					<div class="rounded-3xl bg-white/5 p-5 border border-slate-700">
						<h3 class="text-lg font-semibold text-white">Simple y rápido</h3>
						<p class="mt-2 text-sm text-slate-300">Solo necesitas tu correo y contraseña para crear una cuenta.</p>
					</div>
					<div class="rounded-3xl bg-white/5 p-5 border border-slate-700">
						<h3 class="text-lg font-semibold text-white">Seguridad</h3>
						<p class="mt-2 text-sm text-slate-300">Tus credenciales se guardan con la seguridad de Supabase.</p>
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
const form = reactive({ name: '', email: '', password: '', confirmPassword: '' });

const register = async () => {
	if (!form.name || !form.email || !form.password || !form.confirmPassword) {
		toast.add({ severity: 'warn', summary: 'Faltan datos', detail: 'Completa todos los campos.', life: 3000 });
		return;
	}

	if (form.password !== form.confirmPassword) {
		toast.add({ severity: 'warn', summary: 'Contraseñas diferentes', detail: 'Las contraseñas deben coincidir.', life: 3000 });
		return;
	}

	const { data, error } = await supabase.auth.signUp({
		email: form.email,
		password: form.password,
		options: {
			data: { full_name: form.name }
		}
	});

	if (error) {
		const message = error.message.includes('rate limit')
			? 'Ya se envió un correo de confirmación recientemente. Revisa tu bandeja de entrada o espera unos minutos antes de intentar de nuevo.'
			: error.message.includes('already registered')
				? 'Ya existe una cuenta con ese correo. Prueba iniciar sesión o restablecer tu contraseña.'
					: error.message;

		toast.add({ severity: 'error', summary: 'Error al registrar', detail: message, life: 6000 });
		return;
	}

	if (data?.session) {
		toast.add({ severity: 'success', summary: 'Bienvenido', detail: 'Tu cuenta ha sido creada.', life: 3000 });
		router.push({ name: 'dashboard' });
		return;
	}

	const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
		email: form.email,
		password: form.password,
	});

	if (signInError) {
		const message = signInError.message.includes('credentials')
			? 'Tu cuenta fue creada, pero necesitas confirmar tu correo antes de iniciar sesión.'
			: signInError.message;

		toast.add({ severity: 'success', summary: 'Registro exitoso', detail: 'Se envió correo de confirmación. ' + message, life: 6000 });
		router.push({ name: 'login' });
		return;
	}

	if (signInData?.session) {
		toast.add({ severity: 'success', summary: 'Bienvenido', detail: 'Tu cuenta ha sido creada e iniciaste sesión automáticamente.', life: 3000 });
		router.push({ name: 'dashboard' });
		return;
	}

	toast.add({ severity: 'success', summary: 'Registro exitoso', detail: 'Revisa tu correo para confirmar tu cuenta.', life: 6000 });
	router.push({ name: 'login' });
};
</script>
