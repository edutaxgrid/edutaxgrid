// assets/js/script.js

// Wrap everything to avoid polluting global scope
(function () {
  // ------------------ UTILITIES ------------------

  function $(selector, scope = document) {
    return scope.querySelector(selector);
  }

  function $all(selector, scope = document) {
    return Array.from(scope.querySelectorAll(selector));
  }

  function onReady(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  function navigateTo(url) {
    window.location.href = url;
  }

  // Simple toast / snackbar at bottom
  let toastTimeout;

  function showToast(message) {
    let toast = $("#eg-toast");
    if (!toast) {
      toast = document.createElement("div");
      toast.id = "eg-toast";
      toast.style.position = "fixed";
      toast.style.left = "50%";
      toast.style.bottom = "20px";
      toast.style.transform = "translateX(-50%)";
      toast.style.padding = "10px 16px";
      toast.style.borderRadius = "999px";
      toast.style.fontSize = "0.85rem";
      toast.style.zIndex = "9999";
      toast.style.background = "rgba(20,20,20,0.95)";
      toast.style.color = "#f5f5f5";
      toast.style.boxShadow = "0 10px 30px rgba(0,0,0,0.5)";
      toast.style.opacity = "0";
      toast.style.pointerEvents = "none";
      toast.style.transition = "opacity 0.2s ease-out";
      document.body.appendChild(toast);
    }

    toast.textContent = message;
    toast.style.opacity = "1";

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toast.style.opacity = "0";
    }, 2200);
  }

  // ------------------ NAVBAR & CART ------------------

  function updateCartCountBadge() {
    const badge = "[data-cart-count]";
    const el = $(badge);
    if (!el || !window.ProductStore) return;

    const count = window.ProductStore.getCartCount();
    el.textContent = count > 9 ? "9+" : count;
    el.style.display = count > 0 ? "inline-flex" : "none";
  }

  // Expose so other scripts / HTML inline handlers can refresh cart icon
  function refreshCartCount() {
    updateCartCountBadge();
  }

  // Burger menu for mobile
  function initNavbar() {
    const burger = $("[data-burger-toggle]");
    const menu = $("[data-burger-menu]");

    if (burger && menu) {
      burger.addEventListener("click", () => {
        const isOpen = menu.getAttribute("data-open") === "true";
        if (isOpen) {
          menu.setAttribute("data-open", "false");
          menu.style.maxHeight = "0";
          menu.style.opacity = "0";
        } else {
          menu.setAttribute("data-open", "true");
          menu.style.maxHeight = menu.scrollHeight + "px";
          menu.style.opacity = "1";
        }
      });
    }

    // Cart badge initial render
    updateCartCountBadge();

    // Navbar links using data attributes
    $all("[data-nav-link]").forEach((link) => {
      const target = link.getAttribute("data-nav-link");
      if (!target) return;

      link.addEventListener("click", (e) => {
        // For buttons, prevent default if needed
        if (link.tagName.toLowerCase() === "button" || link.hasAttribute("data-button")) {
          e.preventDefault();
        }

        switch (target) {
          case "home":
            navigateTo("index.html");
            break;
          case "store":
            navigateTo("store.html");
            break;
          case "cart":
            navigateTo("cart.html");
            break;
          case "faq":
            scrollToSection("faq");
            break;
          case "feedback":
            scrollToSection("feedback");
            break;
          case "signin":
            navigateTo("signin.html");
            break;
          case "profile":
            navigateTo("profile.html");
            break;
          default:
            break;
        }
      });
    });
  }

  function scrollToSection(id) {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // ------------------ CTA BUTTONS & GENERIC HANDLERS ------------------

  function initCTA() {
    // Generic go-to-page CTAs
    $all("[data-go-to-page]").forEach((btn) => {
      const target = btn.getAttribute("data-go-to-page");
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        if (target === "store") navigateTo("store.html");
        else if (target === "home") navigateTo("index.html");
      });
    });

    // Scroll CTAs (for FAQ, feedback etc.)
    $all("[data-scroll-target]").forEach((btn) => {
      const id = btn.getAttribute("data-scroll-target");
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        scrollToSection(id);
      });
    });

    // Global "back to top"
    const backTop = $("[data-back-to-top]");
    if (backTop) {
      backTop.addEventListener("click", (e) => {
        e.preventDefault();
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }
  }

  // ------------------ HOME PAGE (index.html) ------------------

  function initHomePage() {
    const recommendedContainer = $("#home-recommended");
    const searchForm = $("#home-search-form");
    const searchInput = $("#home-search-input");

    // Recommended products
    if (recommendedContainer && window.ProductStore) {
      const products = window.ProductStore.getRecommendedProducts(4);
      renderProductCards(recommendedContainer, products, {
        compact: true
      });
    }

    // Home search → redirect to store.html?q=...
    if (searchForm && searchInput) {
      searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const q = searchInput.value.trim();
        const url = q ? `store.html?q=${encodeURIComponent(q)}` : "store.html";
        navigateTo(url);
      });
    }
  }

  // ------------------ STORE PAGE (store.html) ------------------

  function initStorePage() {
    const grid = $("#store-grid");
    if (!grid || !window.ProductStore) return;

    const searchInput = $("#store-search-input");
    const searchForm = $("#store-search-form");
    const categoryButtons = $all("[data-category-filter]");

    // Initial products: either search query from URL or all
    const params = new URLSearchParams(window.location.search);
    const q = params.get("q") || "";
    if (searchInput) searchInput.value = q;

    let currentProducts;
    if (q) {
      currentProducts = window.ProductStore.searchProducts(q);
    } else {
      currentProducts = window.ProductStore.getAllProducts();
    }
    renderProductCards(grid, currentProducts);

    // Search within store
    if (searchForm && searchInput) {
      searchForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const text = searchInput.value.trim();
        const result = window.ProductStore.searchProducts(text);
        renderProductCards(grid, result);
      });
    }

    // Category filter buttons
    categoryButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const cat = btn.getAttribute("data-category-filter");
        categoryButtons.forEach((b) => b.classList.remove("active-category"));
        btn.classList.add("active-category");

        if (!cat || cat === "all") {
          currentProducts = window.ProductStore.getAllProducts();
        } else {
          currentProducts = window.ProductStore.getProductsByCategory(cat);
        }
        renderProductCards(grid, currentProducts);
      });
    });
  }

  // Render product cards in any container
  function renderProductCards(container, products, options = {}) {
    const compact = options.compact || false;

    if (!products || products.length === 0) {
      container.innerHTML =
        '<p class="eg-empty-state">No products found. Try a different search or category.</p>';
      return;
    }

    const cardsHtml = products
      .map((p) => {
        const priceNow = window.ProductStore.formatCurrency(p.discountedPrice);
        const priceOld = window.ProductStore.formatCurrency(p.originalPrice);

        return `
          <article class="eg-product-card ${compact ? "eg-product-card--compact" : ""}">
            <div class="eg-product-thumb">
              <img src="${p.coverImage}" alt="${escapeHtml(p.name)} cover" loading="lazy" />
              ${
                p.discountPercent
                  ? `<span class="eg-badge-discount">-${p.discountPercent}%</span>`
                  : ""
              }
            </div>
            <div class="eg-product-body">
              <h3 class="eg-product-title">${escapeHtml(p.name)}</h3>
              ${
                compact
                  ? ""
                  : `<p class="eg-product-meta">${escapeHtml(p.category)} • ${escapeHtml(
                      p.subject
                    )}</p>`
              }
              <div class="eg-price-row">
                <span class="eg-price-now">${priceNow}</span>
                <span class="eg-price-old">${priceOld}</span>
              </div>
              <div class="eg-product-actions">
                <button 
                  class="eg-btn eg-btn-primary" 
                  type="button"
                  data-add-to-cart
                  data-product-id="${p.id}">
                  Add to cart <i class="fa-solid fa-cart-shopping"></i>
                </button>
                <button 
                  class="eg-btn eg-btn-ghost" 
                  type="button"
                  data-view-product
                  data-product-id="${p.id}">
                  View details <i class="fa-solid fa-arrow-right"></i>
                </button>
              </div>
            </div>
          </article>
        `;
      })
      .join("");

    container.innerHTML = cardsHtml;

    // Attach button listeners
    attachProductActionHandlers(container);
  }

  function escapeHtml(str) {
    if (typeof str !== "string") return "";
    return str
      .replace(/&/g, "&amp;")
      .replace(/"/g, "&quot;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
  }

  function attachProductActionHandlers(scope) {
    // Add to cart
    $all("[data-add-to-cart]", scope).forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-product-id");
        if (!id || !window.ProductStore) return;

        window.ProductStore.addToCart(id, 1);
        refreshCartCount();
        showToast("Added to cart");
      });
    });

    // View details
    $all("[data-view-product]", scope).forEach((btn) => {
      btn.addEventListener("click", () => {
        const id = btn.getAttribute("data-product-id");
        if (!id) return;
        navigateTo(`product.html?id=${encodeURIComponent(id)}`);
      });
    });
  }

  // ------------------ PRODUCT PAGE (product.html) ------------------

  function initProductPage() {
    const container = $("#single-product");
    if (!container || !window.ProductStore) return;

    const params = new URLSearchParams(window.location.search);
    const id = params.get("id");
    if (!id) {
      container.innerHTML = `<p class="eg-empty-state">Product not found.</p>`;
      return;
    }

    const product = window.ProductStore.getProductById(id);
    if (!product) {
      container.innerHTML = `<p class="eg-empty-state">Product not found.</p>`;
      return;
    }

    renderSingleProduct(container, product);
  }

  function renderSingleProduct(container, p) {
    const priceNow = window.ProductStore.formatCurrency(p.discountedPrice);
    const priceOld = window.ProductStore.formatCurrency(p.originalPrice);

    const hasSamples = p.sampleImages && p.sampleImages.length > 0;

    const galleryHtml = hasSamples
      ? `
        <div class="eg-sample-gallery">
          ${p.sampleImages
            .slice(0, 3)
            .map(
              (src, index) => `
              <div class="eg-sample-item">
                <img src="${src}" alt="Sample page ${index + 1}" loading="lazy" />
              </div>
          `
            )
            .join("")}
        </div>
      `
      : "";

    container.innerHTML = `
      <article class="eg-product-detail">
        <div class="eg-product-detail-media">
          <img src="${p.coverImage}" alt="${escapeHtml(p.name)} cover" loading="lazy" />
          ${galleryHtml}
        </div>
        <div class="eg-product-detail-info">
          <h1 class="eg-product-detail-title">${escapeHtml(p.name)}</h1>
          <p class="eg-product-detail-meta">
            ${escapeHtml(p.category)} • ${escapeHtml(p.subject)} ${
      p.board ? "• " + escapeHtml(p.board) : ""
    }
          </p>
          <div class="eg-product-detail-price-row">
            <span class="eg-price-now">${priceNow}</span>
            <span class="eg-price-old">${priceOld}</span>
            ${
              p.discountPercent
                ? `<span class="eg-badge-discount">-${p.discountPercent}%</span>`
                : ""
            }
          </div>
          <p class="eg-product-detail-description">
            ${escapeHtml(p.description || "")}
          </p>
          <div class="eg-product-detail-actions">
            <button 
              class="eg-btn eg-btn-primary eg-btn-lg"
              type="button"
              data-add-to-cart
              data-product-id="${p.id}">
              Add to cart
            </button>
            <button 
              class="eg-btn eg-btn-ghost"
              type="button"
              data-go-to-page="store">
              Back to store
            </button>
          </div>
        </div>
      </article>
    `;

    // Attach handlers to the new buttons
    attachProductActionHandlers(container);
    initCTA();
  }

  // ------------------ PAYMENT PAGE (payment.html) ------------------

  let thankYouTimerId = null;
  let thankYouCountdownId = null;

  function initPaymentPage() {
    const section1 = $('[data-payment-section="1"]');
    const section2 = $('[data-payment-section="2"]');
    const section3 = $('[data-payment-section="3"]');

    if (!section1 && !section2 && !section3) return; // Not on payment page

    const proceedBtn = $("#payment-step1-proceed");
    const agreeCheckbox = $("#payment-step1-agree");

    if (proceedBtn && agreeCheckbox && section1 && section2) {
      proceedBtn.addEventListener("click", () => {
        if (!agreeCheckbox.checked) {
          showToast("Please confirm the checkbox first.");
          return;
        }

        // NOTE: authentication.js can also check login state and redirect if needed.
        section1.style.display = "none";
        section2.style.display = "block";
        window.scrollTo({ top: 0, behavior: "smooth" });
      });
    }

    // Ensure section visibility default (JS override in case CSS different)
    if (section1) section1.style.display = "block";
    if (section2) section2.style.display = "none";
    if (section3) section3.style.display = "none";
  }

  function startPaymentThankYouFlow() {
    const section2 = $('[data-payment-section="2"]');
    const section3 = $('[data-payment-section="3"]');
    const countdownSpan = $("[data-thankyou-timer]");

    if (!section2 || !section3) return;

    section2.style.display = "none";
    section3.style.display = "block";

    window.scrollTo({ top: 0, behavior: "smooth" });

    // Clear previous timers if any
    if (thankYouTimerId) clearTimeout(thankYouTimerId);
    if (thankYouCountdownId) clearInterval(thankYouCountdownId);

    let remaining = 20;
    if (countdownSpan) {
      countdownSpan.textContent = remaining.toString();
    }

    thankYouCountdownId = setInterval(() => {
      remaining -= 1;
      if (remaining <= 0) {
        clearInterval(thankYouCountdownId);
        return;
      }
      if (countdownSpan) {
        countdownSpan.textContent = remaining.toString();
      }
    }, 1000);

    thankYouTimerId = setTimeout(() => {
      navigateTo("index.html");
    }, 20000);
  }

  // Expose payment thank-you entry so authentication.js can trigger it
  window.PageFlow = window.PageFlow || {};
  window.PageFlow.startPaymentThankYouFlow = startPaymentThankYouFlow;

  // ------------------ INIT ON PAGE LOAD ------------------

  onReady(() => {
    initNavbar();
    initCTA();
    initHomePage();
    initStorePage();
    initProductPage();
    initPaymentPage();

    // Make refreshCartCount public
    window.CartUI = window.CartUI || {};
    window.CartUI.refreshCartCount = refreshCartCount;

    // Initial refresh for cart
    refreshCartCount();
  });
})();