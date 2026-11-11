import { Subject, catchError, map, of, startWith, switchMap } from 'rxjs';
import { getStudents } from '@/api/students';
import type { StudentsQuery } from '@/types/filterParams';
import type { StudentsPage } from '@/types/student';

type StudentsState =
    | { status: 'loading' }
    | { status: 'success'; data: StudentsPage }
    | { status: 'error'; message: string };

function getStudentsState(query: StudentsQuery) {
    return of(query).pipe(
        switchMap((params) => getStudents(params)),

        map((data): StudentsState => ({
            status: 'success',
            data,
        })),

        catchError((error: unknown) =>
            of<StudentsState>({
                status: 'error',
                message: error instanceof Error ? error.message : 'Не удалось загрузить студентов',
            }),
        ),

        startWith<StudentsState>({
            status: 'loading',
        }),
    );
}

export function createStudentsStream() {
    const requests$ = new Subject<StudentsQuery>();

    const state$ = requests$.pipe(switchMap((query) => getStudentsState(query)));

    function load(query: StudentsQuery): void {
        requests$.next(query);
    }

    return { state$, load };
}
