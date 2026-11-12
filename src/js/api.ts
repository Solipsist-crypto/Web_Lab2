export async function request<T>(url: string, options: RequestInit = {}): Promise<T> {
    const defaultOptions: RequestInit = {
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        ...options,
    };

    try {
        const response = await fetch(url, defaultOptions);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        try {
            return (await response.json()) as T;
        } catch (e) {
            throw new Error('Не вдалося розпарсити JSON відповіді', { cause: e });
        }
    } catch (error) {
        const err = error as Error;
        if (err.name === 'AbortError') throw err;
        if (err.name === 'TimeoutError') {
            throw new Error('Перевищено час очікування (5 секунд)', { cause: err });
        }
        throw new Error(err.message || 'Помилка мережі', { cause: err });
    }
}