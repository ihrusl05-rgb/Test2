let currentCategory = 0;
let currentSearchQuery = "";

document.addEventListener("DOMContentLoaded", () => {
    initCategoryState();
    initSearch();
    initCategoryLinks();
    initProductClicks();
    initModalControls();
    filterProducts();
});

function initCategoryState() {
    const active = document.querySelector(".category-card.active");
    currentCategory = active ? parseInt(active.dataset.categoryId || "0", 10) : 0;
}

function initSearch() {
    const input = document.getElementById("searchInput");
    if (!input) return;

    input.addEventListener(
        "input",
        debounce((e) => {
            currentSearchQuery = (e.target.value || "").toLowerCase().trim();
            filterProducts();
        }, 180),
    );

    input.addEventListener("keydown", (e) => {
        if (e.key !== "Escape") return;
        input.value = "";
        currentSearchQuery = "";
        filterProducts();
    });
}

function initCategoryLinks() {
    document.querySelectorAll(".category-card").forEach((card) => {
        card.addEventListener("click", (e) => {
            const targetUrl = card.dataset.categoryUrl || "";
            if (targetUrl && !isModifiedClick(e)) {
                e.preventDefault();
                window.location.assign(targetUrl);
            }
        });
    });
}

function isModifiedClick(e) {
    return e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0;
}

function filterProducts() {
    const cards = document.querySelectorAll(".product-card");
    let visibleCount = 0;

    cards.forEach((card) => {
        const categoryId = parseInt(card.dataset.categoryId || "0", 10);
        const name = (card.querySelector(".product-name")?.textContent || "").toLowerCase();
        const desc = (card.querySelector(".product-description")?.textContent || "").toLowerCase();

        const categoryMatch = currentCategory === 0 || categoryId === currentCategory;
        const searchMatch =
            currentSearchQuery.length === 0 ||
            name.includes(currentSearchQuery) ||
            desc.includes(currentSearchQuery);

        const show = categoryMatch && searchMatch;
        card.style.display = show ? "block" : "none";
        if (show) visibleCount += 1;
    });

    updateResultsCounter(visibleCount);
    updateEmptyState(visibleCount);
}

function updateResultsCounter(count) {
    const counter = document.getElementById("resultsCounter");
    if (!counter) return;
    counter.textContent = `Найдено ${count} предложений`;
}

function updateEmptyState(visibleCount) {
    const grid = document.getElementById("productsGrid");
    if (!grid) return;

    let empty = grid.querySelector(".empty-state-modern.js-empty-state");
    if (visibleCount === 0) {
        if (!empty) {
            empty = document.createElement("div");
            empty.className = "empty-state-modern js-empty-state";
            empty.innerHTML = "<h3>Ничего не найдено</h3><p>Попробуйте изменить запрос.</p>";
            grid.appendChild(empty);
        }
        empty.style.display = "block";
    } else if (empty) {
        empty.style.display = "none";
    }
}

function initProductClicks() {
    const grid = document.getElementById("productsGrid");
    if (!grid) return;

    grid.addEventListener("click", (e) => {
        const card = e.target.closest(".product-card");
        if (!card) return;
        const productId = card.dataset.productId;
        if (!productId) return;
        openProductModal(productId, card);
    });
}

function initModalControls() {
    const modal = document.getElementById("productModal");
    if (!modal) return;

    modal.querySelector(".modal-overlay")?.addEventListener("click", closeProductModal);
    modal.querySelector(".modal-close")?.addEventListener("click", closeProductModal);

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && !modal.classList.contains("hidden")) {
            closeProductModal();
        }
    });
}

function openProductModal(productId, cardEl) {
    const modal = document.getElementById("productModal");
    if (!modal) return;

    const grid = document.getElementById("productsGrid");
    const templateUrl = grid?.dataset.productApiTemplate || "/partners/api/product/0/";
    const apiUrl = templateUrl.replace(/0\/$/, `${productId}/`);

    fetch(apiUrl)
        .then((resp) => {
            if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
            return resp.json();
        })
        .then((data) => {
            if (!data.success) throw new Error("api_failed");
            const merged = {
                ...fallbackFromCard(cardEl),
                ...data,
            };
            populateModalContent(merged);
            showProductModal();
        })
        .catch(() => {
            populateModalContent(fallbackFromCard(cardEl));
            showProductModal();
        });
}

function fallbackFromCard(cardEl) {
    return {
        name: cardEl?.querySelector(".product-name")?.textContent?.trim() || "Предложение",
        description: cardEl?.querySelector(".product-description")?.textContent?.trim() || "",
        count_offers: 1,
        marketplace_url: "#",
        image_url: cardEl?.querySelector(".product-image-wrap img")?.src || "",
        category_name: cardEl?.querySelector(".product-badge")?.textContent?.trim() || "Специальное предложение",
    };
}

function populateModalContent(data) {
    const name = document.getElementById("modalName");
    const description = document.getElementById("modalDescription");
    const offers = document.getElementById("modalOffers");
    const category = document.getElementById("modalCategory");
    const link = document.getElementById("modalLink");
    const image = document.getElementById("modalImage");

    if (name) name.textContent = data.name || "";
    if (description) description.textContent = data.description || "";
    if (offers) offers.textContent = data.count_offers || 0;
    if (category) category.textContent = data.category_name || "Специальное предложение";
    if (link) link.href = data.marketplace_url || "#";

    if (image) {
        if (data.image_url) {
            image.innerHTML = `<img src="${data.image_url}" alt="${escapeHtml(data.name || "")}" loading="lazy">`;
        } else {
            image.textContent = "🛍";
        }
    }
}

function showProductModal() {
    const modal = document.getElementById("productModal");
    if (!modal) return;
    modal.classList.remove("hidden");
    document.body.style.overflow = "hidden";
}

function closeProductModal() {
    const modal = document.getElementById("productModal");
    if (!modal) return;
    modal.classList.add("hidden");
    document.body.style.overflow = "auto";
}

function escapeHtml(str) {
    return str
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}

function debounce(fn, ms) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), ms);
    };
}
