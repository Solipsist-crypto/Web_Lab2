export async function request(url, options = {}) {
    const defaultOptions = {
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        ...options
    };

    try {
        const response = await fetch(url, defaultOptions);
        
        // Fetch не відхиляється на 404/500, тому перевіряємо вручну
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        
        // Захист від помилки розбору JSON
        try {
            return await response.json();
        } catch (e) {
            throw new Error('Не вдалося розпарсити JSON відповіді');
        }
    } catch (error) {
        // Пробрасуємо скасування та тайм-аут окремо
        if (error.name === 'AbortError') throw error;
        if (error.name === 'TimeoutError') throw new Error('Перевищено час очікування (5 секунд)');
        
        throw new Error(error.message || 'Помилка мережі');
    }
}