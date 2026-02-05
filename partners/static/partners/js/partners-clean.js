// partners-clean.js — чистая, минимальная версия
let currentCategory = 0;
let currentSearchQuery = '';

document.addEventListener('DOMContentLoaded', () => {
    initSearch();
    initCategories();
    initEventListeners();
    initLazyImages();
});

function initSearch() {
    const input = document.getElementById('searchInput');
    if (!input) return;
    input.addEventListener('input', debounce(e => { currentSearchQuery = e.target.value.toLowerCase().trim(); filterProducts(); }, 200));
    input.addEventListener('keydown', e => { if (e.key === 'Escape') { input.value = ''; currentSearchQuery = ''; filterProducts(); } });
}

function initCategories() {
    document.querySelectorAll('.category-card').forEach(card => {
        card.addEventListener('click', function () {
            const id = parseInt(this.dataset.categoryId) || 0;
            currentCategory = id;
            document.querySelectorAll('.category-card').forEach(c => c.classList.remove('active'));
            this.classList.add('active');
            filterProducts();
        });
    });
    const first = document.querySelector('.category-card'); if (first) first.classList.add('active');
}

function filterProducts() {
    const cards = document.querySelectorAll('.product-card');
    let visible = 0;
    cards.forEach(card => {
        const cid = parseInt(card.dataset.categoryId) || 0;
        const name = (card.querySelector('.product-name')?.textContent || '').toLowerCase();
        const desc = (card.querySelector('.product-description')?.textContent || '').toLowerCase();
        const catMatch = (currentCategory === 0 || cid === currentCategory);
        const searchMatch = (currentSearchQuery === '' || name.includes(currentSearchQuery) || desc.includes(currentSearchQuery));
        if (catMatch && searchMatch) { card.style.display = 'block'; visible++; setTimeout(() => card.style.opacity = '1', 10); }
        else { card.style.display = 'none'; card.style.opacity = '0'; }
    });
    updateEmptyState(visible);
}

function updateEmptyState(visible) {
    let es = document.querySelector('.empty-state');
    if (visible === 0) {
        if (!es) {
            const grid = document.getElementById('productsGrid');
            es = document.createElement('div'); es.className = 'empty-state'; es.textContent = '📭 Нет результатов по вашему запросу';
            grid.appendChild(es);
        }
        es.style.display = 'block';
    } else if (es) es.style.display = 'none';
}

function initEventListeners() {
    const grid = document.getElementById('productsGrid');
    if (grid) {
        grid.addEventListener('click', function (e) {
            const card = e.target.closest('.product-card');
            if (!card) return;
            const id = card.dataset.productId;
            if (id) openProductModal(id);
        });
    }
    const modal = document.getElementById('productModal');
    const overlay = modal?.querySelector('.modal-overlay'); if (overlay) overlay.addEventListener('click', closeProductModal);
    const closeBtn = modal?.querySelector('.modal-close'); if (closeBtn) closeBtn.addEventListener('click', closeProductModal);
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal && !modal.classList.contains('hidden')) closeProductModal(); });
}

function openProductModal(productId) {
    const modal = document.getElementById('productModal');
    if (!modal) { console.error('Modal not found'); return; }
    const apiBase = document.querySelector('[data-product-api]')?.dataset.productApi || '/partners/api/product/';
    const apiUrl = apiBase.endsWith('/') ? `${apiBase}${productId}/` : `${apiBase}/${productId}/`;
    fetch(apiUrl)
        .then(r => { if (!r.ok) throw new Error(`HTTP ${r.status}`); return r.json(); })
        .then(data => { if (data.success) { populateModalContent(data); modal.classList.remove('hidden'); document.body.style.overflow = 'hidden'; } else { console.error('Ошибка при загрузке товара'); } })
        .catch(err => { console.error(err); });
}

function populateModalContent(data) {
    document.getElementById('modalName').textContent = data.name || '';
    document.getElementById('modalDescription').textContent = data.description || '';
    document.getElementById('modalOffers').textContent = `📦 ${data.count_offers || 0} предложений`;
    const link = document.getElementById('modalLink'); if (link) link.href = data.marketplace_url || '#';
    const mi = document.getElementById('modalImage');
    if (mi) {
        if (data.image_url) { mi.innerHTML = `<img src="${data.image_url}" alt="${data.name || ''}" loading="lazy">`; mi.classList.remove('placeholder'); }
        else { mi.innerHTML = '🏷️'; mi.classList.add('placeholder'); }
    }
}

function closeProductModal() { const modal = document.getElementById('productModal'); if (modal) { modal.classList.add('hidden'); document.body.style.overflow = 'auto'; } }

function initLazyImages() { if (!('IntersectionObserver' in window)) return; const io = new IntersectionObserver((entries, obs) => { entries.forEach(entry => { if (entry.isIntersecting) { const img = entry.target; if (img.dataset.src) { img.src = img.dataset.src; img.removeAttribute('data-src'); obs.unobserve(img); } } }); }); document.querySelectorAll('img[data-src]').forEach(img => io.observe(img)); }

function debounce(fn, t) { let timeout; return function (...a) { clearTimeout(timeout); timeout = setTimeout(() => fn.apply(this, a), t); }; }
