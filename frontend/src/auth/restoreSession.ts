import { refresh, getCurrentUser } from '@/api/auth';
import { ref } from 'vue';
import { useUserStore } from '@/stores/user';

let sessionPromise: Promise<void> | null = null;

export const isSessionRestoring = ref(false);
export const sessionError = ref('');

async function loadSession(): Promise<void> {
    isSessionRestoring.value = true;
    sessionError.value = '';
    useUserStore().clearUser();

    try {
        const restored = await refresh();
        if (!restored) return;

        const user = await getCurrentUser();
        useUserStore().setUser(user);
    } catch (error: unknown) {
        sessionError.value =
            error instanceof Error ? error.message : 'Не удалось восстановить сессию';
        throw error;
    } finally {
        isSessionRestoring.value = false;
    }
}

export function restoreSession(): Promise<void> {
    if (!sessionPromise) {
        sessionPromise = loadSession();
    }

    return sessionPromise;
}

export function resetSessionRestore(): void {
    sessionPromise = null;
    sessionError.value = '';
}
