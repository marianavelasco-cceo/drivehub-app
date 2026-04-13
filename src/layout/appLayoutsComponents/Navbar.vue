<template>
	<header :class="['sticky top-0 z-20', isDark ? 'bg-gray-900' : 'bg-[#F6F7FB]']">
		<div class="px-6 lg:px-10 py-4">
			<div class="flex items-center gap-4">
				<div class="flex-1">
					<div class="relative">
						<Search class="h-4 w-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
						<input
    type="text" placeholder="Buscar..." aria-label="Buscar"
    :class="[
        'w-full rounded-3xl pl-11 pr-4 py-3 text-sm border outline-none focus:ring-2 focus:ring-blue-300',
        isDark
            ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500'
            : 'bg-white border-gray-300 text-gray-900'
    ]" />
					</div>
				</div>
				<div class="flex items-center gap-3">
					<button :class="[
    'flex items-center justify-center h-11 w-11 rounded-2xl border transition cursor-pointer',
    isDark ? 'bg-gray-800 border-gray-700 hover:bg-gray-700' : 'bg-white border-gray-200 hover:bg-gray-100'
]">
    <Bell :class="['h-5 w-5', isDark ? 'text-gray-300' : 'text-gray-600']" />
</button>
					<div class="h-11 w-px bg-gray-200 mx-1" />
					<button
						ref="userMenuButton" type="button"
						class="flex items-center gap-3 px-2 py-1 rounded-lg hover:bg-gray-200 transition cursor-pointer"
						@click="toggleMenu">
						<div class="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100 border border-blue-200">
							<Car class="h-5 w-5 text-blue-600" />
						</div>
						<div class="hidden lg:block leading-tight">
							<p class="text-sm font-semibold text-gray-900">Admin</p>
							<p class="text-xs text-gray-400">DriveHub</p>
						</div>
						<ChevronDown class="hidden lg:block h-4 w-4 text-gray-400 transition-transform" :class="openUserMenu ? 'rotate-180' : 'rotate-0'" />
					</button>
					<transition
						enter-active-class="transition ease-out duration-100"
						enter-from-class="transform opacity-0 scale-95"
						enter-to-class="transform opacity-100 scale-100"
						leave-active-class="transition ease-in duration-75"
						leave-from-class="transform opacity-100 scale-100"
						leave-to-class="transform opacity-0 scale-95">
						<div
							v-if="openUserMenu"
							ref="userMenuRef"
							class="absolute right-2 lg:right-10 top-14 lg:top-18 w-40 rounded-md shadow-lg ring-1 ring-black/10 z-50 py-2 bg-white"
							role="menu" aria-orientation="vertical" tabindex="-1">
							<button
								class="flex items-center gap-x-3 w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100 cursor-pointer"
								role="menuitem"
								@click="logout">
								<LogOut class="size-5" />
								Cerrar sesión
							</button>
						</div>
					</transition>
				</div>
			</div>
		</div>
	</header>
</template>

<script setup>
import { Search, Bell, ChevronDown, LogOut, Car } from "lucide-vue-next";
import { onBeforeUnmount, onMounted, ref } from "vue";
import { useRouter } from "vue-router";
import { useDark } from "@/composables/useDark.js";
import { supabase } from "@/supabase/client.js";
const { isDark } = useDark();

const openUserMenu = ref(false);
const userMenuRef = ref(null);
const userMenuButton = ref(null);
const router = useRouter();

const toggleMenu = () => { openUserMenu.value = !openUserMenu.value; };

const logout = async () => {
    openUserMenu.value = false;
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error('Logout error:', error);
    }
    router.push({ name: 'login' });
};

function handleClickOutside(event) {
    if (
        openUserMenu.value && userMenuRef.value &&
        !userMenuRef.value.contains(event.target) &&
        !userMenuButton.value.contains(event.target)
    ) {
        openUserMenu.value = false;
    }
}

onMounted(() => document.addEventListener("click", handleClickOutside));
onBeforeUnmount(() => document.removeEventListener("click", handleClickOutside));
</script>