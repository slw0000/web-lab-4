<script setup lang="ts">
import { computed, ref } from 'vue'
import StudentTable from '../components/StudentTable.vue'
import type { Student } from '../types/student'

const students = ref<Student[]>([
    {
        id: 1,
        name: 'Иван',
        surname: 'Иванов',
        patronymic: 'Иванович',
        group: 'P3101',
        isuId: '123456',
        dormitoryNumber: 1,
        room: 101,
        moveInDate: '2026-09-01',
        foreigner: false,
        notes: null,
    },
    {
        id: 2,
        name: 'Анна',
        surname: 'Петрова',
        patronymic: null,
        group: 'P3102',
        isuId: '234567',
        dormitoryNumber: null,
        room: null,
        moveInDate: null,
        foreigner: false,
        notes: null,
    },
])

const searchQuery = ref('')

const filteredStudents = computed(() => {
    const query = searchQuery.value.trim().toLowerCase()

    return students.value.filter((student) => student.name.toLowerCase().includes(query))
})

function removeStudent(id: number) {
    students.value = students.value.filter((student) => student.id !== id)
}
</script>

<template>
    <section class="students-page">
        <h1>Студенты</h1>

        <p>Всего: {{ students.length }}</p>

        <label>
            Поиск по имени
            <input v-model="searchQuery" type="search" placeholder="Введите имя" />
        </label>

        <p>Найдено: {{ filteredStudents.length }} из {{ students.length }}</p>

        <StudentTable :students="filteredStudents" @remove="removeStudent" />
    </section>
</template>
