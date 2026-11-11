import { filter, interval, map, merge } from 'rxjs';
import { studentChanges$ } from './studentChanges';

export function createStudentRefreshStream(canRefresh: () => boolean) {
    const timer$ = interval(30000).pipe(
        filter(() => !document.hidden && canRefresh()),
        map(() => undefined),
    );

    return merge(timer$, studentChanges$);
}
