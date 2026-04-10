import { computed } from "vue";
import { useDark } from "./useDark.js";

export function useTablePt() {
    const { isDark } = useDark();

    const tablePt = computed(() => ({
        root: { class: ['rounded-2xl overflow-hidden border', isDark.value ? 'border-gray-700' : 'border-gray-200'] },
        thead: { class: [isDark.value ? 'bg-gray-800' : 'bg-gray-50'] },
        headerRow: { class: ['text-sm font-medium', isDark.value ? 'text-gray-400' : 'text-gray-500'] },
        bodyRow: { class: ['border-t transition', isDark.value ? 'border-gray-700 bg-gray-900 hover:bg-gray-800 text-gray-200' : 'border-gray-100 bg-white hover:bg-gray-50 text-gray-800'] },
        column: { headerCell: { class: 'px-4 py-3' }, bodyCell: { class: 'px-4 py-3 text-sm' } },
    }));

    return { tablePt };
}