import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { login as loginRequest, getCurrentUser, logout as logoutRequest } from '@/api/auth';
import type { LoginRequest, User } from '@/types/auth';

export const useUserStore = defineStore('user', () => {
    const user = ref<User | null>(null);

    const isAuthenticated = computed(() => user.value !== null);
    const isAdmin = computed(() => user.value?.role === 'ADMIN');

    function setUser(value: User): void {
        user.value = value;
    }

    function clearUser(): void {
        user.value = null;
    }

    return {
        user,
        isAuthenticated,
        isAdmin,
        setUser,
        clearUser,
    };
});
