<script setup lang="ts">
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';
import { getStudentById } from '@/api/students';
import type { Student } from '@/types/student';
import { useUserStore } from '@/stores/user';

const route = useRoute();
const userStore = useUserStore();

const student = ref<Student | null>(null);
const isLoading = ref(false);
const errorMessage = ref('');

async function loadStudent(): Promise<void> {
    student.value = null;
    errorMessage.value = '';

    const rawId = route.params.id;
    const idTemplate = /^[1-9]\d*$/;

    if (typeof rawId !== 'string' || !idTemplate.test(rawId)) {
        errorMessage.value = 'Некорректный ID студента';
        return;
    }

    const id = Number(rawId);

    if (!Number.isSafeInteger(id)) {
        errorMessage.value = 'Некорректный ID студента';
        return;
    }

    isLoading.value = true;

    try {
        student.value = await getStudentById(id);
    } catch (error: unknown) {
        errorMessage.value =
            error instanceof Error ? error.message : 'Не удалось загрузить студента';
    } finally {
        isLoading.value = false;
    }
}

function displayValue(value: string | number | null): string {
    if (value === null || String(value).trim() === '') {
        return '—';
    }

    return String(value);
}

watch(() => route.params.id, loadStudent, { immediate: true });
</script>

<template>
    <section>
        <h1>Досье студента</h1>

        <nav class="buttons-container" aria-label="Навигация карточки">
            <RouterLink to="/students" class="buttons"> К списку студентов </RouterLink>
            <RouterLink
                v-if="userStore.isAdmin && student"
                :to="`/students/${student.id}/edit`"
                class="buttons"
            >
                Изменить данные
            </RouterLink>
        </nav>

        <ErrorMessage :error-message="errorMessage" />

        <p v-if="isLoading" role="status">Загружаем студента…</p>

        <div v-else-if="student" class="student-card">
            <h2 id="student-full-name">
                {{ student.surname }}
                {{ student.name }}
                {{ student.patronymic ?? '' }}
            </h2>

            <dl class="student-info">
                <div class="info-row">
                    <dt>Группа:</dt>
                    <dd>{{ displayValue(student.group) }}</dd>
                </div>

                <div class="info-row">
                    <dt>ИСУ ID:</dt>
                    <dd>{{ displayValue(student.isuId) }}</dd>
                </div>

                <div class="info-row">
                    <dt>Номер общежития:</dt>
                    <dd>{{ displayValue(student.dormitoryNumber) }}</dd>
                </div>

                <div class="info-row">
                    <dt>Комната:</dt>
                    <dd>{{ displayValue(student.room) }}</dd>
                </div>

                <div class="info-row">
                    <dt>Дата заселения:</dt>
                    <dd>{{ displayValue(student.moveInDate) }}</dd>
                </div>

                <div class="info-row">
                    <dt>Иностранец:</dt>
                    <dd>{{ student.foreigner ? 'Да' : 'Нет' }}</dd>
                </div>

                <div class="info-row">
                    <dt>Заметки:</dt>
                    <dd id="notes">{{ displayValue(student.notes) }}</dd>
                </div>
            </dl>
        </div>
    </section>
</template>

<style scoped>
#student-full-name {
    text-align: center;
    margin-bottom: 1.25rem;
    margin-top: 0;
}

#notes {
    white-space: pre-wrap;
    overflow-wrap: anywhere;
}

dd {
    margin-bottom: 1.25rem;
}
</style>
