<template>
	<div class="py-6">
		<div class="flex items-center justify-between mb-6">
			<h1 :class="['text-2xl font-semibold', isDark ? 'text-white' : 'text-gray-900']">Personal</h1>
			<Button label="Nuevo Personal" icon="pi pi-plus" @click="openDialog()" />
		</div>

		<DataTable :value="personal" :pt="tablePt">
			<Column field="nombre"   header="Nombre Completo" />
			<Column field="cargo"    header="Cargo"           />
			<Column field="email"    header="Email"           />
			<Column field="sucursal" header="Sucursal"        />
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

		<Dialog v-model:visible="dialogVisible" :header="editingItem ? 'Editar Personal' : 'Nuevo Personal'"
			modal :style="{ width: '460px' }">
			<div class="flex flex-col gap-4 pt-2">
				<div class="flex flex-col gap-1">
					<label class="text-sm font-medium">Nombre completo</label>
					<InputText v-model="form.nombre" placeholder="Nombre apellido" />
				</div>
				<div class="flex flex-col gap-1">
					<label class="text-sm font-medium">Cargo</label>
					<InputText v-model="form.cargo" placeholder="Gerente, Vendedor..." />
				</div>
				<div class="flex flex-col gap-1">
					<label class="text-sm font-medium">Email</label>
					<InputText v-model="form.email" placeholder="correo@empresa.mx" />
				</div>
				<div class="flex flex-col gap-1">
					<label class="text-sm font-medium">Sucursal</label>
					<Select v-model="form.sucursal" :options="sucursalesOpts" placeholder="Seleccionar sucursal" />
				</div>
			</div>
			<template #footer>
				<Button label="Cancelar" severity="secondary" text @click="dialogVisible = false" />
				<Button :label="editingItem ? 'Guardar' : 'Crear'" @click="save" />
			</template>
		</Dialog>

		<Dialog v-model:visible="deleteDialogVisible" header="Confirmar eliminación" modal :style="{ width: '380px' }">
			<p class="text-sm">¿Estás seguro de eliminar a <strong>{{ deletingItem?.nombre }}</strong>?</p>
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

const sucursalesOpts = ['Central Automotriz', 'Auto Norte', 'Sucursal Pacífico']

const personal = ref([
	{ id: 1, nombre: 'Carlos Mendoza', cargo: 'Gerente',       email: 'carlos@autocentral.mx', sucursal: 'Central Automotriz' },
	{ id: 2, nombre: 'Ana García',     cargo: 'Vendedora',     email: 'ana@autocentral.mx',    sucursal: 'Central Automotriz' },
	{ id: 3, nombre: 'Roberto López',  cargo: 'Mecánico',      email: 'roberto@autonorte.mx',  sucursal: 'Auto Norte' },
	{ id: 4, nombre: 'María Torres',   cargo: 'Administradora',email: 'maria@autonorte.mx',    sucursal: 'Auto Norte' },
	{ id: 5, nombre: 'Luis Hernández', cargo: 'Vendedor',      email: 'luis@pacifico.mx',      sucursal: 'Sucursal Pacífico' },
])

const dialogVisible       = ref(false)
const deleteDialogVisible = ref(false)
const editingItem         = ref(null)
const deletingItem        = ref(null)
const form = reactive({ nombre: '', cargo: '', email: '', sucursal: '' })

const openDialog = (item = null) => {
	editingItem.value = item
	Object.assign(form, item ?? { nombre: '', cargo: '', email: '', sucursal: '' })
	dialogVisible.value = true
}
const save = () => {
	if (editingItem.value) {
		Object.assign(personal.value.find(p => p.id === editingItem.value.id), form)
	} else {
		personal.value.push({ id: Date.now(), ...form })
	}
	dialogVisible.value = false
}
const confirmDelete = (item) => { deletingItem.value = item; deleteDialogVisible.value = true }
const deleteItem    = () => {
	personal.value = personal.value.filter(p => p.id !== deletingItem.value.id)
	deleteDialogVisible.value = false
}
</script>