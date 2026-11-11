import type { StudentFormData, CreateStudentRequest, UpdateStudentRequest } from '@/types/student';

function checkLength(value: string, label: string): void {
    if (value.length < 2 || value.length > 50) {
        throw new Error(`${label}: должно быть от 2 до 50 символов`);
    }
}

function parseNumber(value: number | '', label: string, max: number): number | null {
    if (value === '') return null;

    if (!Number.isInteger(value) || value < 1 || value > max) {
        throw new Error(`${label}: целое число от 1 до ${max}`);
    }

    return value;
}

export function buildStudentData(form: StudentFormData): CreateStudentRequest {
    const surname = form.surname.trim();
    const name = form.name.trim();
    const patronymic = form.patronymic.trim() || null;
    const group = form.group.trim();
    const isuId = form.isuId.trim();
    const moveInDate = form.moveInDate || null;

    checkLength(surname, 'Фамилия');
    checkLength(name, 'Имя');

    if (patronymic !== null) {
        checkLength(patronymic, 'Отчество');
    }

    const groupTemplate = /^[A-Z][0-9]{4}$/;
    const isuTemplate = /^[1-9][0-9]{5}$/;

    if (!groupTemplate.test(group)) {
        throw new Error('Группа должна иметь формат W1234');
    }

    if (!isuTemplate.test(isuId)) {
        throw new Error('ИСУ ID: 6 цифр, первая — не ноль');
    }

    const now = new Date();
    const today = [
        now.getFullYear(),
        String(now.getMonth() + 1).padStart(2, '0'),
        String(now.getDate()).padStart(2, '0'),
    ].join('-');

    if (moveInDate !== null && (moveInDate < '2000-01-01' || moveInDate > today)) {
        throw new Error('Дата заселения: от 01.01.2000 до сегодняшнего дня');
    }

    return {
        surname,
        name,
        patronymic,
        group,
        isuId,
        dormitoryNumber: parseNumber(form.dormitoryNumber, 'Номер общежития', 100),
        room: parseNumber(form.room, 'Комната', 1000),
        moveInDate,
        foreigner: form.foreigner,
        notes: form.notes.trim() || null,
    };
}

export function getStudentChanges(
    current: CreateStudentRequest,
    original: CreateStudentRequest,
): UpdateStudentRequest {
    const changes: UpdateStudentRequest = {};

    function compareField<T extends keyof CreateStudentRequest>(key: T): void {
        if (current[key] !== original[key]) {
            changes[key] = current[key];
        }
    }

    compareField('surname');
    compareField('name');
    compareField('patronymic');
    compareField('group');
    compareField('isuId');
    compareField('dormitoryNumber');
    compareField('room');
    compareField('moveInDate');
    compareField('foreigner');
    compareField('notes');

    return changes;
}
