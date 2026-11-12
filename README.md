# IT-Market: Каталог товарів (Web-програмування)

Цей проєкт є розвитком каталогу товарів інтернет-магазину, що поступово вдосконалюється від лабораторної роботи до лабораторної роботи в рамках курсу «Web-програмування».

## 🛠 Поточний стан (ЛР5): Збирання проєкту та Sass

На цьому етапі проєкт переведено на сучасний стек розробки:
- Node.js 26 та npm для керування залежностями.
- Vite як збирач модулів та сервер розробки.
- Sass (SCSS) для стилів (замість звичайного CSS).
- ESLint та Prettier для статичного аналізу та форматування коду.

## 📁 Структура проєкту

Lab2/
├── src/
│   ├── css/            # SCSS-файли
│   │   ├── abstracts/  # Змінні та міксини (_variables.scss, _mixins.scss)
│   │   ├── base/       # Базові стилі (_reset.scss)
│   │   ├── components/ # Стилі компонентів (_header.scss, _card.scss тощо)
│   │   └── main.scss   # Головний файл, що підключає всі частини
│   ├── js/             # JavaScript-модулі
│   │   ├── api.js      # Функція запиту до REST API
│   │   ├── app.js      # Логіка сторінки API (ЛР4)
│   │   ├── main.js     # Точка входу для каталогу (ЛР3)
│   │   ├── storage.js  # Робота з localStorage
│   │   ├── render.js   # Рендеринг карток
│   │   ├── events.js   # Обробники подій
│   │   ├── strict-on.js
│   │   ├── strict-off.js
│   │   └── tasks/      # Завдання на власну реалізацію методів масивів
│   └── ...             # інші ресурси
├── dist/               # Результат промислового збирання (генерується автоматично)
├── index.html          # Головна сторінка каталогу (ЛР3)
├── api.html            # Сторінка з REST API (ЛР4)
├── strict.html         # Сторінка дослідження строгого режиму (ЛР3)
├── vite.config.js      # Конфігурація Vite
├── package.json        # Маніфест проєкту
├── .env.development    # Змінні оточення для розробки
├── .env.production     # Змінні оточення для продакшену
├── .nvmrc              # Фіксація версії Node.js (26)
├── .gitignore          # Ігнорування файлів (node_modules, dist, .env)
├── .prettierrc         # Конфігурація Prettier
├── eslint.config.js    # Конфігурація ESLint
└── README.md           # Цей файл

## 🚀 Як запустити

1. Встановіть залежності:
   npm install

2. Запустіть сервер розробки:
   npm run dev
   Сайт відкриється за адресою http://localhost:5173.

3. Для промислового збирання:
   npm run build
   Результат з'явиться в теці dist.

4. Для перевірки зібраної версії:
   npm run preview

## 📝 Доступні скрипти

- npm run dev — запуск сервера розробки Vite.
- npm run build — промислове збирання (мінімізація, хеші).
- npm run preview — перегляд зібраної версії.
- npm run lint — перевірка коду ESLint.
- npm run lint:fix — автоматичне виправлення помилок ESLint.
- npm run format — форматування коду Prettier.

## 📚 Історія лабораторних робіт

- ЛР1: Основи HTML та CSS (семантична розмітка, форми).
- ЛР2: CSS Grid, Flexbox, адаптивна верстка (BEM).
- ЛР3: JavaScript, DOM, події, валідація, localStorage.
- ЛР4: Асинхронний JavaScript, Fetch API, REST API.
- ЛР5: Node.js, npm, Vite, Sass, ESLint, Prettier.

## 🔗 Посилання

- Тег lab05: https://github.com/Solipsist-crypto/Web_Lab2/tree/lab05
- Порівняння lab04...lab05: https://github.com/Solipsist-crypto/Web_Lab2/compare/lab04...lab05

---
© 2026 Мошенський Ростислав, група ПЗск-2404