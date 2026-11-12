<script setup lang="ts">
defineProps<{
    errorMessage: string;
}>();
</script>

<template>
    <div v-if="errorMessage" class="error-container">
        <p id="error-message">{{ errorMessage }}</p>
    </div>
</template>

<style scoped src="./ErrorMessage.css"></style>
