import type { StudentFilterForm, StudentFiltersParams } from '@/types/filterParams';

function splitValues(value: string): string[] {
    return value
        .split(',')
        .map((item) => item.trim())
        .filter((item) => item !== '');
}

function parseNumbers(value: string, max: number): number[] {
    const num = /^\d+$/;
    return splitValues(value).map((item) => {
        if (!num.test(item)) {
            throw new Error(`Ожидается целое число: ${item}`);
        }

        const number = Number(item);

        if (!Number.isInteger(number) || number < 1 || number > max) {
            throw new Error(`Число должно быть от 1 до ${max}: ${item}`);
        }

        return number;
    });
}

export function buildStudentFilters(form: StudentFilterForm): StudentFiltersParams {
    const group = splitValues(form.groups);
    const groupTemplate = /^[A-Z]\d{4}$/;

    if (group.some((value) => !groupTemplate.test(value))) {
        throw new Error('Группа должна иметь формат "W1234"');
    }

    if (form.moveInDateFrom && form.moveInDateTo && form.moveInDateFrom > form.moveInDateTo) {
        throw new Error('Начальная дата не должна быть позже конечной');
    }

    if (Boolean(form.moveInDateFrom) !== Boolean(form.moveInDateTo)) {
        throw new Error('Укажите обе даты диапазона или оставьте обе пустыми');
    }

    const dormitoryNumber = parseNumbers(form.dormitories, 100);
    const room = parseNumbers(form.rooms, 1000);

    const filters: StudentFiltersParams = {
        sortBy: form.sortBy,
        order: form.order,
    };

    const surname = form.surname.trim();
    const name = form.name.trim();
    const patronymic = form.patronymic.trim();
    const isuId = form.isuId.trim();

    if (surname) filters.surname = surname;
    if (name) filters.name = name;
    if (patronymic) filters.patronymic = patronymic;
    if (isuId) filters.isuId = isuId;

    if (group.length) filters.group = group;
    if (dormitoryNumber.length) filters.dormitoryNumber = dormitoryNumber;
    if (room.length) filters.room = room;

    if (form.moveInDateFrom) {
        filters.moveInDateFrom = form.moveInDateFrom;
    }

    if (form.moveInDateTo) {
        filters.moveInDateTo = form.moveInDateTo;
    }

    if (form.isForeigner !== '') {
        filters.foreigner = form.isForeigner === 'true';
    }

    return filters;
}
