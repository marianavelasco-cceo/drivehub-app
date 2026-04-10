import { ref, watch } from "vue";

const isDark = ref(localStorage.getItem("theme") === "dark");

watch(isDark, (val) => {
    localStorage.setItem("theme", val ? "dark" : "light");
    document.documentElement.classList.toggle("dark", val);
}, { immediate: true });

const toggleDark = () => { isDark.value = !isDark.value; };

export function useDark() {
    return { isDark, toggleDark };
}