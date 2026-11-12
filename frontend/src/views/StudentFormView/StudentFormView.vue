<script setup lang="ts">
import { computed, reactive, ref, watch } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import type { Student, StudentFormData, CreateStudentRequest } from '@/types/student';
import { createStudent, editStudent, getStudentById } from '@/api/students';
import { buildStudentData, getStudentChanges } from '@/validation/studentForm';
import ErrorMessage from '@/components/ErrorMessage/ErrorMessage.vue';
import { notifyStudentsChanged } from '@/streams/studentChanges';

const initialForm: StudentFormData = {
    surname: '',
    name: '',
    patronymic: '',
    group: '',
    isuId: '',
    dormitoryNumber: '',
    room: '',
    moveInDate: '',
    foreigner: false,
    notes: '',
};

const form = reactive({ ...initialForm });

const now = new Date();
const today = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
].join('-');

const router = useRouter();
const route = useRoute();

const errorMessage = ref('');
const isSubmitting = ref(false);

const isEditRoute = computed(() => route.params.id !== undefined);
const isLoading = ref(false);
const isFormReady = ref(false);
const originalStudent = ref<Student | null>(null);

async function loadForm(): Promise<void> {
    errorMessage.value = '';
    isFormReady.value = false;
    originalStudent.value = null;
    Object.assign(form, initialForm);

    if (!isEditRoute.value) {
        isFormReady.value = true;
        return;
    }

    const rawId = route.params.id;
    const idTemplate = /^[1-9]\d*$/;

    if (
        typeof rawId !== 'string' ||
        !idTemplate.test(rawId) ||
        !Number.isSafeInteger(Number(rawId))
    ) {
        errorMessage.value = 'Некорректный ID студента';
        return;
    }

    isLoading.value = true;

    try {
        const student = await getStudentById(Number(rawId));
        originalStudent.value = student;

        Object.assign(form, {
            surname: student.surname,
            name: student.name,
            patronymic: student.patronymic ?? '',
            group: student.group,
            isuId: student.isuId,
            dormitoryNumber: student.dormitoryNumber ?? '',
            room: student.room ?? '',
            moveInDate: student.moveInDate ?? '',
            foreigner: student.foreigner,
            notes: student.notes ?? '',
        });

        isFormReady.value = true;
    } catch (error: unknown) {
        errorMessage.value =
            error instanceof Error ? error.message : 'Не удалось загрузить студента';
    } finally {
        isLoading.value = false;
    }
}

watch(() => route.params.id, loadForm, { immediate: true });

async function submitForm(): Promise<void> {
    if (isSubmitting.value || !isFormReady.value) return;

    errorMessage.value = '';
    isSubmitting.value = true;

    try {
        const data: CreateStudentRequest = buildStudentData(form);

        if (isEditRoute.value) {
            const original = originalStudent.value;

            if (!original) {
                throw new Error('Исходные данные студента не загружены');
            }

            const changes = getStudentChanges(data, original);

            if (Object.keys(changes).length > 0) {
                await editStudent(original.id, changes);
                notifyStudentsChanged();
            }

            await router.replace(`/students/${original.id}`);
        } else {
            const student = await createStudent(data);
            notifyStudentsChanged();
            await router.replace(`/students/${student.id}`);
        }
    } catch (error: unknown) {
        errorMessage.value =
            error instanceof Error ? error.message : 'Не удалось сохранитт студента';
    } finally {
        isSubmitting.value = false;
    }
}
</script>

<template>
    <section>
        <h1>{{ isEditRoute ? 'Редактирование студента' : 'Добавление студента' }}</h1>

        <ErrorMessage :error-message="errorMessage" />

        <div v-if="!isLoading && !isFormReady && errorMessage" class="buttons-container">
            <RouterLink to="/students" class="buttons"> К списку студентов </RouterLink>
        </div>

        <h1 v-if="isLoading" role="status">Загрузка данных студента</h1>

        <form
            v-if="isFormReady"
            id="student-form"
            class="student-card"
            @submit.prevent="submitForm"
        >
            <div class="form-row">
                <label for="surname">Фамилия <span class="required">*</span></label>
                <input
                    type="text"
                    id="surname"
                    name="surname"
                    v-model.trim="form.surname"
                    minlength="2"
                    maxlength="50"
                    placeholder="Иванов"
                    :disabled="isSubmitting"
                    required
                />
            </div>
            <div class="form-row">
                <label for="name">Имя <span class="required">*</span></label>
                <input
                    type="text"
                    id="name"
                    name="name"
                    v-model.trim="form.name"
                    minlength="2"
                    maxlength="50"
                    placeholder="Иван"
                    :disabled="isSubmitting"
                    required
                />
            </div>
            <div class="form-row">
                <label for="patronymic">Отчество</label>
                <input
                    type="text"
                    id="patronymic"
                    name="patronymic"
                    v-model.trim="form.patronymic"
                    minlength="2"
                    maxlength="50"
                    placeholder="Иванович"
                    :disabled="isSubmitting"
                />
            </div>
            <div class="form-row">
                <label for="group">Группа <span class="required">*</span></label>
                <input
                    type="text"
                    id="group"
                    name="group"
                    v-model.trim="form.group"
                    pattern="[A-Z][0-9]{4}"
                    placeholder="W1234"
                    :disabled="isSubmitting"
                    required
                />
            </div>
            <div class="form-row">
                <label for="isuId">ИСУ id <span class="required">*</span></label>
                <input
                    type="text"
                    id="isuId"
                    name="isuId"
                    v-model.trim="form.isuId"
                    pattern="[1-9][0-9]{5}"
                    placeholder="123456"
                    oninvalid="this.setCustomValidity('ИСУ id должен содержать 6 цифр')"
                    oninput="this.setCustomValidity('')"
                    :disabled="isSubmitting"
                    required
                />
            </div>
            <div class="form-row">
                <label for="dormitoryNumber">Номер общежития</label>
                <input
                    type="number"
                    id="dormitoryNumber"
                    name="dormitoryNumber"
                    v-model.number="form.dormitoryNumber"
                    min="1"
                    max="100"
                    step="1"
                    :disabled="isSubmitting"
                />
            </div>
            <div class="form-row">
                <label for="room">Комната</label>
                <input
                    type="number"
                    id="room"
                    name="room"
                    v-model.number="form.room"
                    min="1"
                    max="1000"
                    step="1"
                    :disabled="isSubmitting"
                />
            </div>
            <div class="form-row">
                <label for="moveInDate">Дата заселения</label>
                <input
                    type="date"
                    id="moveInDate"
                    name="moveInDate"
                    v-model="form.moveInDate"
                    min="2000-01-01"
                    :max="today"
                    :disabled="isSubmitting"
                />
            </div>
            <div class="form-row">
                <label for="foreigner">Иностранец</label>
                <input
                    type="checkbox"
                    id="foreigner"
                    name="foreigner"
                    v-model="form.foreigner"
                    :disabled="isSubmitting"
                />
            </div>
            <div class="form-row">
                <label for="notes">Заметки</label>
                <textarea
                    id="notes"
                    name="notes"
                    v-model="form.notes"
                    :disabled="isSubmitting"
                ></textarea>
            </div>
            <div class="buttons-container">
                <button type="submit" class="buttons accept-button" :disabled="isSubmitting">
                    {{ isEditRoute ? 'Применить изменения' : 'Добавить студента' }}
                </button>

                <RouterLink to="/students" class="buttons delete-button">
                    Отменить изменения
                </RouterLink>
            </div>
        </form>
    </section>
</template>
