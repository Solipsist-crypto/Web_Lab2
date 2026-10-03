document.addEventListener('DOMContentLoaded', () => {
    const checkboxes = document.querySelectorAll('.filter__checkbox');
    const cards = document.querySelectorAll('.product-card');
    const resetButton = document.getElementById('reset-filters');

    function filterProducts() {


        const selectedCategories = Array.from(checkboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.getAttribute('data-filter'));

        cards.forEach(card => {
            const cardCategory = card.getAttribute('data-category');

            if (selectedCategories.length === 0 || selectedCategories.includes(cardCategory)) {
                card.classList.remove('product-card--hidden');
            } else {
                card.classList.add('product-card--hidden');
            }
        });
    }

    checkboxes.forEach(cb => {
        cb.addEventListener('change', filterProducts);
    });

    resetButton.addEventListener('click', () => {
        checkboxes.forEach(cb => cb.checked = false);
        filterProducts();
    });
});