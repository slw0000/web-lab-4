<script setup lang="ts">
import { RouterView } from 'vue-router';
import AppHeader from './components/AppHeader/AppHeader.vue';
import AppFooter from './components/AppFooter/AppFooter.vue';
import ErrorMessage from './components/ErrorMessage/ErrorMessage.vue';
import { isSessionRestoring, sessionError } from './auth/restoreSession';
</script>

<template>
    <AppHeader />

    <main>
        <h1 v-if="isSessionRestoring" role="status">Идёт восстановление сессии</h1>
        <ErrorMessage v-else-if="sessionError" :error-message="sessionError" />
        <RouterView v-else />
    </main>

    <AppFooter />
</template>

<style src="./assets/styles/App.css"></style>
