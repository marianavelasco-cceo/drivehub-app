<template>
	<div class="py-6">
		<div class="flex items-center justify-between mb-6">
			<h1 :class="['text-2xl font-semibold', isDark ? 'text-white' : 'text-gray-900']">Sucursales</h1>
			<Button label="Nueva Sucursal" icon="pi pi-plus" @click="openDialog()" />
		</div>

		<DataTable :value="sucursales" :pt="tablePt" :loading="loading">
			<Column field="nombre"    header="Nombre"    />
			<Column field="direccion" header="Dirección" />
			<Column field="telefono"  header="Teléfono"  />
			<Column field="ciudad"    header="Ciudad"    />
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

		<!-- Dialog crear/editar -->
		<Dialog v-model:visible="dialogVisible" :header="editingItem ? 'Editar Sucursal' : 'Nueva Sucursal'"
			modal :style="{ width: '440px' }">
			<div class="flex flex-col gap-4 pt-2">
				<div class="flex flex-col gap-1">
					<label class="text-sm font-medium">Nombre</label>
					<InputText v-model="form.nombre" placeholder="Nombre de la sucursal" />
				</div>
				<div class="flex flex-col gap-1">
					<label class="text-sm font-medium">Dirección</label>
					<InputText v-model="form.direccion" placeholder="Dirección" />
				</div>
				<div class="flex flex-col gap-1">
					<label class="text-sm font-medium">Teléfono</label>
					<InputText v-model="form.telefono" placeholder="+52 555 0000" />
				</div>
				<div class="flex flex-col gap-1">
					<label class="text-sm font-medium">Ciudad</label>
					<InputText v-model="form.ciudad" placeholder="Ciudad" />
				</div>
			</div>
			<template #footer>
				<Button label="Cancelar" severity="secondary" text @click="dialogVisible = false" />
				<Button :label="editingItem ? 'Guardar' : 'Crear'" :loading="saving" @click="save" />
			</template>
		</Dialog>

		<!-- Dialog confirmar eliminar -->
		<Dialog v-model:visible="deleteDialogVisible" header="Confirmar eliminación" modal :style="{ width: '380px' }">
			<p class="text-sm">¿Estás seguro de eliminar <strong>{{ deletingItem?.nombre }}</strong>?</p>
			<template #footer>
				<Button label="Cancelar" severity="secondary" text @click="deleteDialogVisible = false" />
				<Button label="Eliminar" severity="danger" :loading="saving" @click="deleteItem" />
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

const { isDark } = useDark();
const { tablePt } = useTablePt();

const sucursales        = ref([])
const loading           = ref(false)
const saving            = ref(false)
const dialogVisible      = ref(false)
const deleteDialogVisible = ref(false)
const editingItem        = ref(null)
const deletingItem       = ref(null)
const form = reactive({ nombre: '', direccion: '', telefono: '', ciudad: '' })

// GET
const fetchSucursales = async () => {
    loading.value = true
    const { data, error } = await supabase.from('sucursales').select('*').order('created_at')
    if (!error) sucursales.value = data
    loading.value = false
}

// CREATE / UPDATE
const save = async () => {
    saving.value = true
    if (editingItem.value) {
        await supabase.from('sucursales').update({
            nombre: form.nombre, direccion: form.direccion,
            telefono: form.telefono, ciudad: form.ciudad
        }).eq('id', editingItem.value.id)
    } else {
        await supabase.from('sucursales').insert({
            nombre: form.nombre, direccion: form.direccion,
            telefono: form.telefono, ciudad: form.ciudad
        })
    }
    saving.value = false
    dialogVisible.value = false
    await fetchSucursales()
}

// DELETE
const deleteItem = async () => {
    saving.value = true
    await supabase.from('sucursales').delete().eq('id', deletingItem.value.id)
    saving.value = false
    deleteDialogVisible.value = false
    await fetchSucursales()
}

const openDialog = (item = null) => {
    editingItem.value = item
    Object.assign(form, item ?? { nombre: '', direccion: '', telefono: '', ciudad: '' })
    dialogVisible.value = true
}

const confirmDelete = (item) => {
    deletingItem.value = item
    deleteDialogVisible.value = true
}

onMounted(fetchSucursales)
</script>