// assets/js/product.js

// Namespace to avoid polluting global scope too much
(function () {
  // ---------- Helper: Safe localStorage ----------
  const STORAGE_KEY = "edutaxgrid_cart";

  function loadCart() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch (err) {
      console.error("Error reading cart from localStorage:", err);
      return [];
    }
  }

  function saveCart(cart) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } catch (err) {
      console.error("Error saving cart to localStorage:", err);
    }
  }

  // ---------- Products Database ----------

  const products = [
    {
      id: "math10_full_notes",
      name: "Class 10 CBSE Maths Full Notes (English)",
      coverImage: "assets/images/p-math10-notes.png",
      originalPrice: 199,
      discountPercent: 40, // 40% OFF
      category: "Class 10",
      subject: "Mathematics",
      board: "CBSE",
      language: "English",
      isRecommended: true,
      sampleImages: [
        "assets/images/sample-math10-1.png",
        "assets/images/sample-math10-2.png"
      ],
      description:
        "Complete Class 10 CBSE Maths notes with chapter-wise explanations, formulas, and important questions. Perfect for last-minute revision and board exam preparation."
    },
    {
      id: "sci10_quick_revision",
      name: "Class 10 Science Quick Revision Notes",
      coverImage: "assets/images/p-sci10-quickrev.png",
      originalPrice: 149,
      discountPercent: 35,
      category: "Class 10",
      subject: "Science",
      board: "CBSE",
      language: "English",
      isRecommended: true,
      sampleImages: [
        "assets/images/sample-sci10-1.png"
      ],
      description:
        "Short, crisp Class 10 Science notes covering Physics, Chemistry and Biology. Designed for fast revision before exams with diagrams and bullet points."
    },
    {
      id: "eng10_writing_pack",
      name: "Class 10 English Writing Skills Pack",
      coverImage: "assets/images/p-eng10-writing.png",
      originalPrice: 129,
      discountPercent: 45,
      category: "Class 10",
      subject: "English",
      board: "CBSE",
      language: "English",
      isRecommended: false,
      sampleImages: [],
      description:
        "Important formats and sample answers for letters, articles, notices, and speeches for Class 10 boards. Score-boosting content with examiner-friendly language."
    },
    {
      id: "math9_concept_notes",
      name: "Class 9 Maths Concept Notes",
      coverImage: "assets/images/p-std9-maths.png",
      originalPrice: 149,
      discountPercent: 30,
      category: "Class 9",
      subject: "Mathematics",
      board: "CBSE",
      language: "English",
      isRecommended: false,
      sampleImages: [],
      description:
        "Concept-focused maths notes for Class 9 with solved examples and tips to build strong basics before Class 10."
    },
    {
      id: "accounts12_full_ebook",
      name: "Class 12 Accountancy Full Ebook",
      coverImage: "assets/images/p-std12-accounts.png",
      originalPrice: 249,
      discountPercent: 40,
      category: "Class 12",
      subject: "Accountancy",
      board: "CBSE",
      language: "English",
      isRecommended: true,
      sampleImages: [
        "assets/images/sample-accounts12-1.png"
      ],
      description:
        "Detailed Class 12 Accountancy ebook with journal entries, ledgers, financial statements, and project guidance. Suitable for commerce students targeting high scores."
    },
    {
      id: "physics12_revision_bundle",
      name: "Class 12 Physics Revision Bundle (PCM)",
      coverImage: "assets/images/p-std12-physics.png",
      originalPrice: 299,
      discountPercent: 50,
      category: "Class 12",
      subject: "Physics",
      board: "CBSE",
      language: "English",
      isRecommended: true,
      sampleImages: [],
      description:
        "Compact revision notes for Class 12 Physics including derivations, formulas, important graphs, and previous-year style questions."
    },
    {
      id: "neet_bio_crash_notes",
      name: "NEET Biology Crash Notes",
      coverImage: "assets/images/p-neet-bio.png",
      originalPrice: 399,
      discountPercent: 50,
      category: "Entrance",
      subject: "Biology",
      board: "NEET",
      language: "English",
      isRecommended: true,
      sampleImages: [
        "assets/images/sample-neetbio-1.png"
      ],
      description:
        "High-yield NEET Biology notes covering NCERT in a question-oriented way. Ideal for last month crash revision."
    },
    {
      id: "jee_maths_formulas",
      name: "JEE Main Maths Formula & PYQ Pack",
      coverImage: "assets/images/p-jee-maths.png",
      originalPrice: 349,
      discountPercent: 45,
      category: "Entrance",
      subject: "Mathematics",
      board: "JEE",
      language: "English",
      isRecommended: false,
      sampleImages: [],
      description:
        "Formula sheets + chapter-wise previous year questions set for JEE Main Maths to sharpen problem-solving speed."
    },
    {
      id: "motivation_quotes_ebook",
      name: "Student Motivation Quotes Ebook (Bilingual)",
      coverImage: "assets/images/p-motivation-quotes.png",
      originalPrice: 99,
      discountPercent: 50,
      category: "General",
      subject: "Motivation",
      board: "All",
      language: "English + Hindi",
      isRecommended: false,
      sampleImages: [],
      description:
        "Curated motivational quotes for students in both English and Hindi, designed to keep you consistent during exam season."
    },
    {
      id: "study_planner_productivity",
      name: "Ultimate Study Planner & Productivity Guide (PDF)",
      coverImage: "assets/images/p-productivity-ebook.png",
      originalPrice: 129,
      discountPercent: 40,
      category: "General",
      subject: "Productivity",
      board: "All",
      language: "English",
      isRecommended: true,
      sampleImages: [],
      description:
        "Printable study planner templates + productivity tips to plan your day, track habits, and stay focused throughout the year."
    }
  ];

  // ---------- Utility Functions ----------

  function getDiscountedPrice(product) {
    const discount = (product.originalPrice * product.discountPercent) / 100;
    return Math.round(product.originalPrice - discount);
  }

  function formatCurrency(amount) {
    // Simple INR formatting
    return "₹" + amount;
  }

  // ---------- Product Query Functions ----------

  function getAllProducts() {
    return products.map((p) => ({
      ...p,
      discountedPrice: getDiscountedPrice(p)
    }));
  }

  function getProductById(id) {
    const p = products.find((prod) => prod.id === id);
    return p
      ? { ...p, discountedPrice: getDiscountedPrice(p) }
      : null;
  }

  function getRecommendedProducts(count = 4) {
    const recommended = products.filter((p) => p.isRecommended);
    const pool = recommended.length ? recommended : products;

    // Shuffle copy
    const arr = [...pool];
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }

    return arr.slice(0, count).map((p) => ({
      ...p,
      discountedPrice: getDiscountedPrice(p)
    }));
  }

  function getProductsByCategory(category) {
    return products
      .filter((p) => p.category === category)
      .map((p) => ({
        ...p,
        discountedPrice: getDiscountedPrice(p)
      }));
  }

  function searchProducts(query) {
    const q = query.trim().toLowerCase();
    if (!q) return getAllProducts();

    return products
      .filter((p) => {
        return (
          p.name.toLowerCase().includes(q) ||
          p.subject.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.board.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q))
        );
      })
      .map((p) => ({
        ...p,
        discountedPrice: getDiscountedPrice(p)
      }));
  }

  // ---------- Cart Functions ----------

  function getCart() {
    const cart = loadCart();
    // cart = [{ productId, quantity }]
    return cart;
  }

  function getCartDetailed() {
    const cart = loadCart();
    return cart
      .map((item) => {
        const product = getProductById(item.productId);
        if (!product) return null;
        return {
          ...item,
          product,
          lineTotal: product.discountedPrice * item.quantity
        };
      })
      .filter(Boolean);
  }

  function getCartCount() {
    const cart = loadCart();
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }

  function getCartTotal() {
    const detailed = getCartDetailed();
    return detailed.reduce((sum, item) => sum + item.lineTotal, 0);
  }

  function addToCart(productId, quantity = 1) {
    const cart = loadCart();
    const existing = cart.find((item) => item.productId === productId);

    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.push({ productId, quantity });
    }

    saveCart(cart);
    return getCartCount();
  }

  function updateCartItem(productId, quantity) {
    const cart = loadCart();
    const existing = cart.find((item) => item.productId === productId);

    if (!existing) return getCartCount();

    if (quantity <= 0) {
      const filtered = cart.filter((item) => item.productId !== productId);
      saveCart(filtered);
    } else {
      existing.quantity = quantity;
      saveCart(cart);
    }

    return getCartCount();
  }

  function removeFromCart(productId) {
    const cart = loadCart();
    const filtered = cart.filter((item) => item.productId !== productId);
    saveCart(filtered);
    return getCartCount();
  }

  function clearCart() {
    saveCart([]);
    return 0;
  }

  // ---------- Expose to global ----------

  window.ProductStore = {
    // data access
    getAllProducts,
    getProductById,
    getRecommendedProducts,
    getProductsByCategory,
    searchProducts,

    // cart
    getCart,
    getCartDetailed,
    getCartCount,
    getCartTotal,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,

    // helpers
    formatCurrency,
    getDiscountedPrice
  };
})();