(function (App) {
    "use strict";

    const bindEvents = (state, formElement, grid, stats) => {
        // === ПУНКТ 5: ДЕЛЕГУВАННЯ ПОДІЙ (Кнопки в картках) ===
        grid.addEventListener("click", (event) => {
            const btn = event.target.closest("button[data-action]");
            if (!btn) return;

            const card = btn.closest(".product-card");
            const id = Number(card.dataset.id);
            const action = btn.dataset.action;
            const idx = state.items.findIndex(i => i.id === id);
            if (idx === -1) return;
            const item = state.items[idx];

            if (action === "delete") {
                state.items.splice(idx, 1);
            } else if (action === "toggle") {
                item.selected = !item.selected;
            } else if (action === "edit") {
                // Редагування на місці
                const titleEl = card.querySelector(".product-card__title");
                const input = document.createElement("input");
                input.type = "text";
                input.value = item.title;
                input.className = "product-card__edit-input";
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
                input.addEventListener("blur", save);
                input.addEventListener("keydown", e => { if (e.key === "Enter") input.blur(); });
                return; // Чекаємо на blur, не перемальовуємо зараз
            }

            // Зберігаємо та перемальовуємо після видалення/перемикання
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

        const searchInput = document.getElementById("search-input");
        const sortSelect = document.getElementById("sort-select");
        let currentSearch = "";
        let currentSort = "default";

        const applyFilters = () => {
            const checkedCats = Array.from(document.querySelectorAll('.filter__checkbox:checked'))
                .map(cb => cb.dataset.filter);

            // Фільтрація
            let filtered = state.items.filter(item => {
                const matchesSearch = item.title.toLowerCase().includes(currentSearch.toLowerCase());
                const matchesCategory = checkedCats.length === 0 || checkedCats.includes(item.category);
                return matchesSearch && matchesCategory;
            });

            // Сортування (на копії масиву)
            if (currentSort === "price-asc") {
                filtered = [...filtered].sort((a, b) => a.price - b.price);
            } else if (currentSort === "price-desc") {
                filtered = [...filtered].sort((a, b) => b.price - a.price);
            } else if (currentSort === "title") {
                filtered = [...filtered].sort((a, b) => a.title.localeCompare(b.title));
            }

            // Перемальовуємо відфільтрований список
            App.render.renderList(filtered, grid, stats);
        };

        // Обробник пошуку (з debounce 400мс)
        searchInput.addEventListener("input", debounce((e) => {
            currentSearch = e.target.value;
            applyFilters();
        }, 400));

        // Обробник сортування
        sortSelect.addEventListener("change", (e) => {
            currentSort = e.target.value;
            applyFilters();
        });

        // Обробники чекбоксів категорій
        document.querySelectorAll('.filter__checkbox').forEach(cb => {
            cb.addEventListener('change', applyFilters);
        });

        // Кнопка "Скинути"
        const resetBtn = document.getElementById('reset-filters');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                document.querySelectorAll('.filter__checkbox').forEach(cb => cb.checked = false);
                searchInput.value = "";
                currentSearch = "";
                currentSort = "default";
                sortSelect.value = "default";
                applyFilters();
            });
        }

        // === ФОРМА ДОДАВАННЯ (Пункт 4, 8) ===
        formElement.addEventListener("submit", (event) => {
            event.preventDefault(); // Зупиняємо перезавантаження
            
            const fd = new FormData(formElement);
            const title = String(fd.get("title")).trim();
            const price = Number(fd.get("price"));
            const category = String(fd.get("category"));
            const errorP = document.getElementById("form-error");

            // Базова валідація
            if (title.length < 3) {
                errorP.textContent = "Назва — мінімум 3 символи";
                formElement.elements.title.focus();
                return;
            }
            if (isNaN(price) || price <= 0) {
                errorP.textContent = "Ціна має бути більше 0";
                formElement.elements.price.focus();
                return;
            }
            if (!category) {
                errorP.textContent = "Оберіть категорію";
                return;
            }

            errorP.textContent = "";

            // Створюємо новий товар і додаємо в масив
            state.items.push({
                id: Date.now(),
                title, price, category,
                selected: false
            });

            // Зберігаємо і перемальовуємо
            App.storage.save(state.items);
            applyFilters(); // Використовуємо applyFilters, щоб врахувати поточні фільтри
            formElement.reset();
        });
    };

    App.events = { bindEvents };
})(window.App = window.App || {});