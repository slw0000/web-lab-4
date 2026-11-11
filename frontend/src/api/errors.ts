export async function errorHandler(response: Response): Promise<never> {
    const data = await response.json().catch(() => null);
    const message = data?.message ?? `Произошла ошибка (${response.status})`;

    switch (response.status) {
        case 422:
            let details: string[] = [];
            if (Array.isArray(data?.details)) {
                for (const detail of data.details) {
                    if (
                        typeof detail?.fieldName === 'string' &&
                        typeof detail?.message === 'string'
                    ) {
                        details.push(`${detail.fieldName}: ${detail.message}`);
                    }
                }
            }
            throw new Error([message, ...details].join('\n'));
        case 401:
            throw new Error(`Ошибка авторизации (401):\n${message}`);
        case 403:
            throw new Error(`Ошибка доступа (403):\n${message}`);
        case 409:
            throw new Error(`Ошибка конфликта данных (409):\n${message}`);
        case 404:
            throw new Error(`Ошибка не найдено (404):\n${message}`);
        case 400:
            throw new Error(`Ошибка при запросе (400):\n${message}`);
        case 500:
            throw new Error(`Ошибка на сервере (500):\n${message}`);
        default:
            throw new Error(`Произошла ошибка (${response.status})`);
    }
}
