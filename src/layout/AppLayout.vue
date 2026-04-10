<template>
	<div :class="['min-h-screen transition-colors duration-300', isDark ? 'bg-gray-950' : 'bg-[#F6F7FB]']">
		<div class="flex">
			<Sidebar />
			<div :class="['flex-1 transition-all duration-300', isExpanded ? 'lg:ml-60' : 'lg:ml-16']">
				<Navbar />
				<main class="px-3 pb-4 lg:px-6">
					<RouterView />
				</main>
			</div>
		</div>
	</div>
</template>

<script setup>
import Navbar from "@/layout/appLayoutsComponents/Navbar.vue";
import Sidebar from "@/layout/appLayoutsComponents/Sidebar.vue";
import { useDark } from "@/composables/useDark.js";
import { useSidebar } from "@/composables/useSidebar.js";

const { isDark } = useDark();
const { isExpanded } = useSidebar();
</script>