import type { Product } from './types';
import { storage } from './storage';
import { render } from './render';

export const events = {
    bindEvents: (state: { items: Product[] }, formElement: HTMLFormElement, grid: HTMLElement, stats: HTMLElement): void => {
        // === ПУНКТ 5: ДЕЛЕГУВАННЯ ПОДІЙ ===
        grid.addEventListener('click', (event: Event) => {
            const target = event.target as HTMLElement;
            const btn = target.closest('button[data-action]') as HTMLButtonElement | null;
            if (!btn) return;

            const card = btn.closest('.product-card') as HTMLElement;
            const id = Number(card.dataset.id);
            const action = btn.dataset.action;
            const idx = state.items.findIndex((i) => i.id === id);
            if (idx === -1) return;
            const item = state.items[idx];
            if (!item) return;

            if (action === 'delete') {
                state.items.splice(idx, 1);
            } else if (action === 'toggle') {
                item.selected = !item.selected;
            } else if (action === 'edit') {
                const titleEl = card.querySelector('.product-card__title') as HTMLElement;
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
                        storage.save(state.items);
                    }
                    render.renderList(state.items, grid, stats);
                };
                input.addEventListener('blur', save);
                input.addEventListener('keydown', (e: KeyboardEvent) => {
                    if (e.key === 'Enter') input.blur();
                });
                return;
            }

            storage.save(state.items);
            render.renderList(state.items, grid, stats);
        });

        // === ПУНКТ 7: ПОШУК, СОРТУВАННЯ, ФІЛЬТРАЦІЯ ===
        const debounce = <T extends (...args: any[]) => void>(fn: T, delay: number) => {
            let timerId: ReturnType<typeof setTimeout>;
            return (...args: Parameters<T>) => {
                clearTimeout(timerId);
                timerId = setTimeout(() => fn(...args), delay);
            };
        };

        const searchInput = document.getElementById('search-input') as HTMLInputElement;
        const sortSelect = document.getElementById('sort-select') as HTMLSelectElement;
        let currentSearch = '';
        let currentSort = 'default';

        const applyFilters = () => {
            const checkedCats = Array.from(document.querySelectorAll('.filter__checkbox:checked')).map(
                (cb) => (cb as HTMLInputElement).dataset.filter,
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

            render.renderList(filtered, grid, stats);
        };

        searchInput.addEventListener(
            'input',
            debounce((e: Event) => {
                currentSearch = (e.target as HTMLInputElement).value;
                applyFilters();
            }, 400),
        );

        sortSelect.addEventListener('change', (e: Event) => {
            currentSort = (e.target as HTMLSelectElement).value;
            applyFilters();
        });

        document.querySelectorAll('.filter__checkbox').forEach((cb) => {
            cb.addEventListener('change', applyFilters);
        });

        const resetBtn = document.getElementById('reset-filters') as HTMLButtonElement | null;
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                document.querySelectorAll('.filter__checkbox').forEach((cb) => {
                    (cb as HTMLInputElement).checked = false;
                });
                searchInput.value = '';
                currentSearch = '';
                currentSort = 'default';
                sortSelect.value = 'default';
                applyFilters();
            });
        }

        // === ПУНКТ 8: ВАЛІДАЦІЯ ФОРМИ ===
        const errorP = document.getElementById('form-error') as HTMLElement;
        const titleInput = formElement.elements.namedItem('title') as HTMLInputElement;
        const priceInput = formElement.elements.namedItem('price') as HTMLInputElement;

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

        formElement.addEventListener('submit', (event: SubmitEvent) => {
            event.preventDefault();

            if (!formElement.checkValidity()) {
                errorP.textContent = 'Будь ласка, виправте помилки у формі.';
                const firstInvalid = formElement.querySelector(':invalid') as HTMLElement | null;
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
                (formElement.elements.namedItem('category') as HTMLSelectElement).focus();
                return;
            }

            errorP.textContent = '';
            formElement
                .querySelectorAll('[aria-invalid]')
                .forEach((el) => el.removeAttribute('aria-invalid'));

            state.items.push({
                id: Date.now(),
                createdAt: new Date().toISOString(),
                title,
                price,
                category,
                selected: false,
            });

            storage.save(state.items);
            applyFilters();
            formElement.reset();
            titleInput.setCustomValidity('');
            priceInput.setCustomValidity('');
        });

        // === ПУНКТ 9: ОЧИЩЕННЯ LOCALSTORAGE ===
        const clearStorageBtn = document.getElementById('clear-storage') as HTMLButtonElement | null;
        if (clearStorageBtn) {
            clearStorageBtn.addEventListener('click', () => {
                if (confirm('Ви впевнені, що хочете видалити ВСІ товари зі сховища?')) {
                    state.items.length = 0;
                    storage.clear();
                    document.querySelectorAll('.filter__checkbox').forEach((cb) => {
                        (cb as HTMLInputElement).checked = false;
                    });
                    searchInput.value = '';
                    currentSearch = '';
                    currentSort = 'default';
                    sortSelect.value = 'default';
                    applyFilters();
                }
            });
        }
    },
};