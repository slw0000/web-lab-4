<script setup lang="ts">
import { ref } from 'vue';
import type { Student } from '@/types/student';

defineProps<{
    students: Student[];
    rowOffset: number;
}>();

const emit = defineEmits<{
    open: [id: number];
}>();

const selectedStudentId = ref<number | null>(null);

function selectStudent(id: number): void {
    selectedStudentId.value = selectedStudentId.value === id ? null : id;
}
</script>

<template>
    <div class="table-container">
        <table class="table">
            <thead>
                <tr>
                    <th scope="col">№</th>
                    <th scope="col">Фамилия</th>
                    <th scope="col">Имя</th>
                    <th scope="col">Отчество</th>
                    <th scope="col">Группа</th>
                    <th scope="col">ИСУ ID</th>
                </tr>
            </thead>

            <tbody>
                <tr
                    v-for="(student, index) in students"
                    :key="student.id"
                    :class="{ selected: selectedStudentId === student.id }"
                    @click="selectStudent(student.id)"
                    @dblclick="emit('open', student.id)"
                >
                    <td>{{ rowOffset + index + 1 }}</td>
                    <td>{{ student.surname }}</td>
                    <td>{{ student.name }}</td>
                    <td>{{ student.patronymic ?? '—' }}</td>
                    <td>{{ student.group }}</td>
                    <td>{{ student.isuId }}</td>
                </tr>

                <tr v-if="students.length === 0">
                    <td colspan="6">Студенты не найдены</td>
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

.table tbody tr {
    cursor: pointer;
}
</style>
