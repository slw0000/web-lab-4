import { refresh, getAccessToken } from './auth.ts';

let refreshPromise: Promise<boolean> | null = null;

async function refreshOnce(): Promise<boolean> {
    if (!refreshPromise) {
        refreshPromise = refresh().finally(() => {
            refreshPromise = null;
        });
    }
    return refreshPromise;
}

async function sendRequest(url: string, options: RequestInit = {}): Promise<Response> {
    const headers: Headers = new Headers(options.headers);
    const token: string | null = getAccessToken();

    if (token) {
        headers.set('Authorization', `Bearer ${token}`);
    }

    return await fetch(url, { ...options, headers });
}

export async function apiRequest(url: string, options: RequestInit = {}): Promise<Response> {
    if (!getAccessToken()) {
        const restored = await refreshOnce();

        if (!restored) {
            // типа виндоу локейшн
            throw new Error('Необходимо авторизоваться');
        }
    }

    let response: Response = await sendRequest(url, options);

    if (response.status === 401) {
        const restored = await refreshOnce();

        if (!restored) {
            throw new Error('Необходимо авторизоваться');
        }

        response = await sendRequest(url, options);
    }

    return response;
}
