<script setup lang="ts">
defineProps<{
    currentPage: number;
    totalPages: number;
    isLoading: boolean;
}>();

const emit = defineEmits<{
    change: [page: number];
}>();
</script>

<template>
    <nav class="pagination" aria-label="Страницы списка студентов">
        <button
            id="prev-page"
            class="buttons"
            type="button"
            :disabled="isLoading || totalPages === 0 || currentPage <= 1"
            @click="emit('change', currentPage - 1)"
        >
            Назад
        </button>

        <span id="page-info" aria-live="polite">
            Страница {{ totalPages === 0 ? 0 : currentPage }} из {{ totalPages }}
        </span>

        <button
            id="next-page"
            class="buttons"
            type="button"
            :disabled="isLoading || currentPage >= totalPages"
            @click="emit('change', currentPage + 1)"
        >
            Вперёд
        </button>
    </nav>
</template>

<style scoped>
.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    margin: 1rem auto;
}

#page-info {
    font-weight: 600;
    padding: 0.25em 0.7em;
    background: var(--color-page-info-background);
    border-radius: 0.5rem;
}
</style>
