<script setup lang="ts">
import { ref } from 'vue';
import { RouterLink, useRouter } from 'vue-router';
import { useUserStore } from '@/stores/user';
import { logout } from '@/api/auth';
import ErrorMessage from './ErrorMessage.vue';

const userStore = useUserStore();
const router = useRouter();

const isLoggingOut = ref(false);
const errorMessage = ref('');

async function submitLogout(): Promise<void> {
    if (isLoggingOut.value) return;

    errorMessage.value = '';
    isLoggingOut.value = true;

    try {
        await logout();
        userStore.clearUser();
        await router.replace('/login');
    } catch (error: unknown) {
        errorMessage.value =
            error instanceof Error ? error.message : 'Не удалось выйти из аккаунта';
    } finally {
        isLoggingOut.value = false;
    }
}
</script>

<template>
    <header class="app-header">
        <RouterLink to="/students" class="app-title"> Управление студентами </RouterLink>

        <details v-if="userStore.user" id="user-menu" class="user-menu">
            <summary>
                <span aria-hidden="true">👤</span>
                <span id="menu-username">{{ userStore.user.username }}</span>
            </summary>

            <nav class="user-menu-actions" aria-label="Меню пользователя">
                <RouterLink to="/profile" class="buttons">Мой профиль</RouterLink>
                <button
                    id="logout-button"
                    type="button"
                    class="buttons"
                    :disabled="isLoggingOut"
                    @click="submitLogout"
                >
                    {{ isLoggingOut ? 'Выходим…' : 'Выйти' }}
                </button>
            </nav>
        </details>
    </header>
    <ErrorMessage :error-message="errorMessage" />
</template>

<style lang="css" scoped>
.app-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 24px;
    padding: 16px 24px;
    border-bottom: 1px solid #ccc;
}

.app-title {
    font-size: 20px;
    font-weight: bold;
    color: inherit;
    text-decoration: none;
}

nav a:hover {
    text-decoration: underline;
}

.user-menu {
    position: relative;
    top: auto;
    right: auto;
    margin-left: auto;
    min-width: 0;
    z-index: 10;
}

.user-menu summary {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    max-width: 15rem;
    padding: 0.5rem;
    background-color: var(--color-filter-sort-panel);
    border: 1px solid var(--color-student-info-border);
    border-radius: 0.5rem;
    cursor: pointer;
    list-style: none;
}

.user-menu summary::-webkit-details-marker {
    display: none;
}

#menu-username {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.user-menu-actions {
    position: absolute;
    right: 0;
    min-width: 12rem;
    margin-top: 0.5rem;
    padding: 0.5rem;
    background-color: var(--color-student-info-back);
    border: 1px solid var(--color-student-info-border);
    border-radius: 0.5rem;
}

[hidden] {
    display: none !important;
}

.user-menu-actions .buttons {
    width: calc(100% - 0.625rem);
}

@media (max-width: 1000px) {
    .user-menu {
        position: relative;
        top: auto;
        right: auto;
        width: fit-content;
        margin: 0 1rem 1rem auto;
    }
}
</style>
