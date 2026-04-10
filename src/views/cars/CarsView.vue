<template>
	<div class="py-6">
		<div class="flex items-center justify-between mb-6">
			<h1 :class="['text-2xl font-semibold', isDark ? 'text-white' : 'text-gray-900']">Carros</h1>
			<Button label="Nuevo Carro" icon="pi pi-plus" @click="openDialog()" />
		</div>

		<DataTable :value="carros" :pt="tablePt">
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
			<Column field="sucursal"  header="Sucursal" />
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
					<Select v-model="form.sucursal" :options="sucursalesOpts" placeholder="Seleccionar" />
				</div>
			</div>
			<template #footer>
				<Button label="Cancelar" severity="secondary" text @click="dialogVisible = false" />
				<Button :label="editingItem ? 'Guardar' : 'Crear'" @click="save" />
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
import { ref, reactive } from "vue";
import { Pencil, Trash2 } from "lucide-vue-next";
import { useDark } from "@/composables/useDark.js";
import { useTablePt } from "@/composables/useTablePt.js";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Select from "primevue/select";

const { isDark } = useDark();
const { tablePt } = useTablePt();

const estados       = ['Disponible', 'Vendido', 'Reservado']
const sucursalesOpts = ['Central Automotriz', 'Auto Norte', 'Sucursal Pacífico']

const carros = ref([
	{ id: 1, marca: 'Toyota',   modelo: 'Camry',   anio: 2024, precio: '$35.000', estado: 'Disponible', sucursal: 'Central Automotriz' },
	{ id: 2, marca: 'Honda',    modelo: 'Civic',   anio: 2023, precio: '$28.000', estado: 'Vendido',    sucursal: 'Central Automotriz' },
	{ id: 3, marca: 'Ford',     modelo: 'Mustang', anio: 2024, precio: '$55.000', estado: 'Disponible', sucursal: 'Auto Norte' },
	{ id: 4, marca: 'BMW',      modelo: 'X5',      anio: 2023, precio: '$72.000', estado: 'Reservado',  sucursal: 'Auto Norte' },
	{ id: 5, marca: 'Nissan',   modelo: 'Sentra',  anio: 2024, precio: '$22.000', estado: 'Disponible', sucursal: 'Sucursal Pacífico' },
	{ id: 6, marca: 'Chevrolet',modelo: 'Tahoe',   anio: 2024, precio: '$62.000', estado: 'Disponible', sucursal: 'Sucursal Pacífico' },
])

const estadoClass = (estado) => ({
	'bg-green-900 text-green-400':  estado === 'Disponible',
	'bg-gray-700  text-gray-300':   estado === 'Vendido',
	'bg-yellow-900 text-yellow-400': estado === 'Reservado',
})

const dialogVisible       = ref(false)
const deleteDialogVisible = ref(false)
const editingItem         = ref(null)
const deletingItem        = ref(null)
const form = reactive({ marca: '', modelo: '', anio: '', precio: '', estado: '', sucursal: '' })

const openDialog = (item = null) => {
	editingItem.value = item
	Object.assign(form, item ?? { marca: '', modelo: '', anio: '', precio: '', estado: '', sucursal: '' })
	dialogVisible.value = true
}
const save = () => {
	if (editingItem.value) {
		Object.assign(carros.value.find(c => c.id === editingItem.value.id), form)
	} else {
		carros.value.push({ id: Date.now(), ...form })
	}
	dialogVisible.value = false
}
const confirmDelete = (item) => { deletingItem.value = item; deleteDialogVisible.value = true }
const deleteItem    = () => {
	carros.value = carros.value.filter(c => c.id !== deletingItem.value.id)
	deleteDialogVisible.value = false
}
</script>