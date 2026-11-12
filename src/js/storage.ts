(function (App) {
  'use strict';
  const KEY = 'it-market-products';

  const load = () => {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      console.warn('Storage corrupted, resetting', e);
      return [];
    }
  };

  const save = (items) => {
    localStorage.setItem(KEY, JSON.stringify(items));
  };

  const clear = () => localStorage.removeItem(KEY);

  App.storage = { load, save, clear };
})((window.App = window.App || {}));
