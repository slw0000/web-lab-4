import { createWebHistory, createRouter } from 'vue-router';
import StudentsView from '@/views/StudentsView/StudentsView.vue';
import LoginView from '@/views/LoginView/LoginView.vue';
import RegisterView from '@/views/RegisterView/RegisterView.vue';
import ProfileView from '@/views/ProfileView/ProfileView.vue';
import StudView from '@/views/StudView/StudView.vue';
import StudentFormView from '@/views/StudentFormView/StudentFormView.vue';
import { useUserStore } from '@/stores/user';
import { restoreSession } from '@/auth/restoreSession';

export const router = createRouter({
    history: createWebHistory(),
    routes: [
        { path: '/', redirect: '/students' },
        {
            path: '/students',
            component: StudentsView,
            meta: { requiresAuth: true },
        },
        {
            path: '/login',
            component: LoginView,
            meta: { guestOnly: true },
        },
        {
            path: '/register',
            component: RegisterView,
            meta: { guestOnly: true },
        },
        {
            path: '/profile',
            component: ProfileView,
            meta: { requiresAuth: true },
        },
        {
            path: '/students/:id',
            component: StudView,
            meta: { requiresAuth: true },
        },
        {
            path: '/students/new',
            component: StudentFormView,
            meta: { requiresAuth: true, adminOnly: true },
        },
        {
            path: '/students/:id/edit',
            component: StudentFormView,
            meta: { requiresAuth: true, adminOnly: true },
        },
        {
            path: '/:pathMatch(.*)*',
            redirect: '/students',
        },
    ],
});

router.beforeEach(async (to) => {
    try {
        await restoreSession();
    } catch {
        return false;
    }

    if (to.meta.requiresAuth && !useUserStore().isAuthenticated) {
        return '/login';
    }

    if (to.meta.guestOnly && useUserStore().isAuthenticated) {
        return '/students';
    }

    if (to.meta.adminOnly && !useUserStore().isAdmin) {
        return '/students';
    }
});
