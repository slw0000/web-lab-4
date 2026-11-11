<script setup lang="ts">
import type { Student } from '../types/student'

defineProps<{
    students: Student[]
}>()

const emit = defineEmits<{
    remove: [id: number]
}>()
</script>

<template>
    <div class="table-container">
        <table class="table">
            <thead>
                <tr>
                    <th scope="col">ID</th>
                    <th scope="col">Фамилия</th>
                    <th scope="col">Имя</th>
                    <th scope="col">Группа</th>
                    <th scope="col">Действия</th>
                </tr>
            </thead>

            <tbody>
                <tr v-for="student in students" :key="student.id">
                    <td>{{ student.id }}</td>
                    <td>{{ student.surname }}</td>
                    <td>{{ student.name }}</td>
                    <td>{{ student.group }}</td>
                    <td>
                        <button
                            type="button"
                            class="buttons delete-button"
                            @click="emit('remove', student.id)"
                        >
                            Удалить
                        </button>
                    </td>
                </tr>

                <tr v-if="students.length === 0">
                    <td colspan="5">Студенты не найдены</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style scoped>
.table-container {
    width: calc(100% - 2rem);
    max-width: 60rem;
    overflow-x: auto;
    margin: 0 auto;
    margin-bottom: 1.25rem;
    background: #fff;
}

.table {
    width: 100%;
    border-collapse: collapse;
}

.table th {
    font-weight: bold;
    background: var(--color-table-background);
    border: 1px solid black;
    padding: 0.3125rem;
}

.table td {
    border: 1px solid black;
    padding: 0.3125rem;
    background-color: var(--color-table-main-back);
}

.table .selected td {
    background-color: var(--color-table-selected-row);
}

@media (min-width: 1920px) {
    .table-container {
        max-width: 90rem;
    }
}
</style>
