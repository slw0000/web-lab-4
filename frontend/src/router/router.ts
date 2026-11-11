import { createWebHistory, createRouter } from 'vue-router';

import StudentsView from '@/views/StudentsView.vue';
import LoginView from '@/views/LoginView.vue';
import RegisterView from '@/views/RegisterView.vue';

export const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', redirect: '/students' },
        { path: '/students', component: StudentsView },
        { path: '/login', component: LoginView },
        { path: '/register', component: RegisterView },
    ],
});
