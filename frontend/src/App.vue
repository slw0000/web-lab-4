<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { RouterView } from 'vue-router';
import AppHeader from './components/AppHeader.vue';
import AppFooter from './components/AppFooter.vue';
import ErrorMessage from './components/ErrorMessage.vue';
import { restoreSession } from './auth/restoreSession';

const isSessionRestoring = ref(true);
const sessionError = ref('');

onMounted(async () => {
    try {
        await restoreSession();
    } catch (error: unknown) {
        sessionError.value =
            error instanceof Error ? error.message : 'Не удалось восстановить сессию';
    } finally {
        isSessionRestoring.value = false;
    }
});
</script>

<template>
    <AppHeader />

    <main>
        <p v-if="isSessionRestoring" role="status">Идёт восстановление сессии</p>

        <ErrorMessage v-else-if="sessionError" :error-message="sessionError" />

        <RouterView v-else />
    </main>

    <AppFooter />
</template>

<style>
body {
    margin: 0;
}

#app {
    min-height: 100vh;
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
}

#app > main {
    flex: 1;
}
</style>
