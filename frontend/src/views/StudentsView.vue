<script setup lang="ts">
import StudentTable from '../components/StudentTable.vue';
import StudentFilters from '../components/StudentFilters.vue';
import PaginationControls from '@/components/PaginationControls.vue';
import type { StudentFiltersParams } from '@/types/filterParams';
import type { Student } from '@/types/student';
import { onMounted, onUnmounted, ref } from 'vue';
import { deleteStudent } from '@/api/students';
import ErrorMessage from '@/components/ErrorMessage.vue';
import { useRouter, RouterLink } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { createStudentsStream } from '@/streams/students';
import { notifyStudentsChanged } from '@/streams/studentChanges';
import { createStudentRefreshStream } from '@/streams/studentRefresh';

onMounted(loadStudents);

const userStore = useUserStore();

const isLoading = ref(false);
const hasLoaded = ref(false);
const errorMessage = ref('');

const selectedStudentId = ref<number | null>(null);
const isDeleting = ref(false);

const students = ref<Student[]>([]);
const studentsCount = ref(0);

const currentPage = ref(1);
const totalPages = ref(0);
const pageSize = 10;

const currentFilters = ref<StudentFiltersParams>({
    sortBy: 'id',
    order: 'up',
});

const studentsStream = createStudentsStream();

const refreshSubscription = createStudentRefreshStream(
    () => !isLoading.value && !isDeleting.value,
).subscribe(() => {
    loadStudents();
});

const subscription = studentsStream.state$.subscribe((state) => {
    if (state.status === 'loading') {
        isLoading.value = true;
        errorMessage.value = '';
        selectedStudentId.value = null;
        return;
    }

    if (state.status === 'error') {
        isLoading.value = false;
        errorMessage.value = state.message;
        return;
    }

    const data = state.data;
    const lastPage = Math.max(1, data.totalPages ?? 0);

    if (currentPage.value > lastPage) {
        currentPage.value = lastPage;
        loadStudents();
        return;
    }

    students.value = data.students;
    studentsCount.value = data.studentsCount;
    totalPages.value = data.totalPages ?? 0;
    hasLoaded.value = true;
    isLoading.value = false;
});

onUnmounted(() => {
    subscription.unsubscribe();
    refreshSubscription.unsubscribe();
});

function applyFilters(filters: StudentFiltersParams): void {
    currentFilters.value = filters;
    currentPage.value = 1;
    loadStudents();
}

function changePage(page: number): void {
    if (isLoading.value) return;
    if (page < 1 || page > totalPages.value) return;
    if (page === currentPage.value) return;

    currentPage.value = page;
    loadStudents();
}

function loadStudents(): void {
    studentsStream.load({
        ...currentFilters.value,
        page: currentPage.value,
        limit: pageSize,
    });
}

function selectStudent(id: number | null): void {
    selectedStudentId.value = id;
}

function editSelectedStudent(): void {
    if (selectedStudentId.value === null) return;
    router.push(`/students/${selectedStudentId.value}/edit`);
}

async function deleteSelectedStudent(): Promise<void> {
    const id = selectedStudentId.value;

    if (id === null || !userStore.isAdmin || isLoading.value || isDeleting.value) {
        return;
    }

    if (!window.confirm('Удалить выбранного студента?')) return;

    errorMessage.value = '';
    isDeleting.value = true;

    try {
        await deleteStudent(id);
        notifyStudentsChanged();
        loadStudents();
    } catch (error: unknown) {
        errorMessage.value = error instanceof Error ? error.message : 'Не удалось удалить студента';
    } finally {
        isDeleting.value = false;
    }
}

const router = useRouter();

function openStudent(id: number): void {
    router.push(`/students/${id}`);
}
</script>

<template>
    <section class="students-page">
        <h1>Студенты</h1>

        <StudentFilters @apply="applyFilters" />

        <div v-if="userStore.isAdmin" class="buttons-container student-actions">
            <RouterLink to="/students/new" class="buttons accept-button">
                Добавить студента
            </RouterLink>
            <button
                type="button"
                class="buttons"
                :disabled="selectedStudentId === null || isLoading || isDeleting"
                @click="selectedStudentId !== null && openStudent(selectedStudentId)"
            >
                Досье
            </button>

            <button
                v-if="userStore.isAdmin"
                type="button"
                class="buttons"
                :disabled="selectedStudentId === null || isLoading || isDeleting"
                @click="editSelectedStudent"
            >
                Редактировать
            </button>

            <button
                v-if="userStore.isAdmin"
                type="button"
                class="buttons delete-button"
                :disabled="selectedStudentId === null || isLoading || isDeleting"
                @click="deleteSelectedStudent"
            >
                Удалить
            </button>
        </div>

        <ErrorMessage :error-message="errorMessage" />

        <h1 v-if="isLoading && !hasLoaded" role="status">Идет загрузка студентов</h1>

        <StudentTable
            :students="students"
            :row-offset="(currentPage - 1) * pageSize"
            :selected-student-id="selectedStudentId"
            @select="selectStudent"
            @open="openStudent"
            v-else-if="hasLoaded && !errorMessage"
        />

        <PaginationControls
            v-if="hasLoaded && !errorMessage"
            :current-page="currentPage"
            :total-pages="totalPages"
            :is-loading="isLoading"
            @change="changePage"
        />
    </section>
</template>

<style scoped>
.student-actions {
    margin: 1rem auto;
    gap: 0.25rem;
}
</style>
