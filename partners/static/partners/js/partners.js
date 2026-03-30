// partners.js - Обработка модальных окон товаров

document.addEventListener('DOMContentLoaded', function() {
    // Находим все карточки товаров
    const productCards = document.querySelectorAll('.product-card');
    
    // Находим элементы модального окна
    const modal = document.getElementById('productModal');
    const modalOverlay = modal ? modal.querySelector('.modal-overlay') : null;
    const modalClose = modal ? modal.querySelector('.modal-close') : null;
    
    if (!modal) {
        console.log('Модальное окно не найдено');
        return;
    }
    
    // Функция открытия модального окна
    function openModal(productCard) {
        const name = productCard.dataset.productName || 'Товар';
        const description = productCard.dataset.productDescription || 'Описание отсутствует';
        const price = productCard.dataset.productPrice || 'Цена по запросу';
        const image = productCard.dataset.productImage || '';
        const marketplace = productCard.dataset.productMarketplace || '#';
        const offers = productCard.dataset.productOffers || '0';
        
        // Заполняем модальное окно данными
        document.getElementById('modalName').textContent = name;
        document.getElementById('modalDescription').textContent = description;
        document.getElementById('modalOffers').textContent = offers;
        
        // Ссылка на маркетплейс
        const modalLink = document.getElementById('modalLink');
        if (marketplace && marketplace !== '#') {
            modalLink.href = marketplace;
            modalLink.style.display = 'flex';
        } else {
            modalLink.style.display = 'none';
        }
        
        // Изображение
        const modalImage = document.getElementById('modalImage');
        if (image) {
            modalImage.innerHTML = '<img src="' + image + '" alt="' + name + '" style="width:100%;height:100%;object-fit:cover;">';
        } else {
            modalImage.innerHTML = '🛍';
        }
        
        // Показываем модальное окно - убираем класс hidden
        modal.classList.remove('hidden');
        modal.setAttribute('aria-hidden', 'false');
        
        // Блокируем прокрутку фона
        document.body.style.overflow = 'hidden';
    }
    
    // Функция закрытия модального окна
    function closeModal() {
        modal.classList.add('hidden');
        modal.setAttribute('aria-hidden', 'true');
        
        // Разблокируем прокрутку фона
        document.body.style.overflow = '';
    }
    
    // Навешиваем обработчики на карточки товаров
    productCards.forEach(function(card) {
        card.addEventListener('click', function() {
            openModal(this);
        });
    });
    
    // Закрытие по клику на крестик
    if (modalClose) {
        modalClose.addEventListener('click', function(e) {
            e.preventDefault();
            closeModal();
        });
    }
    
    // Закрытие по клику на затемнение (backdrop)
    if (modalOverlay) {
        modalOverlay.addEventListener('click', function(e) {
            e.preventDefault();
            closeModal();
        });
    }
    
    // Закрытие по клавише Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && !modal.classList.contains('hidden')) {
            closeModal();
        }
    });
    
    console.log('Partners.js загружен. Модальные окна готовы к работе.');
});
