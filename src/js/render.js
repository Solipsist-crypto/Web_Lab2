(function (App) {
    "use strict";

    const renderList = (items, container, statsContainer) => {
        container.innerHTML = "";
        const fragment = document.createDocumentFragment();
        let selectedCount = 0;

        items.forEach(item => {
            if (item.selected) selectedCount++;

            const card = document.createElement("div");
            card.className = "product-card";
            card.dataset.id = item.id;
            card.dataset.category = item.category;

            const img = document.createElement("img");
            img.src = "https://via.placeholder.com/200x180?text=Product";
            img.alt = item.title;
            img.className = "product-card__image";

            const title = document.createElement("h3");
            title.className = "product-card__title";
            title.textContent = item.title;

            const price = document.createElement("p");
            price.className = "product-card__price";
            price.textContent = `${Number(item.price).toLocaleString('uk-UA')} ₴`;

            const fav = document.createElement("button");
            fav.className = `product-card__button ${item.selected ? 'product-card__button--active' : ''}`;
            fav.textContent = item.selected ? "★ В обраному" : "☆ В обране";
            fav.dataset.action = "toggle";

            const edit = document.createElement("button");
            edit.className = "product-card__button product-card__button--edit";
            edit.textContent = "Ред.";
            edit.dataset.action = "edit";

            const del = document.createElement("button");
            del.className = "product-card__button product-card__button--delete";
            del.textContent = "Видалити";
            del.dataset.action = "delete";

            card.append(img, title, price, fav, edit, del);
            fragment.append(card);
        });

        container.append(fragment);
        statsContainer.textContent = `Всього: ${items.length} | В обраному: ${selectedCount}`;
    };

    App.render = { renderList };
})(window.App = window.App || {});