import type { Product } from './types';

(function (App: any) {
    'use strict';
    const KEY = 'it-market-products';

    const load = (): Product[] => {
        try {
            const raw = localStorage.getItem(KEY);
            return raw ? JSON.parse(raw) : [];
        } catch (e) {
            console.warn('Storage corrupted, resetting', e);
            return [];
        }
    };

    const save = (items: Product[]): void => {
        localStorage.setItem(KEY, JSON.stringify(items));
    };

    const clear = (): void => localStorage.removeItem(KEY);

    App.storage = { load, save, clear };
})(window.App = window.App || {});