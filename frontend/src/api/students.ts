import { apiRequest } from './http';
import { errorHandler } from './errors';
import type { Student, StudentResponse, StudentsPage } from '@/types/student';
import type { StudentsQuery } from '@/types/filterParams';

const apiRoute = 'http://localhost:8080/api/students';

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
