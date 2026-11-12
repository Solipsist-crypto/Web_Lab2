(function (App) {
  'use strict';

  const bindEvents = (state, formElement, grid, stats) => {
    // === ПУНКТ 5: ДЕЛЕГУВАННЯ ПОДІЙ (Кнопки в картках) ===
    grid.addEventListener('click', (event) => {
      const btn = event.target.closest('button[data-action]');
      if (!btn) return;

      const card = btn.closest('.product-card');
      const id = Number(card.dataset.id);
      const action = btn.dataset.action;
      const idx = state.items.findIndex((i) => i.id === id);
      if (idx === -1) return;
      const item = state.items[idx];

      if (action === 'delete') {
        state.items.splice(idx, 1);
      } else if (action === 'toggle') {
        item.selected = !item.selected;
      } else if (action === 'edit') {
        const titleEl = card.querySelector('.product-card__title');
        const input = document.createElement('input');
        input.type = 'text';
        input.value = item.title;
        input.className = 'product-card__edit-input';
        titleEl.replaceWith(input);
        input.focus();

        const save = () => {
          const v = input.value.trim();
          if (v.length >= 3) {
            item.title = v;
            App.storage.save(state.items);
          }
          App.render.renderList(state.items, grid, stats);
        };
        input.addEventListener('blur', save);
        input.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') input.blur();
        });
        return;
      }

      App.storage.save(state.items);
      App.render.renderList(state.items, grid, stats);
    });

    // === ПУНКТ 7: ПОШУК, СОРТУВАННЯ, ФІЛЬТРАЦІЯ ===
    const debounce = (fn, delay) => {
      let timerId;
      return (...args) => {
        clearTimeout(timerId);
        timerId = setTimeout(() => fn(...args), delay);
      };
    };

    const searchInput = document.getElementById('search-input');
    const sortSelect = document.getElementById('sort-select');
    let currentSearch = '';
    let currentSort = 'default';

    const applyFilters = () => {
      const checkedCats = Array.from(document.querySelectorAll('.filter__checkbox:checked')).map(
        (cb) => cb.dataset.filter,
      );

      let filtered = state.items.filter((item) => {
        const matchesSearch = item.title.toLowerCase().includes(currentSearch.toLowerCase());
        const matchesCategory = checkedCats.length === 0 || checkedCats.includes(item.category);
        return matchesSearch && matchesCategory;
      });

      if (currentSort === 'price-asc') {
        filtered = [...filtered].sort((a, b) => a.price - b.price);
      } else if (currentSort === 'price-desc') {
        filtered = [...filtered].sort((a, b) => b.price - a.price);
      } else if (currentSort === 'title') {
        filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));
      }

      App.render.renderList(filtered, grid, stats);
    };

    searchInput.addEventListener(
      'input',
      debounce((e) => {
        currentSearch = e.target.value;
        applyFilters();
      }, 400),
    );

    sortSelect.addEventListener('change', (e) => {
      currentSort = e.target.value;
      applyFilters();
    });

    document.querySelectorAll('.filter__checkbox').forEach((cb) => {
      cb.addEventListener('change', applyFilters);
    });

    const resetBtn = document.getElementById('reset-filters');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        document.querySelectorAll('.filter__checkbox').forEach((cb) => (cb.checked = false));
        searchInput.value = '';
        currentSearch = '';
        currentSort = 'default';
        sortSelect.value = 'default';
        applyFilters();
      });
    }

    // === ПУНКТ 8: ВАЛІДАЦІЯ ФОРМИ ===
    const errorP = document.getElementById('form-error');
    const titleInput = formElement.elements.title;
    const priceInput = formElement.elements.price;

    titleInput.addEventListener('input', () => {
      if (titleInput.validity.tooShort) {
        titleInput.setCustomValidity('Назва занадто коротка (мінімум 3 символи)');
      } else {
        titleInput.setCustomValidity('');
      }
    });

    priceInput.addEventListener('input', () => {
      if (priceInput.validity.rangeUnderflow) {
        priceInput.setCustomValidity('Ціна не може бути менше 1 грн');
      } else {
        priceInput.setCustomValidity('');
      }
    });

    formElement.addEventListener('submit', (event) => {
      event.preventDefault();

      if (!formElement.checkValidity()) {
        errorP.textContent = 'Будь ласка, виправте помилки у формі.';
        const firstInvalid = formElement.querySelector(':invalid');
        if (firstInvalid) {
          firstInvalid.setAttribute('aria-invalid', 'true');
          firstInvalid.focus();
        }
        formElement.reportValidity();
        return;
      }

      const fd = new FormData(formElement);
      const title = String(fd.get('title')).trim();
      const price = Number(fd.get('price'));
      const category = String(fd.get('category'));

      if (!category) {
        errorP.textContent = 'Оберіть категорію.';
        formElement.elements.category.focus();
        return;
      }

      errorP.textContent = '';
      formElement
        .querySelectorAll('[aria-invalid]')
        .forEach((el) => el.removeAttribute('aria-invalid'));

      state.items.push({
        id: Date.now(),
        title,
        price,
        category,
        selected: false,
      });

      App.storage.save(state.items);
      applyFilters();
      formElement.reset();
      titleInput.setCustomValidity('');
      priceInput.setCustomValidity('');
    });

    // === ПУНКТ 9: ОЧИЩЕННЯ LOCALSTORAGE ===
    const clearStorageBtn = document.getElementById('clear-storage');
    if (clearStorageBtn) {
      clearStorageBtn.addEventListener('click', () => {
        // Запитуємо підтвердження
        if (confirm('Ви впевнені, що хочете видалити ВСІ товари зі сховища?')) {
          // 1. Очищаємо масив у пам'яті
          state.items.length = 0;

          // 2. Видаляємо з localStorage
          App.storage.clear();

          // 3. Скидаємо фільтри та пошук
          document.querySelectorAll('.filter__checkbox').forEach((cb) => (cb.checked = false));
          searchInput.value = '';
          currentSearch = '';
          currentSort = 'default';
          sortSelect.value = 'default';

          // 4. Перемальовуємо порожній список
          applyFilters();
        }
      });
    }
  };

  App.events = { bindEvents };
})((window.App = window.App || {}));
