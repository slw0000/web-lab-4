export const config = {
    apiBaseUrl: import.meta.env.VITE_API_BASE_URL,
    studentsRefreshMs: Number(import.meta.env.VITE_STUDENTS_REFRESH_MS),
    studentsPageSize: Number(import.meta.env.VITE_STUDENTS_PAGE_SIZE),
};
