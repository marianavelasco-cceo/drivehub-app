<template>
	<aside
    :class="[
        'flex flex-col h-screen fixed left-0 top-0 border-r transition-all duration-300 z-30',
        isExpanded ? 'w-60 px-6' : 'w-16 px-3',
        isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
    ]">

		<!-- Logo -->
		<div :class="['flex items-center py-6 mb-2', isExpanded ? 'gap-3 justify-start' : 'justify-center']">
			<img src="@/assets/ttp-logo.png" alt="DriveHub logo" class="h-8 w-8 select-none flex-shrink-0" />
			<span v-if="isExpanded" class="text-xl font-semibold transition-opacity duration-200" :class="isDark ? 'text-white' : 'text-gray-900'">
				<span class="text-blue-500">Drive</span>Hub
			</span>
		</div>

		<!-- Nav items -->
		<nav class="space-y-1 flex-1 overflow-y-auto">
			<RouterLink
				v-for="item in modules" :key="item.label" :to="{ name: item.route }"
				:title="!isExpanded ? item.label : ''"
				:class="[
					'group flex items-center gap-3 rounded-xl px-3 py-2.5 font-medium transition',
					isExpanded ? '' : 'justify-center',
					currentRoute === item.route
						? 'bg-blue-500 text-white'
						: isDark
							? 'text-gray-300 hover:bg-gray-700'
							: 'text-gray-700 hover:bg-blue-500 hover:text-white'
				]">
				<component :is="item.icon" class="size-5 flex-shrink-0"
					:class="currentRoute === item.route ? 'text-white' : isDark ? 'text-gray-300' : 'text-gray-600 group-hover:text-white'" />
				<span v-if="isExpanded" class="group-hover:text-white whitespace-nowrap">{{ item.label }}</span>
			</RouterLink>
		</nav>

		<!-- Bottom controls -->
		<div :class="['pt-4 border-t space-y-1', isDark ? 'border-gray-700' : 'border-gray-200']">

			<!-- Dark mode toggle -->
			<button
				@click="toggleDark"
				:title="!isExpanded ? (isDark ? 'Modo claro' : 'Modo oscuro') : ''"
				:class="[
					'flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition cursor-pointer font-medium',
					isExpanded ? '' : 'justify-center',
					isDark ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
				]">
				<Sun v-if="isDark" class="size-5 flex-shrink-0" />
				<Moon v-else class="size-5 flex-shrink-0" />
				<span v-if="isExpanded">{{ isDark ? 'Modo claro' : 'Modo oscuro' }}</span>
			</button>

			<!-- Logout -->
			<button
				@click="logout"
				:title="!isExpanded ? 'Cerrar sesión' : ''"
				:class="[
					'flex items-center gap-3 w-full px-3 py-2.5 rounded-xl transition cursor-pointer font-medium',
					isExpanded ? '' : 'justify-center',
					isDark ? 'text-gray-300 hover:bg-red-900 hover:text-red-400' : 'text-gray-700 hover:bg-red-50 hover:text-red-500'
				]">
				<LogOut class="size-5 flex-shrink-0" />
				<span v-if="isExpanded">Cerrar sesión</span>
			</button>
		</div>

		<!-- Expand/collapse button -->
		 <button
    @click="toggleExpanded"
    :class="[
        'absolute -right-3 top-8 h-6 w-6 rounded-full border flex items-center justify-center transition cursor-pointer flex-shrink-0',
        isDark ? 'bg-gray-900 border-gray-600 text-gray-300' : 'bg-white border-gray-200 text-gray-600'
    ]">
    <ChevronRight class="size-3 transition-transform duration-300 flex-shrink-0" :class="isExpanded ? 'rotate-180' : 'rotate-0'" />
</button>
	
	</aside>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import { computed } from "vue";
import { LogOut, Sun, Moon, ChevronRight } from "lucide-vue-next";
import { modules } from "./sidebarModules.js";
import { useDark } from "@/composables/useDark.js";
import { useSidebar } from "@/composables/useSidebar.js";
import { supabase } from "@/supabase/client.js";

const route = useRoute();
const router = useRouter();
const currentRoute = computed(() => route.name);
const { isDark, toggleDark } = useDark();
const { isExpanded, toggleExpanded } = useSidebar();

const logout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
        console.error('Logout error:', error);
    }
    router.push({ name: 'login' });
};
</script>