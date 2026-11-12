import { filter, interval, map, merge } from 'rxjs';
import { studentChanges$ } from './studentChanges';
import { config } from '@/config';

export function createStudentRefreshStream(canRefresh: () => boolean) {
    const timer$ = interval(config.studentsRefreshMs).pipe(
        filter(() => !document.hidden && canRefresh()),
        map(() => undefined),
    );

    return merge(timer$, studentChanges$);
}
