import type { Product } from './types';

(function (App: any) {
    'use strict';

    document.addEventListener('DOMContentLoaded', () => {
        const items: Product[] = App.storage.load();
        const state = { items };

        const grid = document.getElementById('product-grid') as HTMLElement;
        const stats = document.getElementById('stats') as HTMLElement;
        const form = document.getElementById('product-form') as HTMLFormElement;

        App.render.renderList(state.items, grid, stats);
        App.events.bindEvents(state, form, grid, stats);

        console.log('App parts:', Object.keys(App));
    });
})((window as any).App = (window as any).App || {});