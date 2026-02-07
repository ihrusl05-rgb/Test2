/**
 * PARTNERS PAGE JAVASCRIPT
 * Управление интерактивностью страницы товаров и партнеров
 */

// ===================================
// ГЛОБАЛЬНЫЕ ПЕРЕМЕННЫЕ
// ===================================

let currentCategory = 0;
let currentSearchQuery = '';

// ===================================
// ИНИЦИАЛИЗАЦИЯ
// ===================================

document.addEventListener('DOMContentLoaded', function () {
    initializeSearch();
    initializeCategories();
    initializeEventListeners();
});

// ===================================
// ПОИСК ТОВАРОВ
// ===================================

function initializeSearch() {
    const searchInput = document.getElementById('searchInput');

    if (!searchInput) return;

    searchInput.addEventListener('input', function (e) {
        currentSearchQuery = e.target.value.toLowerCase().trim();
        filterProducts();
    });

    // Очистка поиска при клике на кнопку очистки (если будет добавлена)
    searchInput.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            this.value = '';
            currentSearchQuery = '';
            filterProducts();
        }
    });
}

// ===================================
// КАТЕГОРИИ
// ===================================

function initializeCategories() {
    const categoryCards = document.querySelectorAll('.category-card');

    categoryCards.forEach(card => {
        card.addEventListener('click', function () {
            const categoryId = parseInt(this.dataset.categoryId);
            filterByCategory(categoryId, this);
        });
    });

    // Установка активной категории при загрузке
    const firstCategory = document.querySelector('.category-card');
    if (firstCategory) {
        firstCategory.classList.add('active');
    }
}

function filterByCategory(categoryId, element) {
    // Обновляем глобальную переменную
    currentCategory = categoryId;

    // Обновляем активную категорию в UI
    document.querySelectorAll('.category-card').forEach(card => {
        card.classList.remove('active');
    });
    element.classList.add('active');

    // Фильтруем товары
    filterProducts();
}

// ===================================
// ФИЛЬТРАЦИЯ ТОВАРОВ
// ===================================

function filterProducts() {
    const cards = document.querySelectorAll('.product-card');
    let visibleCount = 0;

    cards.forEach(card => {
        const categoryId = parseInt(card.dataset.categoryId);
        const name = card.querySelector('.product-name').textContent.toLowerCase();
        const description = card.querySelector('.product-description').textContent.toLowerCase();

        // Проверяем категорию
        const categoryMatch = (currentCategory === 0 || categoryId === currentCategory);

        // Проверяем поиск
        const searchMatch = (
            currentSearchQuery === '' ||
            name.includes(currentSearchQuery) ||
            description.includes(currentSearchQuery)
        );

        // Показываем/скрываем карточку
        if (categoryMatch && searchMatch) {
            card.style.display = 'block';
            visibleCount++;
            // Анимация появления
            setTimeout(() => {
                card.style.opacity = '1';
            }, 10);
        } else {
            card.style.display = 'none';
            card.style.opacity = '0';
        }
    });

    // Показываем сообщение, если нет результатов
    updateEmptyState(visibleCount);
}

function updateEmptyState(visibleCount) {
    let emptyState = document.querySelector('.empty-state');

    if (visibleCount === 0) {
        if (!emptyState) {
            const productsGrid = document.getElementById('productsGrid');
            emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            emptyState.textContent = '📭 Нет результатов по вашему запросу';
            productsGrid.appendChild(emptyState);
        }
        emptyState.style.display = 'block';
    } else {
        if (emptyState) {
            emptyState.style.display = 'none';
        }
    }
}

// ===================================
// МОДАЛЬНОЕ ОКНО ТОВАРА
// ===================================

function openProductModal(productId) {
    const modal = document.getElementById('productModal');

    if (!modal) {
        console.error('Modal element not found');
        return;
    }

    // Получаем данные товара через AJAX
    const apiUrl = document.querySelector('[data-product-api]')?.dataset.productApi ||
        `/partners/api/product/${productId}/`;

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                populateModalContent(data);
                openModal(modal);
            } else {
                showNotification('Ошибка при загрузке товара', 'error');
            }
        })
        .catch(error => {
            console.error('Error fetching product:', error);
            showNotification('Ошибка подключения к серверу', 'error');
        });
}

function populateModalContent(data) {
    // Заполняем текстовое содержимое
    document.getElementById('modalName').textContent = data.name;
    document.getElementById('modalDescription').textContent = data.description;
    document.getElementById('modalOffers').textContent = `📦 ${data.count_offers} предложений`;

    // Обновляем ссылку на маркетплейс
    const link = document.getElementById('modalLink');
    link.href = data.marketplace_url;

    // Обновляем изображение
    const modalImage = document.getElementById('modalImage');
    if (data.image_url) {
        modalImage.innerHTML = `<img src="${data.image_url}" alt="${data.name}" loading="lazy">`;
        modalImage.classList.remove('placeholder');
    } else {
        modalImage.innerHTML = '🏷️';
        modalImage.classList.add('placeholder');
    }
}

function openModal(modal) {
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; // Запрещаем скролл фона
}

function closeProductModal() {
    const modal = document.getElementById('productModal');
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto'; // Разрешаем скролл
}

// ===================================
// ОБРАБОТКА СОБЫТИЙ
// ===================================

function initializeEventListeners() {
    // Закрытие модального окна при клике на overlay
    const modal = document.getElementById('productModal');
    const overlay = modal?.querySelector('.modal-overlay');

    if (overlay) {
        overlay.addEventListener('click', closeProductModal);
    }

    // Закрытие модального окна при нажатии на кнопку закрытия
    const closeBtn = modal?.querySelector('.modal-close');
    if (closeBtn) {
        closeBtn.addEventListener('click', closeProductModal);
    }

    // Закрытие модального окна при нажатии Escape
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) {
            closeProductModal();
        }
    });

    // Обработка нажатия Enter в поле поиска
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('keypress', function (e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                // Уже обработано через input event
            }
        });
    }

    // Обработка клика по карточке товара (используем data-product-id)
    const productCards = document.querySelectorAll('.product-card');
    productCards.forEach(card => {
        card.addEventListener('click', function () {
            const productId = this.dataset.productId;
            if (productId) {
                openProductModal(productId);
            }
        });
    });
}

// ===================================
// УТИЛИТЫ
// ===================================

function showNotification(message, type = 'info') {
    // Простое уведомление (можно расширить)
    console.log(`[${type.toUpperCase()}] ${message}`);
    alert(message); // Пока простой alert
}

function logout() {
    if (confirm('Вы уверены, что хотите выйти?')) {
        // Перенаправляем на страницу выхода
        window.location.href = '/partners/logout/';
    }
}

// ===================================
// УЛУЧШЕНИЯ ПРОИЗВОДИТЕЛЬНОСТИ
// ===================================

// Ленивая загрузка изображений
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            }
        });
    });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Дебаунс функции поиска для оптимизации
function debounce(func, delay) {
    let timeoutId;
    return function (...args) {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func(...args), delay);
    };
}

// Применяем дебаунс к поиску
const debouncedFilterProducts = debounce(filterProducts, 300);

// ===================================
// ЭКСПОРТ ФУНКЦИЙ (если используется модули)
// ===================================

if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        openProductModal,
        closeProductModal,
        filterByCategory,
        logout
    };
}
