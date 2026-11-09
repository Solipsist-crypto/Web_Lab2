(function (App) {
    "use strict";

    const bindEvents = (state, formElement, grid, stats) => {
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
                return;
            }

            App.storage.save(state.items);
            App.render.renderList(state.items, grid, stats);
        });
    };

    App.events = { bindEvents };
})(window.App = window.App || {});