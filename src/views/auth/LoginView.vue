<template>
	<div>
		<!-- Logo -->
		<div class="flex flex-col items-center mb-8">
			<img src="@/assets/drivehub_logo.svg" alt="DriveHub" class="h-14 w-auto mb-3 select-none" />
			<h1 class="text-2xl font-semibold text-white"><span class="text-blue-400">Drive</span>Hub</h1>
			<p class="text-sm text-gray-400 mt-1">Inicia sesión en tu cuenta</p>
		</div>

		<!-- Card -->
		<div class="bg-gray-800 rounded-2xl p-8 border border-gray-700 shadow-xl">
			<div class="flex flex-col gap-5">

				<div class="flex flex-col gap-1.5">
					<label class="text-sm font-medium text-gray-300">Correo electrónico</label>
					<div class="relative">
						<Mail class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
						<InputText
							v-model="form.email"
							placeholder="correo@ejemplo.com"
							class="w-full pl-10"
							type="email" />
					</div>
				</div>

				<div class="flex flex-col gap-1.5">
					<label class="text-sm font-medium text-gray-300">Contraseña</label>
					<div class="relative">
						<Lock class="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
						<InputText
							v-model="form.password"
							:type="showPassword ? 'text' : 'password'"
							placeholder="••••••••"
							class="w-full pl-10 pr-10" />
						<button
							type="button"
							@click="showPassword = !showPassword"
							class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 cursor-pointer">
							<Eye v-if="!showPassword" class="size-4" />
							<EyeOff v-else class="size-4" />
						</button>
					</div>
				</div>

				<Button
					label="Iniciar sesión"
					icon="pi pi-sign-in"
					class="w-full mt-1"
					@click="login" />

				<p class="text-center text-sm text-gray-400">
					¿No tienes cuenta?
					<RouterLink :to="{ name: 'register' }" class="text-blue-400 hover:text-blue-300 font-medium ml-1">
						Regístrate
					</RouterLink>
				</p>
			</div>
		</div>
	</div>
</template>

<script setup>
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { Mail, Lock, Eye, EyeOff } from "lucide-vue-next";
import InputText from "primevue/inputtext";
import Button from "primevue/button";

const router = useRouter();
const showPassword = ref(false);
const form = reactive({ email: '', password: '' });

const login = () => {
	router.push({ name: 'dashboard' });
};
</script>