<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import ErrorMessage from '@/components/ErrorMessage.vue';
import { register, getCurrentUser } from '@/api/auth.js';
import type { User } from '@/types/auth';

const username = ref('');
const email = ref('');
const password = ref('');
const passwordConfirm = ref('');

const router = useRouter();

const errorMessage = ref('');
const isSubmitting = ref(false);

async function submitRegister(): Promise<void> {
    if (isSubmitting.value) return;

    errorMessage.value = '';
    if (password.value !== passwordConfirm.value) {
        errorMessage.value = 'Пароли не совпадают';
        return;
    }
    isSubmitting.value = true;

    try {
        await register({
            username: username.value,
            email: email.value,
            password: password.value,
        });
        await router.replace('/login');
    } catch (error: unknown) {
        errorMessage.value = error instanceof Error ? error.message : 'Не удалось войти в аккаунт';
    } finally {
        isSubmitting.value = false;
    }
}
</script>

<template>
    <section>
        <h1>Регистрация</h1>
        <ErrorMessage :error-message="errorMessage" />
        <form id="register-form" class="student-card" @submit.prevent="submitRegister">
            <div class="form-row">
                <label for="username"> Имя пользователя <span class="required">*</span> </label>
                <input
                    type="text"
                    id="username"
                    name="username"
                    autocomplete="username"
                    v-model.trim="username"
                    minlength="3"
                    maxlength="20"
                    pattern="[a-zA-Z0-9]{3,20}"
                    title="От 3 до 20 символов: латинские буквы и цифры"
                    autocapitalize="none"
                    spellcheck="false"
                    :disabled="isSubmitting"
                    required
                />
            </div>

            <div class="form-row">
                <label for="email"> Email <span class="required">*</span> </label>
                <input
                    type="email"
                    id="email"
                    name="email"
                    autocomplete="email"
                    v-model.trim="email"
                    maxlength="255"
                    :disabled="isSubmitting"
                    required
                />
            </div>

            <div class="form-row">
                <label for="password"> Пароль <span class="required">*</span> </label>
                <input
                    type="password"
                    id="password"
                    name="password"
                    autocomplete="new-password"
                    v-model="password"
                    minlength="8"
                    maxlength="100"
                    pattern="(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&amp;])[A-Za-z0-9@$!%*?&amp;]{8,100}"
                    title="От 8 до 100 символов. Нужны строчная и заглавная латинские буквы, цифра и символ из @$!%*?&amp;. Другие символы не допускаются."
                    :disabled="isSubmitting"
                    required
                />
            </div>

            <div class="form-row">
                <label for="password-confirm">
                    Повтор пароля <span class="required">*</span>
                </label>
                <input
                    type="password"
                    id="password-confirm"
                    name="passwordConfirm"
                    autocomplete="new-password"
                    v-model="passwordConfirm"
                    minlength="8"
                    maxlength="100"
                    :disabled="isSubmitting"
                    required
                />
            </div>

            <div class="buttons-container">
                <button type="submit" class="buttons accept-button" :disabled="isSubmitting">
                    Зарегистрироваться
                </button>
                <RouterLink to="/login" class="buttons"> Уже есть аккаунт </RouterLink>
            </div>
        </form>
    </section>
</template>
