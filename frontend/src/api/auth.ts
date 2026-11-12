import type { LoginRequest, RegisterRequest, User, AccessTokenResponse } from '@/types/auth';
import { apiRequest } from './http';
import { errorHandler } from './errors';
import { config } from '@/config';

const authUrl = `${config.apiBaseUrl}/auth`;

let accessToken: string | null = null;

export function getAccessToken(): string | null {
    return accessToken;
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
    const response = await fetch(`${authUrl}/login`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
    });

    const data = await readResponse<AccessTokenResponse>(response);
    accessToken = data.accessToken;
}

export async function register(registerData: RegisterRequest): Promise<void> {
    const response = await fetch(`${authUrl}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registerData),
    });

    if (!response.ok) {
        await errorHandler(response);
    }
}

export async function refresh(): Promise<boolean> {
    const response = await fetch(`${authUrl}/refresh`, {
        method: 'POST',
        credentials: 'include',
    });

    if (response.status === 401) {
        accessToken = null;
        return false;
    }

    const data = await readResponse<AccessTokenResponse>(response);
    accessToken = data.accessToken;
    return true;
}

export async function getCurrentUser(): Promise<User> {
    const response = await apiRequest(authUrl + '/me');

    return readResponse<User>(response);
}

export async function logout(): Promise<void> {
    const response = await fetch(`${authUrl}/logout`, {
        method: 'POST',
        credentials: 'include',
    });

    await readResponse<void>(response);
    accessToken = null;
}
