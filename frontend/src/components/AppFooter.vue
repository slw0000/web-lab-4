<template>
    <footer class="app-footer">
        <span>Лабораторная №4</span>

        <a href="https://github.com/slw0000/web-lab-4" target="_blank" rel="noopener noreferrer">
            GitHub
        </a>
    </footer>
</template>

<style scoped>
.app-footer {
    background-color: var(--color-footer-background);
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 0.75rem;
    padding: 1rem 1.5rem;
    border-top: 1px solid var(--color-border-light);
    font-size: 0.875rem;
}

a {
    color: inherit;
    text-decoration: none;
}

a:hover {
    text-decoration: underline;
}
</style>
