<script setup lang="ts">
import type { Student } from '@/types/student';

const props = defineProps<{
    students: Student[];
    rowOffset: number;
    selectedStudentId: number | null;
}>();

const emit = defineEmits<{
    open: [id: number];
    select: [id: number | null];
}>();

function selectStudent(id: number): void {
    emit('select', props.selectedStudentId === id ? null : id);
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

<style scoped src="./StudentTable.css"></style>
