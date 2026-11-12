import { apiRequest } from './http';
import { errorHandler } from './errors';
import type {
    Student,
    StudentResponse,
    StudentsPage,
    CreateStudentRequest,
    UpdateStudentRequest,
} from '@/types/student';
import type { StudentsQuery } from '@/types/filterParams';
import { config } from '@/config';

const apiRoute = `${config.apiBaseUrl}/students`;

export async function getAllStudentsFiltered(params: URLSearchParams): Promise<StudentsPage> {
    const response = await apiRequest(`${apiRoute}?${params.toString()}`, {
        method: 'GET',
    });

    if (!response.ok) {
        await errorHandler(response);
    }

    return response.json();
}

export async function getAllStudentsQuery(params: StudentsQuery): Promise<StudentsPage> {
    const response = await apiRequest(apiRoute, {
        method: 'QUERY',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
    });

    if (!response.ok) {
        await errorHandler(response);
    }

    return response.json();
}

export function getStudents(query: StudentsQuery): Promise<StudentsPage> {
    const useQuery =
        (query.group?.length ?? 0) > 1 ||
        (query.dormitoryNumber?.length ?? 0) > 1 ||
        (query.room?.length ?? 0) > 1;

    if (useQuery) {
        return getAllStudentsQuery(query);
    }

    const params = new URLSearchParams();

    for (const [key, value] of Object.entries(query)) {
        if (value === undefined) continue;

        const parameter = Array.isArray(value) ? value[0] : value;

        if (parameter !== undefined) {
            params.set(key, String(parameter));
        }
    }

    return getAllStudentsFiltered(params);
}

export async function getStudentById(id: number): Promise<Student> {
    const response = await apiRequest(`${apiRoute}/${id}`, {
        method: 'GET',
    });

    if (!response.ok) {
        await errorHandler(response);
    }

    const data: StudentResponse = await response.json();

    return data.student;
}

export async function createStudent(student: CreateStudentRequest): Promise<Student> {
    const response = await apiRequest(apiRoute, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(student),
    });

    if (!response.ok) {
        await errorHandler(response);
    }

    const data: StudentResponse = await response.json();
    return data.student;
}

export async function editStudent(
    id: number,
    changedFields: UpdateStudentRequest,
): Promise<Student> {
    const response = await apiRequest(`${apiRoute}/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(changedFields),
    });

    if (!response.ok) {
        await errorHandler(response);
    }

    const data: StudentResponse = await response.json();
    return data.student;
}

export async function deleteStudent(id: number): Promise<void> {
    const response = await apiRequest(`${apiRoute}/${id}`, {
        method: 'DELETE',
    });

    if (!response.ok) {
        await errorHandler(response);
    }
}
