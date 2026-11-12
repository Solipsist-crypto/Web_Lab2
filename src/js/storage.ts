import type { Product } from './types';

const KEY = 'it-market-products';

export const storage = {
    load: (): Product[] => {
        try {
            const raw = localStorage.getItem(KEY);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            console.warn('Storage corrupted, resetting', e);
            return [];
        }
    },
    save: (items: Product[]): void => {
        localStorage.setItem(KEY, JSON.stringify(items));
    },
    clear: (): void => localStorage.removeItem(KEY),
};