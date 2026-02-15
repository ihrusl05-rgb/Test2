document.addEventListener("DOMContentLoaded", () => {
    initSearch();
    initCategoryLinks();
    initProductClicks();
    initModalControls();
});

function initSearch() {
    const input =
        document.getElementById("productSearchInput") ||
        document.querySelector('input[name="q"]');
    if (!input) return;

    input.addEventListener(
        "input",
        debounce((e) => {
            applySearchQuery((e.target.value || "").trim());
        }, 350),
    );

    input.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            input.value = "";
            applySearchQuery("");
            return;
        }

        if (e.key === "Enter") {
            e.preventDefault();
            applySearchQuery((input.value || "").trim());
        }
    });
}

function applySearchQuery(query) {
    const current = new URL(window.location.href);
    const normalizedQuery = query.trim();
    const currentQuery = (current.searchParams.get("q") || "").trim();
    if (normalizedQuery === currentQuery) return;

    if (normalizedQuery) {
        current.searchParams.set("q", normalizedQuery);
    } else {
        current.searchParams.delete("q");
    }

    // Any new search should start from the first page.
    current.searchParams.delete("page");
    window.location.assign(current.toString());
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
