// Точка входу застосунку: ініціалізація після завантаження DOM
import type { Product } from './types';
import { storage } from './storage';
import { render } from './render';
import { events } from './events';

document.addEventListener('DOMContentLoaded', () => {
    const items: Product[] = storage.load();
    const state = { items };

    const grid = document.getElementById('product-grid') as HTMLElement;
    const stats = document.getElementById('stats') as HTMLElement;
    const form = document.getElementById('product-form') as HTMLFormElement;

    render.renderList(state.items, grid, stats);
    events.bindEvents(state, form, grid, stats);
});