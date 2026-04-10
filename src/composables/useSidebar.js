import { ref } from "vue";

const isExpanded = ref(true);

const toggleExpanded = () => { isExpanded.value = !isExpanded.value; };

export function useSidebar() {
    return { isExpanded, toggleExpanded };
}