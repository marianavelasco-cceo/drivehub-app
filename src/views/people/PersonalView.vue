<template>
	<div class="py-6">
		<div class="flex items-center justify-between mb-6">
			<h1 :class="['text-2xl font-semibold', isDark ? 'text-white' : 'text-gray-900']">Personal</h1>
			<Button label="Nuevo Personal" icon="pi pi-plus" @click="openDialog()" />
		</div>

		<DataTable :value="personal" :pt="tablePt" :loading="loading">
			<Column field="nombre"   header="Nombre Completo" />
			<Column field="cargo"    header="Cargo"           />
			<Column field="email"    header="Email"           />
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
					<Select v-model="form.sucursal_id" :options="sucursalesOpts" optionLabel="label" optionValue="value" placeholder="Seleccionar sucursal" />
				</div>
			</div>
			<template #footer>
				<Button label="Cancelar" severity="secondary" text @click="dialogVisible = false" />
				<Button :label="editingItem ? 'Guardar' : 'Crear'" :loading="saving" @click="save" />
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

const sucursalesOpts = ref([])
const sucursalNamesById = ref({})
const personal = ref([])

const loading = ref(false)
const saving = ref(false)
const dialogVisible = ref(false)
const deleteDialogVisible = ref(false)
const editingItem = ref(null)
const deletingItem = ref(null)
const form = reactive({ nombre: '', cargo: '', email: '', sucursal_id: null })

const openDialog = (item = null) => {
	editingItem.value = item
	Object.assign(form, item ?? { nombre: '', cargo: '', email: '', sucursal_id: null })
	if (item?.sucursal_id) {
		form.sucursal_id = item.sucursal_id
	} else if (item?.sucursal?.id) {
		form.sucursal_id = item.sucursal.id
	}
	dialogVisible.value = true
}
const fetchSucursales = async () => {
	const { data, error } = await supabase.from('sucursales').select('id,nombre').order('created_at')
	if (error) {
		console.error('Error al cargar sucursales:', error)
		return
	}
	sucursalesOpts.value = (data ?? []).map(item => ({ label: item.nombre, value: item.id }))
	sucursalNamesById.value = Object.fromEntries((data ?? []).map(item => [item.id, item.nombre]))
}

const fetchPersonal = async () => {
	loading.value = true
	const { data, error } = await supabase.from('personal').select('*').order('created_at')
	if (error) {
		console.error('Error al cargar personal:', error)
		personal.value = []
	} else {
		personal.value = data ?? []
	}
	loading.value = false
}

const save = async () => {
	saving.value = true
	const payload = {
		nombre: form.nombre,
		cargo: form.cargo,
		email: form.email,
		sucursal_id: form.sucursal_id,
	}

	if (editingItem.value) {
		await supabase.from('personal').update(payload).eq('id', editingItem.value.id)
	} else {
		await supabase.from('personal').insert(payload)
	}

	dialogVisible.value = false
	saving.value = false
	await fetchPersonal()
}
const confirmDelete = (item) => { deletingItem.value = item; deleteDialogVisible.value = true }
const deleteItem = async () => {
	saving.value = true
	await supabase.from('personal').delete().eq('id', deletingItem.value.id)
	deleteDialogVisible.value = false
	saving.value = false
	await fetchPersonal()
}

onMounted(async () => {
	await fetchSucursales()
	await fetchPersonal()
})
</script>