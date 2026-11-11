import { refresh, getCurrentUser } from '@/api/auth';
import { useUserStore } from '@/stores/user';

export async function restoreSession(): Promise<void> {
    const userStore = useUserStore();
    userStore.clearUser();
    const restored = await refresh();

    if (!restored) return;

    const user = await getCurrentUser();
    userStore.setUser(user);
}
