<script setup lang="ts">
import { reactive, ref } from 'vue';
import type { StudentFilterForm, StudentFiltersParams } from '@/types/filterParams';
import { buildStudentFilters } from '@/utils/studentFilters';
import ErrorMessage from './ErrorMessage.vue';

function createInitialForm(): StudentFilterForm {
    return {
        surname: '',
        name: '',
        patronymic: '',
        isuId: '',
        groups: '',
        dormitories: '',
        rooms: '',
        moveInDateFrom: '',
        moveInDateTo: '',
        isForeigner: '',
        sortBy: 'id',
        order: 'up',
    };
}

const form = reactive(createInitialForm());
const errorMessage = ref('');
const emit = defineEmits<{
    apply: [filters: StudentFiltersParams];
}>();

function applyFilters(): void {
    errorMessage.value = '';

    try {
        const filters = buildStudentFilters(form);
        emit('apply', filters);
    } catch (error: unknown) {
        errorMessage.value =
            error instanceof Error ? error.message : 'Не удалось применить фильтры';
    }
}

function resetFilters(): void {
    Object.assign(form, createInitialForm());
    applyFilters();
}
</script>

<template>
    <details class="filter-panel">
        <summary class="filter-panel-toggle">Фильтры и сортировка</summary>
        <ErrorMessage :error-message="errorMessage" />
        <form
            id="students-query-form"
            class="query-panel"
            @submit.prevent="applyFilters"
            @reset.prevent="resetFilters"
        >
            <fieldset class="filter-fields">
                <legend>Фильтры студентов</legend>

                <div class="filter-block">
                    <label class="filter-field">
                        <span>ИСУ ID</span>
                        <input
                            type="search"
                            name="isuId"
                            v-model.trim="form.isuId"
                            inputmode="numeric"
                            maxlength="6"
                            pattern="[0-9]{6}"
                            placeholder="Например, 123456"
                            oninvalid="this.setCustomValidity('ИСУ id должен содержать 6 цифр')"
                            oninput="this.setCustomValidity('')"
                        />
                    </label>

                    <label class="filter-field">
                        <span>Фамилия</span>
                        <input
                            type="search"
                            name="surname"
                            v-model.trim="form.surname"
                            placeholder="Например, Иванов"
                            minlength="2"
                            maxlength="50"
                            pattern="[\p{L}]+"
                            oninvalid="
                                this.setCustomValidity(
                                    'Введите фамилию, без пробелов и других символов',
                                )
                            "
                            oninput="this.setCustomValidity('')"
                        />
                    </label>

                    <label class="filter-field">
                        <span>Имя</span>
                        <input
                            type="search"
                            name="name"
                            v-model.trim="form.name"
                            placeholder="Например, Иван"
                            minlength="2"
                            maxlength="50"
                            pattern="[\p{L}]+"
                            oninvalid="
                                this.setCustomValidity(
                                    'Введите имя, без пробелов и других символов',
                                )
                            "
                            oninput="this.setCustomValidity('')"
                        />
                    </label>

                    <label class="filter-field">
                        <span>Отчество</span>
                        <input
                            type="search"
                            name="patronymic"
                            v-model.trim="form.patronymic"
                            placeholder="Например, Иванович"
                            minlength="2"
                            maxlength="50"
                            pattern="[\p{L}]+"
                            oninvalid="
                                this.setCustomValidity(
                                    'Введите отчество, без пробелов и других символов',
                                )
                            "
                            oninput="this.setCustomValidity('')"
                        />
                    </label>

                    <label class="filter-field">
                        <span>Группы — через запятую</span>
                        <input
                            type="text"
                            name="group"
                            placeholder="Q1234, Q1235"
                            v-model="form.groups"
                        />
                    </label>

                    <label class="filter-field">
                        <span>Общежития — через запятую</span>
                        <input
                            type="text"
                            name="dormitoryNumber"
                            v-model="form.dormitories"
                            inputmode="numeric"
                            placeholder="8, 9"
                        />
                    </label>

                    <label class="filter-field">
                        <span>Комнаты — через запятую</span>
                        <input
                            type="text"
                            name="room"
                            inputmode="numeric"
                            placeholder="415, 416"
                            v-model="form.rooms"
                        />
                    </label>

                    <label class="filter-field">
                        <span>Дата заселения от</span>
                        <input type="date" name="moveInDateFrom" v-model="form.moveInDateFrom" />
                    </label>

                    <label class="filter-field">
                        <span>Дата заселения до</span>
                        <input type="date" name="moveInDateTo" v-model="form.moveInDateTo" />
                    </label>

                    <label class="filter-field">
                        <span>Иностранец</span>
                        <select name="foreigner" v-model="form.isForeigner">
                            <option value="">Любой</option>
                            <option value="true">Да</option>
                            <option value="false">Нет</option>
                        </select>
                    </label>
                </div>
            </fieldset>

            <div class="sort-controls">
                <label class="filter-field">
                    <span>Сортировать по</span>
                    <select id="sortBy" name="sortBy" v-model="form.sortBy">
                        <option value="id">Номеру</option>
                        <option value="surname">Фамилии</option>
                        <option value="name">Имени</option>
                        <option value="patronymic">Отчеству</option>
                        <option value="group">Группе</option>
                        <option value="isuId">ИСУ ID</option>
                        <option value="dormitoryNumber">Общежитию</option>
                        <option value="room">Комнате</option>
                        <option value="moveInDate">Дате заселения</option>
                        <option value="foreigner">Иностранец ли</option>
                    </select>
                </label>

                <label class="filter-field">
                    <span>Порядок</span>
                    <select id="sort-order" name="order" v-model="form.order">
                        <option value="up">По возрастанию</option>
                        <option value="down">По убыванию</option>
                    </select>
                </label>

                <button type="submit" class="buttons">Применить</button>
                <button type="reset" class="buttons">Сбросить</button>
            </div>
        </form>
    </details>
</template>

<style scoped>
.query-panel {
    max-width: 70rem;
    margin: 1rem auto 1.5rem;
    padding: 1rem;
    background: var(--color-filter-sort-panel);
    border: 1px solid #ccc;
    border-radius: 0.75rem;
}

.filter-fields {
    margin-bottom: 0.75rem;
    padding: 0;
    border: 0;
    font-size: 1.2rem;
    font-weight: 700;
}

legend {
    text-align: center;
    font-size: 1.5rem;
    padding-bottom: 0.75rem;
}

.filter-field {
    display: grid;
    gap: 0.35rem;
    font-weight: 600;
}

.filter-block {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(12rem, 1fr));
    gap: 1rem;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #ccc;
}

.filter-field input,
.filter-field select {
    box-sizing: border-box;
    width: 100%;
    min-width: 0;
    min-height: 2.5rem;
    padding: 0.4rem 0.6rem;
    border: 1px solid #888;
    border-radius: 0.4rem;
    font: inherit;
    font-weight: 400;
}

.sort-controls {
    display: flex;
    flex-wrap: wrap;
    align-items: end;
    gap: 0.75rem 1rem;
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #ccc;
}

.filter-panel {
    max-width: 70rem;
    margin: 1rem auto 1.5rem;
}

.filter-panel-toggle {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1rem;
    border: 1px solid #aaa;
    border-radius: 0.5rem;
    background-color: var(--color-filter-sort-panel);
    font-weight: 600;
    cursor: pointer;
    list-style: none;
}

.filter-panel-toggle::-webkit-details-marker {
    display: none;
}

.filter-panel-toggle::after {
    content: '+';
    font-size: 1.3rem;
}

.filter-panel[open] .filter-panel-toggle::after {
    content: '−';
}

@media (max-width: 600px) {
    .sort-controls {
        width: 100%;
        align-items: stretch;
        flex-direction: column;
    }

    .sort-controls select {
        width: 100%;
    }
}
</style>
