/* ============================================
   DANIS PHOTOGRAPHY - PROGRESSIVE ENHANCEMENTS
   Modern UX features layered on top of base functionality
   ============================================ */

(function () {
  'use strict';

  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ============================================
     MOBILE NAV TOGGLE
     ============================================ */
  function initMobileNav() {
    const toggle = document.querySelector('.nav-toggle');
    const menu = document.getElementById('nav-menu');
    
    if (!toggle || !menu) return;

    toggle.addEventListener('click', () => {
      const isOpen = menu.classList.contains('is-open');
      const newState = !isOpen;
      
      menu.classList.toggle('is-open', newState);
      toggle.setAttribute('aria-expanded', newState);
      toggle.innerHTML = newState ? '&times;' : '&#9776;';
      
      // Prevent body scroll when menu is open
      document.body.style.overflow = newState ? 'hidden' : '';
    });

    // Close menu on escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) {
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.innerHTML = '&#9776;';
        document.body.style.overflow = '';
      }
    });

    // Close menu when clicking a link
    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        menu.classList.remove('is-open');
        toggle.setAttribute('aria-expanded', 'false');
        toggle.innerHTML = '&#9776;';
        document.body.style.overflow = '';
      });
    });
  }

  /* ============================================
     DYNAMIC COPYRIGHT YEAR
     ============================================ */
  function initDynamicYear() {
    const yearSpan = document.getElementById('year');
    if (yearSpan) {
      yearSpan.textContent = new Date().getFullYear();
    }
  }

  /* ============================================
     CATEGORY FILTER BEHAVIOR
     ============================================ */
  function initFilters() {
    const chips = document.querySelectorAll('.chip[data-filter]');
    const cards = document.querySelectorAll('.card[data-category]');
    
    if (!chips.length || !cards.length) return;

    chips.forEach(chip => {
      chip.addEventListener('click', () => {
        const filter = chip.getAttribute('data-filter');
        
        // Update active chip
        chips.forEach(c => c.classList.remove('is-active'));
        chip.classList.add('is-active');
        
        // Filter cards
        cards.forEach(card => {
          const category = card.getAttribute('data-category');
          const shouldShow = filter === 'all' || category === filter;
          
          if (prefersReducedMotion) {
            card.style.display = shouldShow ? '' : 'none';
          } else {
            if (shouldShow) {
              card.style.display = '';
              card.style.animation = 'fadeIn 0.3s ease';
            } else {
              card.style.animation = 'fadeOut 0.3s ease';
              setTimeout(() => {
                card.style.display = 'none';
              }, 300);
            }
          }
        });
      });
    });
  }

  /* ============================================
     LAZY LOADING FALLBACK
     ============================================ */
  function initLazyLoading() {
    if (!('IntersectionObserver' in window)) return;

    const lazyImages = document.querySelectorAll('[data-src], [data-srcset]');
    if (!lazyImages.length) return;

    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
          }
          
          if (img.dataset.srcset) {
            img.srcset = img.dataset.srcset;
            img.removeAttribute('data-srcset');
          }
          
          img.classList.add('loaded');
          imageObserver.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px'
    });

    lazyImages.forEach(img => imageObserver.observe(img));
  }

  /* ============================================
     MINIMAL ACCESSIBLE LIGHTBOX
     ============================================ */
  function initLightbox() {
    const lightboxLinks = document.querySelectorAll('a.lightbox');
    if (!lightboxLinks.length) return;

    // Inject lightbox styles
    const style = document.createElement('style');
    style.textContent = `
      .lightbox-overlay {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0, 0, 0, 0.95);
        display: none;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        padding: 2rem;
      }
      .lightbox-overlay.is-open {
        display: flex;
      }
      .lightbox-content {
        max-width: 90vw;
        max-height: 90vh;
        position: relative;
      }
      .lightbox-content img {
        max-width: 100%;
        max-height: 90vh;
        object-fit: contain;
        border-radius: 8px;
      }
      .lightbox-close {
        position: absolute;
        top: 1rem;
        right: 1rem;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        border: 2px solid rgba(255, 255, 255, 0.2);
        width: 48px;
        height: 48px;
        border-radius: 50%;
        font-size: 1.5rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
      }
      .lightbox-close:hover {
        background: var(--accent);
        border-color: var(--accent);
      }
      .lightbox-nav {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        background: rgba(0, 0, 0, 0.8);
        color: white;
        border: 2px solid rgba(255, 255, 255, 0.2);
        width: 48px;
        height: 48px;
        border-radius: 50%;
        font-size: 1.5rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
      }
      .lightbox-nav:hover {
        background: var(--accent);
        border-color: var(--accent);
      }
      .lightbox-prev { left: 1rem; }
      .lightbox-next { right: 1rem; }
      .lightbox-caption {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 1rem;
        text-align: center;
        border-radius: 0 0 8px 8px;
      }
    `;
    document.head.appendChild(style);

    // Create lightbox overlay
    const overlay = document.createElement('div');
    overlay.className = 'lightbox-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Image lightbox');
    
    overlay.innerHTML = `
      <div class="lightbox-content">
        <button class="lightbox-close" aria-label="Close lightbox">&times;</button>
        <button class="lightbox-nav lightbox-prev" aria-label="Previous image">&lt;</button>
        <button class="lightbox-nav lightbox-next" aria-label="Next image">&gt;</button>
        <img src="" alt="">
        <div class="lightbox-caption"></div>
      </div>
    `;
    document.body.appendChild(overlay);

    const closeBtn = overlay.querySelector('.lightbox-close');
    const prevBtn = overlay.querySelector('.lightbox-prev');
    const nextBtn = overlay.querySelector('.lightbox-next');
    const img = overlay.querySelector('img');
    const caption = overlay.querySelector('.lightbox-caption');

    // Group images by data-lightbox attribute
    const groups = {};
    lightboxLinks.forEach(link => {
      const group = link.getAttribute('data-lightbox') || 'default';
      if (!groups[group]) groups[group] = [];
      groups[group].push(link);
    });

    let currentGroup = null;
    let currentIndex = 0;
    let focusedElement = null;

    function openLightbox(link) {
      focusedElement = document.activeElement;
      currentGroup = link.getAttribute('data-lightbox') || 'default';
      currentIndex = groups[currentGroup].indexOf(link);
      
      showImage();
      overlay.classList.add('is-open');
      document.body.style.overflow = 'hidden';
      
      // Focus trap
      closeBtn.focus();
    }

    function closeLightbox() {
      overlay.classList.remove('is-open');
      document.body.style.overflow = '';
      try {
        if (focusedElement && focusedElement.focus) {
          focusedElement.focus();
        }
      } catch (e) {
        // Element may no longer be in DOM or focusable
        console.debug('Could not restore focus:', e);
      }
    }

    function showImage() {
      const link = groups[currentGroup][currentIndex];
      const imgSrc = link.getAttribute('href');
      const imgAlt = link.querySelector('img')?.getAttribute('alt') || '';
      const imgCaption = link.getAttribute('data-caption') || '';
      
      img.src = imgSrc;
      img.alt = imgAlt;
      caption.textContent = imgCaption;
      caption.style.display = imgCaption ? 'block' : 'none';
      
      // Show/hide nav buttons
      const groupSize = groups[currentGroup].length;
      prevBtn.style.display = groupSize > 1 ? 'flex' : 'none';
      nextBtn.style.display = groupSize > 1 ? 'flex' : 'none';
    }

    function navigate(direction) {
      const groupSize = groups[currentGroup].length;
      if (direction === 'next') {
        currentIndex = (currentIndex + 1) % groupSize;
      } else {
        currentIndex = (currentIndex - 1 + groupSize) % groupSize;
      }
      showImage();
    }

    // Event listeners
    lightboxLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        openLightbox(link);
      });
    });

    closeBtn.addEventListener('click', closeLightbox);
    prevBtn.addEventListener('click', () => navigate('prev'));
    nextBtn.addEventListener('click', () => navigate('next'));

    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeLightbox();
    });

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
      if (!overlay.classList.contains('is-open')) return;
      
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') navigate('prev');
      if (e.key === 'ArrowRight') navigate('next');
    });

    // Focus trap
    const focusableElements = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    overlay.addEventListener('keydown', (e) => {
      if (e.key !== 'Tab') return;
      
      const focusables = overlay.querySelectorAll(focusableElements);
      const firstFocusable = focusables[0];
      const lastFocusable = focusables[focusables.length - 1];
      
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          lastFocusable.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          firstFocusable.focus();
          e.preventDefault();
        }
      }
    });
  }

  /* ============================================
     HEADER SCROLL BEHAVIOR
     ============================================ */
  function initHeaderScroll() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
      const currentScroll = window.scrollY;
      
      if (currentScroll > 50) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
      
      lastScroll = currentScroll;
    }, { passive: true });
  }

  /* ============================================
     ANIMATE ON SCROLL (SUBTLE)
     ============================================ */
  function initAnimateOnScroll() {
    if (prefersReducedMotion || !('IntersectionObserver' in window)) return;

    const animatedElements = document.querySelectorAll('.card, .section-head');
    if (!animatedElements.length) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, {
      threshold: 0.1
    });

    animatedElements.forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(el);
    });
  }

  /* ============================================
     INITIALIZATION
     ============================================ */
  function init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', init);
      return;
    }

    try {
      initMobileNav();
      initDynamicYear();
      initFilters();
      initLazyLoading();
      initLightbox();
      initHeaderScroll();
      initAnimateOnScroll();
    } catch (error) {
      console.error('Enhancement error:', error);
      // Fail silently to not break existing functionality
    }
  }

  // Start initialization
  init();

  // Add fadeIn/fadeOut animations to stylesheet if not in reduced motion mode
  if (!prefersReducedMotion) {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
      }
      @keyframes fadeOut {
        from { opacity: 1; transform: scale(1); }
        to { opacity: 0; transform: scale(0.95); }
      }
    `;
    document.head.appendChild(style);
  }

})();
