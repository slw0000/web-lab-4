import type { LoginRequest, RegisterRequest, User, AccessTokenResponse } from '@/types/auth';
import { useUserStore } from '@/stores/user';
import { apiRequest } from './http';
import { errorHandler } from './errors';
import { config } from '@/config';

const authUrl = `${config.apiBaseUrl}/auth`;

function authFetch(path: string, data?: LoginRequest | RegisterRequest): Promise<Response> {
    return fetch(`${authUrl}${path}`, {
        method: 'POST',
        credentials: 'include',
        headers: data === undefined ? undefined : { 'Content-Type': 'application/json' },
        body: data === undefined ? undefined : JSON.stringify(data),
    });
}

async function readResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        await errorHandler(response);
    }

    if (response.status === 204) {
        return undefined as T;
    }

    return response.json();
}

export async function login(loginData: LoginRequest): Promise<void> {
    const response = await authFetch('/login', loginData);

    const data = await readResponse<AccessTokenResponse>(response);
    useUserStore().setAccessToken(data.accessToken);
}

export async function register(registerData: RegisterRequest): Promise<void> {
    const response = await authFetch('/register', registerData);

    if (!response.ok) {
        await errorHandler(response);
    }
}

export async function refresh(): Promise<boolean> {
    const response = await authFetch('/refresh');

    if (response.status === 401) {
        useUserStore().clearUser();
        return false;
    }

    const data = await readResponse<AccessTokenResponse>(response);
    useUserStore().setAccessToken(data.accessToken);
    return true;
}

export async function getCurrentUser(): Promise<User> {
    const response = await apiRequest(authUrl + '/me');

    return readResponse<User>(response);
}

export async function logout(): Promise<void> {
    const response = await authFetch('/logout');

    await readResponse<void>(response);
    useUserStore().clearUser();
}
