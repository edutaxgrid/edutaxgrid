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

  // ⭐ ALL CHAPTER KEY POINTS PACK — (199)
  {
    id: "math10_all_chapter_keypoints",
    name: "Class 10 Maths Complete Key-Points & Theorem Handbook",
    coverImage: "assets/images/p-math10-all-keypoints.png",
    originalPrice: 249, // 20% OFF => 199
    discountPercent: 20,
    category: "Class 10",
    subject: "Mathematics",
    board: "CBSE",
    language: "English",
    isRecommended: false,
    sampleImages: [],
    description:
      "Class 10 Maths all chapters key-points and theorems in a clean, exam-ready format. Ideal for quick revision and boosting board exam accuracy."
  },

  // ⭐ MIND MAP PACK — (49) — RECOMMENDED
  {
    id: "math10_full_mindmap_pack",
    name: "Class 10 Maths Full Syllabus Mind Map Pack (Visual Revision)",
    coverImage: "assets/images/p-math10-mindmaps.png",
    originalPrice: 70, // 30% OFF => 49
    discountPercent: 30,
    category: "Class 10",
    subject: "Mathematics",
    board: "CBSE",
    language: "English",
    isRecommended: true,
    sampleImages: [],
    description:
      "Visual mind maps for all Class 10 Maths chapters to revise the entire syllabus in minutes. Designed for fast memory recall during boards."
  },

  // ⭐ PYQ PACK — (49) — RECOMMENDED
  {
    id: "math10_pyq_full_pack",
    name: "Class 10 Maths PYQ + Important Question Bank",
    coverImage: "assets/images/p-math10-pyq.png",
    originalPrice: 82, // 40% OFF => 49
    discountPercent: 40,
    category: "Class 10",
    subject: "Mathematics",
    board: "CBSE",
    language: "English",
    isRecommended: false,
    sampleImages: [],
    description:
      "Chapter-wise solved Class 10 Maths PYQ with exam-style questions. Perfect for understanding board trends and scoring high."
  },

  // ⭐ FORMULA BOOK — (29)
  {
    id: "math10_formula_theorem_book",
    name: "Class 10 Maths Ultimate Formula & Theorem Book",
    coverImage: "assets/images/p-math10-formula-book.png",
    originalPrice: 36, // 20% OFF => 29
    discountPercent: 20,
    category: "Class 10",
    subject: "Mathematics",
    board: "CBSE",
    language: "English",
    isRecommended: false,
    sampleImages: [],
    description:
      "A compact formula and theorem book covering the full Class 10 Maths syllabus. Perfect for daily revision and quick exam preparation."
  },

  // ⭐ LAST TIME NOTES — (49)
  {
    id: "math10_last_time_notes",
    name: "Class 10 Maths Last-Minute Smart Revision Notes",
    coverImage: "assets/images/p-math10-lasttime.png",
    originalPrice: 61, // 20% OFF => 49
    discountPercent: 20,
    category: "Class 10",
    subject: "Mathematics",
    board: "CBSE",
    language: "English",
    isRecommended: false,
    sampleImages: [],
    description:
      "Super-concise revision notes for Class 10 Maths designed for exam-day prep. Covers all must-know formulas, theorems, and scoring tips."
  },

  // ⭐ REAL NUMBERS — (19)
  {
    id: "math10_real_numbers_all_in_one",
    name: "Class 10 Real Numbers Complete Revision Kit",
    coverImage: "assets/images/p-math10-realnumbers.png",
    originalPrice: 0, // 20% OFF => 19
    discountPercent: 0,
    category: "Class 10",
    subject: "Mathematics",
    board: "CBSE",
    language: "English",
    isRecommended: true,
    sampleImages: [],
    description:
      "Real Numbers chapter notes with key points, Euclid concepts, mind map, PYQ, and practice questions. Best for quick and complete chapter coverage."
  },

  // ⭐ POLYNOMIALS — (19)
  {
    id: "math10_polynomials_all_in_one",
    name: "Class 10 Polynomials All-in-One Notes + PYQ",
    coverImage: "assets/images/p-math10-polynomials.png",
    originalPrice: 0, // 30% OFF => 19
    discountPercent: 0,
    category: "Class 10",
    subject: "Mathematics",
    board: "CBSE",
    language: "English",
    isRecommended: true,
    sampleImages: [],
    description:
      "Polynomials chapter simplified with zero tricks, identities, mind map, PYQ and practice sets for stronger concept understanding."
  },

  // ⭐ LINEAR EQUATIONS — (29)
  {
    id: "math10_linear_equations_bundle",
    name: "Class 10 Linear Equations Concept Booster Pack",
    coverImage: "assets/images/p-math10-lineareq.png",
    originalPrice: 42, // 30% OFF => 29
    discountPercent: 30,
    category: "Class 10",
    subject: "Mathematics",
    board: "CBSE",
    language: "English",
    isRecommended: false,
    sampleImages: [],
    description:
      "Complete revision of Linear Equations in Two Variables with solved models, formulas, PYQ and exam-level practice questions."
  },

  // ⭐ QUADRATIC EQUATIONS — (29)
  {
    id: "math10_quadratic_equations_bundle",
    name: "Class 10 Quadratic Equations Master Practice Pack",
    coverImage: "assets/images/p-math10-quadratic.png",
    originalPrice: 41, // 30% OFF => 29
    discountPercent: 30,
    category: "Class 10",
    subject: "Mathematics",
    board: "CBSE",
    language: "English",
    isRecommended: false,
    sampleImages: [],
    description:
      "Quadratic Equations simplified with step-by-step formulas, solved types, PYQ and practice exercises to handle any board exam problem."
  },

  // ⭐ AP — (29)
  {
    id: "math10_arithmetic_progressions_bundle",
    name: "Class 10 Arithmetic Progressions Smart Revision Pack",
    coverImage: "assets/images/p-math10-ap.png",
    originalPrice: 36, // 20% OFF => 29
    discountPercent: 20,
    category: "Class 10",
    subject: "Mathematics",
    board: "CBSE",
    language: "English",
    isRecommended: false,
    sampleImages: [],
    description:
      "Complete AP notes including formulas, solved models, mind map, PYQ and exam-focused practice questions."
  },

  // ⭐ COORDINATE GEOMETRY — (29)
  {
    id: "math10_coordinate_geometry_bundle",
    name: "Class 10 Coordinate Geometry Exam-Ready Pack",
    coverImage: "assets/images/p-math10-coordinate-geometry.png",
    originalPrice: 48, // 40% OFF => 29
    discountPercent: 40,
    category: "Class 10",
    subject: "Mathematics",
    board: "CBSE",
    language: "English",
    isRecommended: false,
    sampleImages: [],
    description:
      "Distance formula, section formula and area concepts explained with visuals, PYQ and targeted practice sets for better accuracy."
  },

  // ⭐ TRIANGLES — (29)
  {
    id: "math10_triangles_bundle",
    name: "Class 10 Triangles Theorem + PYQ Practice Kit",
    coverImage: "assets/images/p-math10-triangles.png",
    originalPrice: 41, // 30% OFF => 29
    discountPercent: 30,
    category: "Class 10",
    subject: "Mathematics",
    board: "CBSE",
    language: "English",
    isRecommended: false,
    sampleImages: [],
    description:
      "Similarity theorems, proofs, key results, mind map and exam-level practice for mastering the Triangles chapter."
  },

  // ⭐ CIRCLES — (29)
  {
    id: "math10_circles_bundle",
    name: "Class 10 Circles & Tangents Quick Revision Pack",
    coverImage: "assets/images/p-math10-circles.png",
    originalPrice: 36, // 20% OFF => 29
    discountPercent: 20,
    category: "Class 10",
    subject: "Mathematics",
    board: "CBSE",
    language: "English",
    isRecommended: false,
    sampleImages: [],
    description:
      "Circle theorems, tangent properties, solved examples, PYQ and practice sets — all in one crisp revision package."
  },

  // ⭐ TRIGONOMETRY — (29)
  {
    id: "math10_trigonometry_bundle",
    name: "Class 10 Trigonometry Identities + PYQ Workbook",
    coverImage: "assets/images/p-math10-trigonometry.png",
    originalPrice: 41, // 30% OFF => 29
    discountPercent: 30,
    category: "Class 10",
    subject: "Mathematics",
    board: "CBSE",
    language: "English",
    isRecommended: false,
    sampleImages: [],
    description:
      "Trigonometric ratios, identities, tables, PYQ and exam problems — everything needed for full-score trigonometry preparation."
  },

  // ⭐ HEIGHTS & DISTANCES — (29)
  {
    id: "math10_heights_distances_bundle",
    name: "Class 10 Heights & Distances Application Notes",
    coverImage: "assets/images/p-math10-heights-distance.png",
    originalPrice: 33, // 10% OFF => 29
    discountPercent: 10,
    category: "Class 10",
    subject: "Mathematics",
    board: "CBSE",
    language: "English",
    isRecommended: false,
    sampleImages: [],
    description:
      "Angle of elevation and depression concepts with solved examples, PYQ and practice exercises for guaranteed accuracy."
  },

  // ⭐ AREA RELATED TO CIRCLES — (29)
  {
    id: "math10_areas_related_to_circles_bundle",
    name: "Class 10 Areas Related to Circles Full Practice Pack",
    coverImage: "assets/images/p-math10-areas-circles.png",
    originalPrice: 36, // 20% OFF => 29
    discountPercent: 20,
    category: "Class 10",
    subject: "Mathematics",
    board: "CBSE",
    language: "English",
    isRecommended: false,
    sampleImages: [],
    description:
      "Sectors, segments, shortcuts, PYQ and practice sheets for quick mastery of area-based questions."
  },

  // ⭐ SURFACE AREA & VOLUME — (29)
  {
    id: "math10_surface_area_volume_bundle",
    name: "Class 10 Surface Area & Volume 3D Concept Pack",
    coverImage: "assets/images/p-math10-surface-volume.png",
    originalPrice: 41, // 30% OFF => 29
    discountPercent: 30,
    category: "Class 10",
    subject: "Mathematics",
    board: "CBSE",
    language: "English",
    isRecommended: false,
    sampleImages: [],
    description:
      "3D shapes formulas, visual explanations, PYQ and practice sets for strong clarity in SA & Volume problems."
  },

  // ⭐ STATISTICS — (29)
  {
    id: "math10_statistics_bundle",
    name: "Class 10 Statistics Fast-Track Exam Notes",
    coverImage: "assets/images/p-math10-statistics.png",
    originalPrice: 48, // 40% OFF => 29
    discountPercent: 40,
    category: "Class 10",
    subject: "Mathematics",
    board: "CBSE",
    language: "English",
    isRecommended: false,
    sampleImages: [],
    description:
      "Mean, median, mode, graphs, PYQ and model questions — everything required for high-score statistics preparation."
  },

  // ⭐ PROBABILITY — (29)
  {
    id: "math10_probability_bundle",
    name: "Class 10 Probability Complete Concept Pack",
    coverImage: "assets/images/p-math10-probability.png",
    originalPrice: 33, // 10% OFF => 29
    discountPercent: 10,
    category: "Class 10",
    subject: "Mathematics",
    board: "CBSE",
    language: "English",
    isRecommended: false,
    sampleImages: [],
    description:
      "Probability laws, solved models, PYQ and practice sets designed to remove confusion and improve accuracy."
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