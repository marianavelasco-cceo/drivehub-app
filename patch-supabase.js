const { readFileSync, writeFileSync } = require('fs');

const replaceScript = (filePath, newScript) => {
  const text = readFileSync(filePath, 'utf8');
  const start = text.indexOf('<script setup>');
  const end = text.indexOf('</script>', start);
  if (start === -1 || end === -1) {
    throw new Error('No script block found in ' + filePath);
  }
  const result = text.slice(0, start) + newScript + text.slice(end + '</script>'.length);
  writeFileSync(filePath, result, 'utf8');
};

const newCars = `<script setup>
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
const carros = ref([])
const loading = ref(false)
const saving = ref(false)
const dialogVisible = ref(false)
const deleteDialogVisible = ref(false)
const editingItem = ref(null)
const deletingItem = ref(null)
const form = reactive({ marca: '', modelo: '', anio: '', precio: '', estado: '', sucursal: '' })

const estadoClass = (estado) => ({
	'bg-green-900 text-green-400':  estado === 'Disponible',
	'bg-gray-700  text-gray-300':   estado === 'Vendido',
	'bg-yellow-900 text-yellow-400': estado === 'Reservado',
})

const fetchSucursales = async () => {
	const { data, error } = await supabase.from('sucursales').select('id,nombre').order('created_at')
	if (error) {
		console.error('Error al cargar sucursales:', error)
		return
	}
	sucursalesOpts.value = (data ?? []).map(item => ({ label: item.nombre, value: item.nombre }))
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
		sucursal: form.sucursal,
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
	Object.assign(form, item ?? { marca: '', modelo: '', anio: '', precio: '', estado: '', sucursal: '' })
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
</script>`;

const newPersonal = `<script setup>
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
const personal = ref([])
const loading = ref(false)
const saving = ref(false)
const dialogVisible = ref(false)
const deleteDialogVisible = ref(false)
const editingItem = ref(null)
const deletingItem = ref(null)
const form = reactive({ nombre: '', cargo: '', email: '', sucursal: '' })

const fetchSucursales = async () => {
	const { data, error } = await supabase.from('sucursales').select('id,nombre').order('created_at')
	if (error) {
		console.error('Error al cargar sucursales:', error)
		return
	}
	sucursalesOpts.value = (data ?? []).map(item => ({ label: item.nombre, value: item.nombre }))
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
		sucursal: form.sucursal,
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

const deleteItem = async () => {
	saving.value = true
	await supabase.from('personal').delete().eq('id', deletingItem.value.id)
	deleteDialogVisible.value = false
	saving.value = false
	await fetchPersonal()
}

const openDialog = (item = null) => {
	editingItem.value = item
	Object.assign(form, item ?? { nombre: '', cargo: '', email: '', sucursal: '' })
	dialogVisible.value = true
}

const confirmDelete = (item) => {
	deletingItem.value = item
	deleteDialogVisible.value = true
}

onMounted(async () => {
	await fetchSucursales()
	await fetchPersonal()
})
</script>`;

replaceScript('src/views/cars/CarsView.vue', newCars);
replaceScript('src/views/people/PersonalView.vue', newPersonal);
console.log('Updated CarsView.vue and PersonalView.vue');
