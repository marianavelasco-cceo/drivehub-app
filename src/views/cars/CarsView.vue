<template>
	<div class="py-6">
		<div class="flex items-center justify-between mb-6">
			<h1 :class="['text-2xl font-semibold', isDark ? 'text-white' : 'text-gray-900']">Carros</h1>
			<Button label="Nuevo Carro" icon="pi pi-plus" @click="openDialog()" />
		</div>

		<DataTable :value="carros" :pt="tablePt" :loading="loading">
			<Column field="marca"     header="Marca"    />
			<Column field="modelo"    header="Modelo"   />
			<Column field="anio"      header="Año"      />
			<Column field="precio"    header="Precio"   />
			<Column field="estado"    header="Estado"   >
				<template #body="{ data }">
					<span :class="['px-3 py-1 rounded-full text-xs font-semibold', estadoClass(data.estado)]">
						{{ data.estado }}
					</span>
				</template>
			</Column>
			<Column header="Sucursal">
				<template #body="{ data }">
					{{ sucursalNamesById[data.sucursal_id] || data.sucursal?.nombre || 'Sin sucursal' }}
				</template>
			</Column>
			<Column header="Acciones" style="width:100px">
				<template #body="{ data }">
					<div class="flex gap-2">
						<button @click="openDialog(data)" class="cursor-pointer text-gray-400 hover:text-blue-500 transition">
							<Pencil class="size-4" />
						</button>
						<button @click="confirmDelete(data)" class="cursor-pointer text-gray-400 hover:text-red-500 transition">
							<Trash2 class="size-4" />
						</button>
					</div>
				</template>
			</Column>
		</DataTable>

		<Dialog v-model:visible="dialogVisible" :header="editingItem ? 'Editar Carro' : 'Nuevo Carro'"
			modal :style="{ width: '480px' }">
			<div class="grid grid-cols-2 gap-4 pt-2">
				<div class="flex flex-col gap-1">
					<label class="text-sm font-medium">Marca</label>
					<InputText v-model="form.marca" placeholder="Toyota" />
				</div>
				<div class="flex flex-col gap-1">
					<label class="text-sm font-medium">Modelo</label>
					<InputText v-model="form.modelo" placeholder="Camry" />
				</div>
				<div class="flex flex-col gap-1">
					<label class="text-sm font-medium">Año</label>
					<InputText v-model="form.anio" placeholder="2024" />
				</div>
				<div class="flex flex-col gap-1">
					<label class="text-sm font-medium">Precio</label>
					<InputText v-model="form.precio" placeholder="$35.000" />
				</div>
				<div class="flex flex-col gap-1">
					<label class="text-sm font-medium">Estado</label>
					<Select v-model="form.estado" :options="estados" placeholder="Seleccionar" />
				</div>
				<div class="flex flex-col gap-1">
					<label class="text-sm font-medium">Sucursal</label>
					<Select v-model="form.sucursal_id" :options="sucursalesOpts" optionLabel="label" optionValue="value" placeholder="Seleccionar" />
				</div>
			</div>
			<template #footer>
				<Button label="Cancelar" severity="secondary" text @click="dialogVisible = false" />
				<Button :label="editingItem ? 'Guardar' : 'Crear'" :loading="saving" @click="save" />
			</template>
		</Dialog>

		<Dialog v-model:visible="deleteDialogVisible" header="Confirmar eliminación" modal :style="{ width: '380px' }">
			<p class="text-sm">¿Estás seguro de eliminar <strong>{{ deletingItem?.marca }} {{ deletingItem?.modelo }}</strong>?</p>
			<template #footer>
				<Button label="Cancelar" severity="secondary" text @click="deleteDialogVisible = false" />
				<Button label="Eliminar" severity="danger" @click="deleteItem" />
			</template>
		</Dialog>
	</div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { Pencil, Trash2 } from "lucide-vue-next";
import { useDark } from "@/composables/useDark.js";
import { useTablePt } from "@/composables/useTablePt.js";
import { supabase } from "@/supabase/client.js";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Select from "primevue/select";

const { isDark } = useDark();
const { tablePt } = useTablePt();

const estados = ['Disponible', 'Vendido', 'Reservado']
const sucursalesOpts = ref([])
const sucursalNamesById = ref({})

const carros = ref([])

const estadoClass = (estado) => ({
	'bg-green-900 text-green-400':  estado === 'Disponible',
	'bg-gray-700  text-gray-300':   estado === 'Vendido',
	'bg-yellow-900 text-yellow-400': estado === 'Reservado',
})

const loading = ref(false)
const saving = ref(false)
const dialogVisible = ref(false)
const deleteDialogVisible = ref(false)
const editingItem = ref(null)
const deletingItem = ref(null)
const form = reactive({ marca: '', modelo: '', anio: '', precio: '', estado: '', sucursal_id: null })

const fetchSucursales = async () => {
	const { data, error } = await supabase.from('sucursales').select('id,nombre').order('created_at')
	if (error) {
		console.error('Error al cargar sucursales:', error)
		return
	}
	sucursalesOpts.value = (data ?? []).map(item => ({ label: item.nombre, value: item.id }))
	sucursalNamesById.value = Object.fromEntries((data ?? []).map(item => [item.id, item.nombre]))
}

const fetchCarros = async () => {
	loading.value = true
	const { data, error } = await supabase.from('carros').select('*').order('created_at')
	if (error) {
		console.error('Error al cargar carros:', error)
		carros.value = []
	} else {
		carros.value = data ?? []
	}
	loading.value = false
}

const save = async () => {
	saving.value = true
	const payload = {
		marca: form.marca,
		modelo: form.modelo,
		anio: Number(form.anio),
		precio: form.precio,
		estado: form.estado,
		sucursal_id: form.sucursal_id,
	}

	if (editingItem.value) {
		await supabase.from('carros').update(payload).eq('id', editingItem.value.id)
	} else {
		await supabase.from('carros').insert(payload)
	}

	dialogVisible.value = false
	saving.value = false
	await fetchCarros()
}

const deleteItem = async () => {
	saving.value = true
	await supabase.from('carros').delete().eq('id', deletingItem.value.id)
	deleteDialogVisible.value = false
	saving.value = false
	await fetchCarros()
}

const openDialog = (item = null) => {
	editingItem.value = item
	Object.assign(form, item ?? { marca: '', modelo: '', anio: '', precio: '', estado: '', sucursal_id: null })
	if (item?.sucursal_id) {
		form.sucursal_id = item.sucursal_id
	} else if (item?.sucursal?.id) {
		form.sucursal_id = item.sucursal.id
	}
	dialogVisible.value = true
}

const confirmDelete = (item) => {
	deletingItem.value = item
	deleteDialogVisible.value = true
}

onMounted(async () => {
	await fetchSucursales()
	await fetchCarros()
})
</script>