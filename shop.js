/**
 * shop.js — ProLine shop & cart
 * Handles add-to-cart, quantity controls, drawer open/close, and totals.
 */

(() => {
  "use strict";

  /* ── State ─────────────────────────────────── */
  const cart = {}; // { [id]: { name, price, qty } }

  /* ── DOM refs ───────────────────────────────── */
  const drawer    = document.getElementById("cartDrawer");
  const overlay   = document.getElementById("cartOverlay");
  const listEl    = document.getElementById("cartList");
  const totalEl   = document.getElementById("cartTotal");
  const countEl   = document.getElementById("cartCount");
  const fabBtn    = document.getElementById("cartFab");
  const closeBtn  = document.getElementById("cartClose");

  /* ── Open / Close ───────────────────────────── */
  function openCart() {
    drawer.classList.add("open");
    overlay.classList.add("open");
    drawer.setAttribute("aria-hidden", "false");
    closeBtn.focus();
  }

  function closeCart() {
    drawer.classList.remove("open");
    overlay.classList.remove("open");
    drawer.setAttribute("aria-hidden", "true");
    fabBtn.focus();
  }

  fabBtn.addEventListener("click", openCart);
  closeBtn.addEventListener("click", closeCart);
  overlay.addEventListener("click", closeCart);

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && drawer.classList.contains("open")) closeCart();
  });

  /* ── Add to cart ────────────────────────────── */
  document.querySelectorAll(".btn-add").forEach((btn) => {
    btn.addEventListener("click", () => {
      const card  = btn.closest(".shop-card");
      const id    = card.dataset.id;
      const name  = card.dataset.name;
      const price = Number(card.dataset.price);

      if (cart[id]) {
        cart[id].qty += 1;
      } else {
        cart[id] = { name, price, qty: 1 };
      }

      // Visual feedback on button
      btn.textContent = "✓ Added";
      btn.classList.add("added");
      setTimeout(() => {
        btn.textContent = "Add to cart";
        btn.classList.remove("added");
      }, 1200);

      renderCart();
      openCart();
    });
  });

  /* ── Render cart ────────────────────────────── */
  function renderCart() {
    listEl.innerHTML = "";

    const ids = Object.keys(cart);

    if (ids.length === 0) {
      listEl.innerHTML = `<li class="cart-empty">Your cart is empty.</li>`;
      totalEl.textContent = "$0";
      countEl.textContent = "0";
      return;
    }

    let total = 0;
    let totalQty = 0;

    ids.forEach((id) => {
      const item = cart[id];
      const lineTotal = item.price * item.qty;
      total += lineTotal;
      totalQty += item.qty;

      const li = document.createElement("li");
      li.className = "cart-item";
      li.innerHTML = `
        <div class="cart-item-info">
          <span class="cart-item-name">${escHtml(item.name)}</span>
          <div class="cart-item-qty">
            <button class="qty-btn" data-action="dec" data-id="${id}" aria-label="Remove one ${escHtml(item.name)}">−</button>
            <span class="qty-val">${item.qty}</span>
            <button class="qty-btn" data-action="inc" data-id="${id}" aria-label="Add one more ${escHtml(item.name)}">+</button>
          </div>
        </div>
        <span class="cart-item-price">$${lineTotal.toLocaleString()}</span>
      `;
      listEl.appendChild(li);
    });

    totalEl.textContent = `$${total.toLocaleString()}`;
    countEl.textContent = String(totalQty);

    // Qty button handlers
    listEl.querySelectorAll(".qty-btn").forEach((btn) => {
      btn.addEventListener("click", () => {
        const id     = btn.dataset.id;
        const action = btn.dataset.action;
        if (action === "inc") {
          cart[id].qty += 1;
        } else {
          cart[id].qty -= 1;
          if (cart[id].qty <= 0) delete cart[id];
        }
        renderCart();
      });
    });
  }

  /* ── Helpers ────────────────────────────────── */
  function escHtml(str) {
    return str.replace(/[&<>"']/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
    );
  }

  /* ── Init ───────────────────────────────────── */
  renderCart(); // show empty state on load

  console.log("🛒 ProLine shop.js loaded");
})();
