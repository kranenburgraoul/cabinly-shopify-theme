/* ============================================================
   CABINLY — Main JavaScript
   Shopify OS2.0 Theme
   ============================================================ */

(function () {
  'use strict';

  // ── Scroll: header shadow
  const header = document.getElementById('site-header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('is-scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  // ── Reveal on scroll
  const reveals = document.querySelectorAll('.reveal');
  if (reveals.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('is-visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1 });
    reveals.forEach(el => io.observe(el));
  }

  // ── Mobile nav
  window.cabinlyOpenNav = function () {
    const nav = document.getElementById('mobile-nav');
    if (nav) { nav.classList.add('is-open'); document.body.style.overflow = 'hidden'; }
  };
  window.cabinlyCloseNav = function () {
    const nav = document.getElementById('mobile-nav');
    if (nav) { nav.classList.remove('is-open'); document.body.style.overflow = ''; }
  };

  // ── Announcement bar dismiss
  const annClose = document.querySelector('.announcement-bar__close');
  if (annClose) {
    annClose.addEventListener('click', () => {
      const bar = annClose.closest('.announcement-bar');
      if (bar) bar.style.display = 'none';
    });
  }

  // ── FAQ / Product tab accordion
  document.querySelectorAll('.faq-item__trigger, .product-tab__trigger').forEach(trigger => {
    trigger.addEventListener('click', () => {
      const item = trigger.closest('.faq-item, .product-tab');
      const wasOpen = item.classList.contains('is-open');
      // close siblings
      item.closest('.faq-list, .product-info__tabs')
        ?.querySelectorAll('.faq-item, .product-tab')
        .forEach(i => i.classList.remove('is-open'));
      if (!wasOpen) item.classList.add('is-open');
    });
  });

  // ── Product gallery thumbnails
  document.querySelectorAll('.product-gallery__thumb').forEach(thumb => {
    thumb.addEventListener('click', () => {
      const gallery = thumb.closest('.product-gallery');
      const main = gallery?.querySelector('.product-gallery__main img');
      if (main) {
        main.src = thumb.querySelector('img').src;
        gallery.querySelectorAll('.product-gallery__thumb').forEach(t => t.classList.remove('is-active'));
        thumb.classList.add('is-active');
      }
    });
  });

  // ── Quantity selector
  document.querySelectorAll('.product-form__quantity').forEach(wrap => {
    const input = wrap.querySelector('input');
    wrap.querySelector('[data-qty-minus]')?.addEventListener('click', () => {
      if (parseInt(input.value) > 1) input.value = parseInt(input.value) - 1;
    });
    wrap.querySelector('[data-qty-plus]')?.addEventListener('click', () => {
      input.value = parseInt(input.value) + 1;
    });
  });

  // ── Email signup form
  document.querySelectorAll('.email-form').forEach(form => {
    form.addEventListener('submit', (e) => {
      // Let Shopify handle the real submission via form action
      // This only handles the visual feedback
      const btn = form.querySelector('button[type="submit"]');
      if (btn) {
        const orig = btn.textContent;
        btn.textContent = '✓ Aangemeld!';
        btn.style.background = '#4a6a5a';
        setTimeout(() => {
          btn.textContent = orig;
          btn.style.background = '';
        }, 4000);
      }
    });
  });

  // ── Collection filter tags (client-side for non-Shopify filter)
  const filterTags = document.querySelectorAll('.filter-tag[data-filter]');
  if (filterTags.length) {
    filterTags.forEach(tag => {
      tag.addEventListener('click', () => {
        filterTags.forEach(t => t.classList.remove('is-active'));
        tag.classList.add('is-active');
        const filter = tag.dataset.filter;
        document.querySelectorAll('.product-card[data-type]').forEach(card => {
          card.style.display = (filter === 'all' || card.dataset.type === filter) ? '' : 'none';
        });
      });
    });
  }

  // ── Cart: add to cart feedback (Shopify AJAX)
  document.querySelectorAll('.product-card__add').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const variantId = btn.closest('[data-variant-id]')?.dataset.variantId;
      if (!variantId) return;

      btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>';
      btn.style.background = 'var(--color-olive)';

      fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: variantId, quantity: 1 })
      })
        .then(r => r.json())
        .then(() => {
          updateCartCount();
          setTimeout(() => {
            btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>';
            btn.style.background = '';
          }, 2000);
        })
        .catch(() => {
          btn.innerHTML = '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/></svg>';
          btn.style.background = '';
        });
    });
  });

  function updateCartCount() {
    fetch('/cart.js')
      .then(r => r.json())
      .then(cart => {
        document.querySelectorAll('.cart-count').forEach(el => {
          el.textContent = cart.item_count;
          el.style.display = cart.item_count > 0 ? 'flex' : 'none';
        });
      });
  }

  updateCartCount();

})();
