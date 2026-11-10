import { request } from './api.js';

const grid = document.getElementById('api-grid');
const loader = document.getElementById('loader');
const errorBox = document.getElementById('error-box');
const searchInput = document.getElementById('api-search');
const btnRetry = document.getElementById('btn-retry');
const btnShowMore = document.getElementById('btn-show-more');
const commentsSection = document.getElementById('comments-section');
const commentsList = document.getElementById('comments-list');
const commentsTitle = document.getElementById('comments-title');
const btnCloseComments = document.getElementById('btn-close-comments');

// Стан
let controller = null;
let currentPage = 1;
let currentQuery = '';
let allPosts = [];
let allUsers = [];
const PAGE_SIZE = 10;

// Debounce
const debounce = (fn, delay) => {
    let timerId;
    return (...args) => {
        clearTimeout(timerId);
        timerId = setTimeout(() => fn(...args), delay);
    };
};

// Рендер карток (Новини)
function renderPosts(posts) {
    grid.innerHTML = '';
    if (posts.length === 0) {
        grid.innerHTML = '<p style="color: #a0a0a0; width: 100%;">Новин не знайдено.</p>';
        return;
    }

    posts.forEach(post => {
        const author = allUsers.find(u => u.id === post.userId);
        const authorName = author ? author.name : 'Невідомий автор';

        const card = document.createElement('div');
        card.className = 'product-card';
        card.style.cursor = 'pointer';
        
        // Заголовок новини
        const title = document.createElement('h3');
        title.className = 'product-card__title';
        title.textContent = post.title;
        
        // Короткий опис
        const body = document.createElement('p');
        body.className = 'product-card__price';
        body.style.color = 'var(--color-text-primary)';
        body.style.fontWeight = 'normal';
        body.textContent = post.body.substring(0, 60) + '...';

        // Автор
        const authorP = document.createElement('p');
        authorP.style.fontSize = '12px';
        authorP.style.color = '#3498db';
        authorP.style.marginTop = '10px';
        authorP.textContent = `Опублікував: ${authorName}`;
        
        card.append(title, body, authorP);
        
        // Клік на картку – завантаження відгуків
        card.addEventListener('click', () => loadComments(post.id, post.title));
        
        grid.append(card);
    });
}

// Завантаження відгуків (коментарів)
async function loadComments(postId, postTitle) {
    commentsSection.style.display = 'block';
    commentsTitle.textContent = `Відгуки до: ${postTitle.substring(0, 30)}...`;
    commentsList.innerHTML = '<p>Завантаження відгуків...</p>';
    commentsSection.scrollIntoView({ behavior: 'smooth' });

    try {
        const comments = await request(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`);
        commentsList.innerHTML = '';
        if (comments.length === 0) {
            commentsList.innerHTML = '<p>Відгуків немає.</p>';
            return;
        }

        comments.forEach(c => {
            const div = document.createElement('div');
            div.style.padding = '10px';
            div.style.borderBottom = '1px solid var(--color-border)';
            
            const name = document.createElement('strong');
            name.textContent = c.name;
            
            const email = document.createElement('span');
            email.style.color = '#888';
            email.style.fontSize = '12px';
            email.textContent = ` (${c.email})`;
            
            const body = document.createElement('p');
            body.textContent = c.body;
            
            div.append(name, email, body);
            commentsList.append(div);
        });
    } catch (error) {
        commentsList.innerHTML = `<p style="color: red;">Помилка: ${error.message}</p>`;
    }
}

// Основне завантаження
async function fetchData(query = '') {
    if (controller) controller.abort();
    controller = new AbortController();

    loader.style.display = 'block';
    errorBox.style.display = 'none';
    btnRetry.style.display = 'none';
    btnShowMore.style.display = 'none';

    try {
        const signal = AbortSignal.any([
            controller.signal,
            AbortSignal.timeout(5000)
        ]);

        // Promise.all – паралельне завантаження
        const [posts, users] = await Promise.all([
            request('https://jsonplaceholder.typicode.com/posts', { signal }),
            request('https://jsonplaceholder.typicode.com/users', { signal })
        ]);

        allPosts = posts;
        allUsers = users;
        currentPage = 1;
        currentQuery = query;

        const filtered = query 
            ? allPosts.filter(p => p.title.includes(query))
            : allPosts;

        const paginated = filtered.slice(0, PAGE_SIZE);
        
        loader.style.display = 'none';
        renderPosts(paginated);

        if (filtered.length > PAGE_SIZE) {
            btnShowMore.style.display = 'inline-block';
        }

    } catch (error) {
        loader.style.display = 'none';
        if (error.name === 'AbortError') return;
        
        errorBox.textContent = error.message;
        errorBox.style.display = 'block';
        btnRetry.style.display = 'inline-block';
    }
}

// Пагінація
btnShowMore.addEventListener('click', () => {
    currentPage++;
    const filtered = currentQuery 
        ? allPosts.filter(p => p.title.includes(currentQuery))
        : allPosts;
    
    const nextBatch = filtered.slice(0, currentPage * PAGE_SIZE);
    renderPosts(nextBatch);

    if (nextBatch.length >= filtered.length) {
        btnShowMore.style.display = 'none';
    }
});

// Закриття відгуків
btnCloseComments.addEventListener('click', () => {
    commentsSection.style.display = 'none';
});

// Пошук з debounce
searchInput.addEventListener('input', debounce((e) => {
    fetchData(e.target.value);
}, 500));

btnRetry.addEventListener('click', () => fetchData(currentQuery));

// Запуск
fetchData();