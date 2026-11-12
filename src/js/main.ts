(function (App) {
  'use strict';

  document.addEventListener('DOMContentLoaded', () => {
    const items = App.storage.load();
    const state = { items };

    const grid = document.getElementById('product-grid');
    const stats = document.getElementById('stats');
    const form = document.getElementById('product-form');

    App.render.renderList(state.items, grid, stats);
    App.events.bindEvents(state, form, grid, stats);

    console.log('App parts:', Object.keys(App));
  });
})((window.App = window.App || {}));
