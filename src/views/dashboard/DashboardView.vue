<template>
	<div class="py-6">
		<h1 :class="['text-2xl font-semibold mb-6', isDark ? 'text-white' : 'text-gray-900']">Dashboard</h1>
		<div class="grid grid-cols-1 md:grid-cols-3 gap-4">
			<div v-for="card in cards" :key="card.label"
				:class="['rounded-2xl p-5 flex items-center justify-between', isDark ? 'bg-gray-800' : 'bg-white border border-gray-200']">
				<div>
					<p :class="['text-sm mb-1', isDark ? 'text-gray-400' : 'text-gray-500']">{{ card.label }}</p>
					<p :class="['text-3xl font-semibold', isDark ? 'text-white' : 'text-gray-900']">{{ card.value }}</p>
				</div>
				<component :is="card.icon" :class="['size-8', card.color]" />
			</div>
		</div>
	</div>
</template>

<script setup>
import { Building2, Car, Users } from "lucide-vue-next";
import { useDark } from "@/composables/useDark.js";
import { supabase } from '@/supabase/client.js'
import { onMounted } from 'vue'



const { isDark } = useDark();

const cards = [
	{ label: 'Sucursales', value: 3, icon: Building2, color: 'text-blue-500' },
	{ label: 'Carros',     value: 6, icon: Car,       color: 'text-yellow-500' },
	{ label: 'Personal',  value: 5, icon: Users,      color: 'text-green-500' },
]

onMounted(async () => {
    const { data, error } = await supabase.from('sucursales').select('*')
    if (error) {
        console.error('❌ Error:', error.message)
    } else {
        console.log('✅ Conexión exitosa:', data)
    }
})
</script>