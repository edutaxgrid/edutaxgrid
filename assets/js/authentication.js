// assets/js/authentication.js

(function () {
  // --------------- CONFIG ----------------

  // Your Web3Forms access key (public)
  const WEB3FORMS_ACCESS_KEY = "010fcc0f-a2e1-451b-a6ad-b92d3afea8a8";

  // TODO: Replace with your actual Firebase config
  // You must also include Firebase scripts in your HTML (before this file):
  //
  // <script src="https://www.gstatic.com/firebasejs/9.6.11/firebase-app-compat.js"></script>
  // <script src="https://www.gstatic.com/firebasejs/9.6.11/firebase-auth-compat.js"></script>
  //
  const firebaseConfig = {
  apiKey: "AIzaSyB5o72G9uy8bi2kn8hH4flK3AE21v2rZN4",
  authDomain: "edutaxgrid-96dff.firebaseapp.com",
  projectId: "edutaxgrid-96dff",
  storageBucket: "edutaxgrid-96dff.firebasestorage.app",
  messagingSenderId: "1052621280230",
  appId: "1:1052621280230:web:2e9aff8f1d58d02a727c27"
};

  // --------------- SMALL HELPERS ----------------

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

  function setElementVisible(el, visible) {
    if (!el) return;
    el.style.display = visible ? "" : "none";
  }

  function setText(el, text) {
    if (!el) return;
    el.textContent = text;
  }

  function showFormStatus(form, message, type) {
    // type: "success" | "error" | "info"
    const statusEl = form.querySelector("[data-form-status]");
    if (statusEl) {
      statusEl.textContent = message;
      statusEl.setAttribute("data-status-type", type || "info");
    } else {
      alert(message);
    }
  }

  // --------------- AUTH STATE ----------------

  let currentUser = null;
  let firebaseApp = null;
  let firebaseAuth = null;
  let googleProvider = null;

  function initFirebaseIfAvailable() {
    if (!window.firebase) {
      console.warn(
        "[Edutaxgrid] Firebase SDK not found. Google Sign-In will not work until you add it."
      );
      return;
    }

    try {
      firebaseApp = firebase.initializeApp(firebaseConfig);
      firebaseAuth = firebase.auth();
      googleProvider = new firebase.auth.GoogleAuthProvider();
    } catch (err) {
      console.error("Error initializing Firebase:", err);
    }
  }

  function signInWithGoogle() {
    if (!firebaseAuth || !googleProvider) {
      alert(
        "Sign-in is temporarily unavailable. Please try again later or contact support."
      );
      return;
    }

    firebaseAuth
      .signInWithPopup(googleProvider)
      .then((result) => {
        // currentUser will be updated in onAuthStateChanged
      })
      .catch((error) => {
        console.error("Google sign-in error:", error);
        alert("Sign-in failed. Please try again.");
      });
  }

  function signOut() {
    if (!firebaseAuth) return;
    firebaseAuth.signOut().catch((err) => {
      console.error("Sign-out error:", err);
    });
  }

  function handleAuthStateChange(user) {
    currentUser = user || null;
    updateAuthDependentUI();
  }

  // --------------- AUTH-DEPENDENT UI ----------------

  function updateAuthDependentUI() {
    const isSignedIn = !!currentUser;

    // Elements visible only when signed in
    $all('[data-auth-visible="signed-in"]').forEach((el) =>
      setElementVisible(el, isSignedIn)
    );

    // Elements visible only when signed out
    $all('[data-auth-visible="signed-out"]').forEach((el) =>
      setElementVisible(el, !isSignedIn)
    );

    // Navbar "Sign in" / "Profile" switch
    // Use a single nav item with data-auth-nav-switch
    $all("[data-auth-nav-switch]").forEach((el) => {
      if (isSignedIn) {
        setText(el, "Profile");
        el.setAttribute("data-nav-link", "profile");
      } else {
        setText(el, "Sign in");
        el.setAttribute("data-nav-link", "signin");
      }
    });

    // Profile info (on profile.html)
    // Profile info (on profile.html)
const nameEl = $("[data-auth-name]");
const emailEl = $("[data-auth-email]");
const avatarLetterEl = $("[data-auth-avatar-letter]");

if (isSignedIn && currentUser) {
  const displayName = currentUser.displayName || "Student";
  const email = currentUser.email || "";

  setText(nameEl, displayName);
  setText(emailEl, email);

  if (avatarLetterEl) {
    const base = displayName || email || "S";
    const letter = base.trim().charAt(0).toUpperCase();
    setText(avatarLetterEl, letter || "S");
  }
} else {
  if (nameEl) setText(nameEl, "Guest");
  if (emailEl) setText(emailEl, "Not signed in");
  if (avatarLetterEl) setText(avatarLetterEl, "?");
}

    // Protect profile page content
    const profileGate = $("[data-profile-page]");
    if (profileGate) {
      if (!isSignedIn) {
        // Not signed in on profile page → suggest sign-in
        const redirectBtn = $("[data-go-signin]");
        if (redirectBtn) {
          redirectBtn.addEventListener("click", () => {
            window.location.href = "signin.html";
          });
        }
      }
    }

    // Payment form gating can also be controlled:
    // You can add data-auth-visible attributes in payment.html sections if needed.
  }

  // --------------- BUTTON BINDINGS ----------------

  function initAuthButtons() {
    // All Google sign-in buttons on any page
    $all("[data-auth-google]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        signInWithGoogle();
      });
    });

    // All sign-out buttons
    $all("[data-auth-signout]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        signOut();
      });
    });
  }

  // --------------- FORMS (Web3Forms) ----------------

  function initForms() {
    // Feedback forms
    $all('form[data-form="feedback"]').forEach((form) => {
      setupWeb3Form(form, {
        subject: "New feedback from Edutaxgrid",
        onSuccess: () => {
          form.reset();
        }
      });
    });

    // Payment confirmation form
    $all('form[data-form="payment"]').forEach((form) => {
      setupWeb3Form(form, {
        subject: "New payment confirmation - Edutaxgrid",
        beforeSubmit: (fd) => {
          // Optional: attach user email/name from auth if available
          if (currentUser && !fd.get("user_email")) {
            fd.append("user_email", currentUser.email || "");
          }
        },
        onSuccess: () => {
          // Clear cart, show thank you section and redirect
          if (window.ProductStore) {
            window.ProductStore.clearCart();
          }
          if (window.CartUI && typeof window.CartUI.refreshCartCount === "function") {
            window.CartUI.refreshCartCount();
          }

          if (
            window.PageFlow &&
            typeof window.PageFlow.startPaymentThankYouFlow === "function"
          ) {
            window.PageFlow.startPaymentThankYouFlow();
          } else {
            // Fallback if PageFlow is not loaded
            alert("Thank you! Redirecting to home.");
            window.location.href = "index.html";
          }
        }
      });
    });
  }

  function setupWeb3Form(form, options) {
    const { subject, beforeSubmit, onSuccess } = options || {};

    form.addEventListener("submit", function (e) {
      e.preventDefault();

      const submitBtn = form.querySelector('[type="submit"]');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.setAttribute("data-loading", "true");
      }

      // Build form data
      const fd = new FormData(form);
      fd.append("access_key", WEB3FORMS_ACCESS_KEY);
      if (subject) {
        fd.append("subject", subject);
      }

      if (beforeSubmit && typeof beforeSubmit === "function") {
        beforeSubmit(fd);
      }

     

      showFormStatus(form, "Submitting...", "info");

      fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: fd
      })
        .then(async (res) => {
          const json = await res.json();
          if (res.ok && json.success) {
            showFormStatus(form, "Thank you! Your submission has been received.", "success");
            if (typeof onSuccess === "function") onSuccess();
          } else {
            console.error("Web3Forms error:", json);
            showFormStatus(
              form,
              json.message || "Something went wrong. Please try again.",
              "error"
            );
          }
        })
        .catch((err) => {
          console.error("Web3Forms request failed:", err);
          showFormStatus(
            form,
            "Network error. Please check your connection and try again.",
            "error"
          );
        })
        .finally(() => {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.removeAttribute("data-loading");
          }
        });
    });
  }

  // --------------- INIT ----------------

  onReady(() => {
    // 1) Setup Firebase if available
    initFirebaseIfAvailable();

    // 2) Listen to Firebase auth changes if auth is initialized
    if (firebaseAuth) {
      firebaseAuth.onAuthStateChanged(handleAuthStateChange);
    } else {
      // No Firebase → treat as signed out
      handleAuthStateChange(null);
    }

    // 3) Bind buttons and forms
    initAuthButtons();
    initForms();
  });
})();