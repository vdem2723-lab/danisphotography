// ============================================
// DANIS PHOTOGRAPHY - MAIN JAVASCRIPT
// Author: Danis Photography
// Description: Interactive features and functionality
//
// MINIFICATION READY:
// - Remove comments and console.logs before production
// - Recommended minifiers: Terser, UglifyJS, or Google Closure Compiler
// - Consider bundling with webpack/rollup for optimal performance
// - Target: Reduce file size by ~40-50%
// ============================================

(function () {
    'use strict';

    // ============================================
    // UTILITY FUNCTIONS
    // ============================================
    const utils = {
        rafThrottle: function (callback) {
            let ticking = false;
            return function (...args) {
                if (!ticking) {
                    window.requestAnimationFrame(() => {
                        callback.apply(this, args);
                        ticking = false;
                    });
                    ticking = true;
                }
            };
        },

        debounce: function (func, wait) {
            let timeout;
            return function (...args) {
                clearTimeout(timeout);
                timeout = setTimeout(() => func.apply(this, args), wait);
            };
        },

        createElement: function (tag, className, content) {
            const element = document.createElement(tag);
            if (className) element.className = className;
            if (content) element.innerHTML = content;
            return element;
        },

        getLanguage: function () {
            return document.documentElement.lang || 'en';
        },

        isLowEndDevice: function () {
            return navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4;
        }
    };

    // ============================================
    // PRIVACY MODAL
    // ============================================
    const privacyModal = {
        modal: null,

        init: function () {
            this.createModal();
        },

        createModal: function () {
            this.modal = utils.createElement('div', 'privacy-modal');
            const lang = utils.getLanguage();

            const title = lang === 'sv' ? 'Integritetspolicy' : 'Privacy Policy';
            const content = lang === 'sv'
                ? `<p>Vi använder endast nödvändiga cookies för att webbplatsen ska fungera korrekt. Inga personuppgifter samlas in eller delas med tredje part utan ditt uttryckliga samtycke.</p>
                   <p>Cookies som används:</p>
                   <p><strong>Nödvändiga cookies:</strong> Dessa cookies är nödvändiga för att webbplatsen ska fungera och kan inte stängas av i våra system.</p>
                   <p><strong>Analytics cookies (valfritt):</strong> Dessa cookies hjälper oss att förstå hur besökare interagerar med webbplatsen.</p>
                   <p>För mer information, vänligen kontakta oss via kontaktformuläret.</p>`
                : `<p>We only use essential cookies to ensure the website functions properly. No personal data is collected or shared with third parties without your explicit consent.</p>
                   <p>Cookies used:</p>
                   <p><strong>Essential cookies:</strong> These cookies are necessary for the website to function and cannot be switched off in our systems.</p>
                   <p><strong>Analytics cookies (optional):</strong> These cookies help us understand how visitors interact with the website.</p>
                   <p>For more information, please contact us via the contact form.</p>`;

            this.modal.innerHTML = `
                <div class="privacy-modal-content">
                    <div class="privacy-modal-header">
                        <h3>${title}</h3>
                        <button class="privacy-modal-close" aria-label="Close">&times;</button>
                    </div>
                    <div class="privacy-modal-body">
                        ${content}
                    </div>
                </div>
            `;

            document.body.appendChild(this.modal);

            const closeBtn = this.modal.querySelector('.privacy-modal-close');
            closeBtn.addEventListener('click', () => this.close());

            this.modal.addEventListener('click', (e) => {
                if (e.target === this.modal) this.close();
            });

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.modal.classList.contains('active')) {
                    this.close();
                }
            });
        },

        show: function () {
            if (this.modal) {
                requestAnimationFrame(() => {
                    this.modal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                });
            }
        },

        close: function () {
            if (this.modal) {
                this.modal.classList.remove('active');
                document.body.style.overflow = '';
            }
        }
    };

    // ============================================
    // GDPR COOKIE CONSENT
    // ============================================
    const cookieConsent = {
        banner: null,

        init: function () {
            const persistentConsent = this.getConsent();
            if (persistentConsent || sessionStorage.getItem('cookieBannerShown')) return;
            this.createBanner();
        },

        createBanner: function () {
            const lang = utils.getLanguage();
            this.banner = utils.createElement('div', 'cookie-consent');

            const text = lang === 'sv'
                ? 'Vi använder cookies för att förbättra din upplevelse på vår webbplats. Genom att klicka "Acceptera" godkänner du vår användning av cookies.'
                : 'We use cookies to enhance your experience on our website. By clicking "Accept" you consent to our use of cookies.';

            const learnMore = lang === 'sv' ? 'Läs mer' : 'Learn more';
            const acceptText = lang === 'sv' ? 'Acceptera' : 'Accept';
            const declineText = lang === 'sv' ? 'Avböj' : 'Decline';

            this.banner.innerHTML = `
                <div class="cookie-consent-content">
                    <div class="cookie-consent-text">
                        <p>
                            ${text}
                            <a href="#" class="privacy-link">${learnMore}</a>
                        </p>
                    </div>
                    <div class="cookie-consent-buttons">
                        <button class="cookie-btn accept">${acceptText}</button>
                        <button class="cookie-btn decline">${declineText}</button>
                    </div>
                </div>
            `;

            document.body.appendChild(this.banner);
            sessionStorage.setItem('cookieBannerShown', 'true');

            const privacyLink = this.banner.querySelector('.privacy-link');
            privacyLink.addEventListener('click', (e) => {
                e.preventDefault();
                privacyModal.show();
            });

            const acceptBtn = this.banner.querySelector('.accept');
            acceptBtn.addEventListener('click', () => this.accept());

            const declineBtn = this.banner.querySelector('.decline');
            declineBtn.addEventListener('click', () => this.decline());

            requestAnimationFrame(() => {
                setTimeout(() => this.banner.classList.add('show'), 1000);
            });
        },

        accept: function () {
            this.setConsent('accepted');
            this.hide();
        },

        decline: function () {
            this.setConsent('declined');
            this.hide();
        },

        hide: function () {
            if (this.banner) {
                this.banner.classList.remove('show');
                setTimeout(() => {
                    if (this.banner && this.banner.parentNode) {
                        this.banner.remove();
                    }
                }, 500);
            }
        },

        setConsent: function (value) {
            const expiryDays = 365;
            const date = new Date();
            date.setTime(date.getTime() + (expiryDays * 24 * 60 * 60 * 1000));
            const expires = "expires=" + date.toUTCString();
            document.cookie = "cookieConsent=" + value + ";" + expires + ";path=/;SameSite=Strict";
        },

        getConsent: function () {
            const name = "cookieConsent=";
            const decodedCookie = decodeURIComponent(document.cookie);
            const ca = decodedCookie.split(';');
            for (let i = 0; i < ca.length; i++) {
                let c = ca[i].trim();
                if (c.indexOf(name) === 0) {
                    return c.substring(name.length);
                }
            }
            return null;
        }
    };

    // ============================================
    // FORM VALIDATION & HANDLING
    // ============================================
    const formHandler = {
        init: function () {
            const form = document.getElementById('contactForm');
            if (!form) return;

            // Add real-time validation
            const inputs = form.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', () => this.validateField(input));
                input.addEventListener('input', () => {
                    if (input.parentElement.classList.contains('error')) {
                        this.validateField(input);
                    }
                });
            });

            // Handle form submission
            form.addEventListener('submit', (e) => this.handleSubmit(e, form));
        },

        validateField: function (field) {
            const formGroup = field.parentElement;
            const fieldName = field.getAttribute('name');
            let isValid = true;
            let errorMessage = '';

            // Remove previous error
            formGroup.classList.remove('error', 'success');
            let existingError = formGroup.querySelector('.error-message');
            if (existingError) existingError.remove();

            // Check if field is required and empty
            if (field.hasAttribute('required') && !field.value.trim()) {
                isValid = false;
                const lang = utils.getLanguage();
                errorMessage = lang === 'sv' ? 'Detta fält är obligatoriskt' : 'This field is required';
            }

            // Email validation
            if (fieldName === 'email' && field.value.trim()) {
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!emailRegex.test(field.value.trim())) {
                    isValid = false;
                    const lang = utils.getLanguage();
                    errorMessage = lang === 'sv' ? 'Ange en giltig e-postadress' : 'Please enter a valid email address';
                }
            }

            // Display validation result
            if (!isValid) {
                formGroup.classList.add('error');
                const errorDiv = utils.createElement('div', 'error-message', errorMessage);
                formGroup.appendChild(errorDiv);
            } else if (field.value.trim()) {
                formGroup.classList.add('success');
            }

            return isValid;
        },

        validateForm: function (form) {
            const inputs = form.querySelectorAll('input[required], textarea[required]');
            let isValid = true;

            inputs.forEach(input => {
                if (!this.validateField(input)) {
                    isValid = false;
                }
            });

            return isValid;
        },

        handleSubmit: function (e, form) {
            e.preventDefault();

            // Validate all fields
            if (!this.validateForm(form)) {
                // Scroll to first error
                const firstError = form.querySelector('.error');
                if (firstError) {
                    firstError.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                return;
            }

            const submitBtn = form.querySelector('.submit-btn');
            const originalText = submitBtn.textContent;

            // Disable button and show loading state
            submitBtn.disabled = true;
            submitBtn.classList.add('loading');

            // Submit form
            const formData = new FormData(form);

            fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
                .then(response => {
                    if (response.ok) {
                        this.showSuccess(form);
                        form.reset();
                        // Remove validation classes
                        form.querySelectorAll('.form-group').forEach(group => {
                            group.classList.remove('success', 'error');
                        });
                    } else {
                        throw new Error('Form submission failed');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    this.showError(form);
                })
                .finally(() => {
                    submitBtn.disabled = false;
                    submitBtn.classList.remove('loading');
                });
        },

        showSuccess: function (form) {
            const lang = utils.getLanguage();
            const message = lang === 'sv'
                ? 'Tack för ditt meddelande! Vi återkommer till dig inom kort.'
                : 'Thank you for your message! We\'ll get back to you soon.';

            let successDiv = form.querySelector('.form-success-message');
            if (!successDiv) {
                successDiv = utils.createElement('div', 'form-success-message', message);
                form.appendChild(successDiv);
            } else {
                successDiv.textContent = message;
            }

            successDiv.classList.add('show');
            successDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

            setTimeout(() => {
                successDiv.classList.remove('show');
            }, 5000);
        },

        showError: function (form) {
            const lang = utils.getLanguage();
            const message = lang === 'sv'
                ? 'Ett fel uppstod. Försök igen eller kontakta oss direkt.'
                : 'An error occurred. Please try again or contact us directly.';

            alert(message);
        }
    };

    // ============================================
    // SCROLL TO TOP BUTTON
    // ============================================
    const scrollToTop = {
        button: null,

        init: function () {
            this.createButton();
            this.attachEvents();
        },

        createButton: function () {
            this.button = utils.createElement('div', 'scroll-to-top');
            this.button.setAttribute('aria-label', 'Scroll to top');
            this.button.setAttribute('role', 'button');
            this.button.setAttribute('tabindex', '0');
            document.body.appendChild(this.button);
        },

        attachEvents: function () {
            const handleScroll = utils.rafThrottle(() => {
                if (window.scrollY > 500) {
                    this.button.classList.add('visible');
                } else {
                    this.button.classList.remove('visible');
                }
            });

            window.addEventListener('scroll', handleScroll, { passive: true });

            this.button.addEventListener('click', () => this.scrollToTop());

            this.button.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.scrollToTop();
                }
            });
        },

        scrollToTop: function () {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        }
    };

    // ============================================
    // PAGE LOAD ANIMATION
    // ============================================
    function initPageLoad() {
        document.body.classList.add('loading');
        requestAnimationFrame(() => {
            document.body.classList.remove('loading');
            document.body.classList.add('loaded');
        });
    }

    // ============================================
    // PARTICLES SYSTEM
    // ============================================
    function createParticles() {
        const bgAnimation = document.querySelector('.bg-animation');
        if (!bgAnimation) return;

        const particleCount = utils.isLowEndDevice() ? 15 : 30;

        for (let i = 0; i < particleCount; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            particle.style.left = Math.random() * 100 + '%';
            particle.style.animationDuration = (15 + Math.random() * 20) + 's';
            particle.style.animationDelay = Math.random() * 5 + 's';
            bgAnimation.appendChild(particle);
        }
    }

    // ============================================
    // MOBILE MENU
    // ============================================
    function initMobileMenu() {
        const toggle = document.getElementById('mobileMenuToggle');
        const navLinks = document.getElementById('navLinks');
        const overlay = utils.createElement('div', 'mobile-menu-overlay');

        if (!toggle || !navLinks) return;

        document.body.appendChild(overlay);

        const closeMenu = () => {
            toggle.classList.remove('active');
            navLinks.classList.remove('active');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        };

        const openMenu = () => {
            toggle.classList.add('active');
            navLinks.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden';
        };

        toggle.addEventListener('click', () => {
            if (toggle.classList.contains('active')) {
                closeMenu();
            } else {
                openMenu();
            }
        });

        // Close menu when clicking on a link
        navLinks.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMenu);
        });

        // Close menu when clicking overlay
        overlay.addEventListener('click', closeMenu);

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && toggle.classList.contains('active')) {
                closeMenu();
            }
        });
    }

    // ============================================
    // NAVBAR SCROLL
    // ============================================
    function initNavbarScroll() {
        const navbar = document.getElementById('navbar');
        if (!navbar) return;
    
        const handleScroll = utils.rafThrottle(() => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    
        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    // ============================================
    // DYNAMIC ACTIVE NAV LINK
    // ============================================
    function initActiveNavLink() {
        const navLinks = document.querySelectorAll('#navLinks a');
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
        navLinks.forEach(link => {
            const linkPage = link.getAttribute('href').split('/').pop() || 'index.html';
            // Remove any existing active class first
            link.classList.remove('active');
            if (linkPage === currentPage) {
                link.classList.add('active');
            }
        });
    }
    
    // ============================================
    // LAZY LOADING
    // ============================================
    function initLazyLoading() {
        const galleryItems = document.querySelectorAll('.gallery-item[data-bg]');
        if (!galleryItems.length) return;

        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const item = entry.target;
                    const bgUrl = item.getAttribute('data-bg');

                    // Only load if data-bg exists and no inline background-image is set
                    if (bgUrl && !item.style.backgroundImage) {
                        const img = new Image();
                        img.onload = () => {
                            item.style.backgroundImage = `url(${bgUrl})`;
                            item.classList.add('loaded');
                        };
                        img.onerror = () => {
                            console.warn('Failed to load image:', bgUrl);
                            item.classList.add('loaded');
                        };
                        img.src = bgUrl;
                    } else if (item.style.backgroundImage) {
                        // Already has inline background-image, just mark as loaded
                        item.classList.add('loaded');
                    }

                    imageObserver.unobserve(item);
                }
            });
        }, {
            root: null,
            rootMargin: '50px',
            threshold: 0.01
        });

        galleryItems.forEach(item => imageObserver.observe(item));
    }

    // ============================================
    // LIGHTBOX
    // ============================================
    function initLightbox() {
        const galleryItems = document.querySelectorAll('.gallery-item');
        if (!galleryItems.length) return;

        const lightbox = document.createElement('div');
        lightbox.className = 'lightbox';
        lightbox.innerHTML = `
            <div class="lightbox-content">
                <img src="" alt="Gallery Image">
            </div>
            <button class="lightbox-nav lightbox-prev" aria-label="Previous">&lt;</button>
            <button class="lightbox-nav lightbox-next" aria-label="Next">&gt;</button>
            <button class="lightbox-close" aria-label="Close">&times;</button>
        `;
        document.body.appendChild(lightbox);

        const lightboxImg = lightbox.querySelector('img');
        const closeBtn = lightbox.querySelector('.lightbox-close');
        const prevBtn = lightbox.querySelector('.lightbox-prev');
        const nextBtn = lightbox.querySelector('.lightbox-next');

        let currentIndex = 0;
        let images = [];

        galleryItems.forEach((item, index) => {
            const bgUrl = item.getAttribute('data-bg');
            if (bgUrl) {
                images.push(bgUrl);
                item.addEventListener('click', () => openLightbox(index));
            }
        });

        function openLightbox(index) {
            currentIndex = index;
            updateLightboxImage();
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
            // Preload next and previous images
            preloadAdjacentImages();
        }

        function closeLightbox() {
            lightbox.classList.remove('active');
            document.body.style.overflow = '';
        }

        function updateLightboxImage() {
            lightboxImg.style.opacity = '0';
            setTimeout(() => {
                lightboxImg.src = images[currentIndex];
                lightboxImg.style.opacity = '1';
            }, 150);
        }

        function preloadAdjacentImages() {
            const nextIndex = (currentIndex + 1) % images.length;
            const prevIndex = (currentIndex - 1 + images.length) % images.length;

            [nextIndex, prevIndex].forEach(index => {
                const img = new Image();
                img.src = images[index];
            });
        }

        function navigateImage(direction) {
            if (direction === 'next') {
                currentIndex = (currentIndex + 1) % images.length;
            } else {
                currentIndex = (currentIndex - 1 + images.length) % images.length;
            }
            updateLightboxImage();
            preloadAdjacentImages();
        }

        closeBtn.addEventListener('click', closeLightbox);
        prevBtn.addEventListener('click', () => navigateImage('prev'));
        nextBtn.addEventListener('click', () => navigateImage('next'));

        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) closeLightbox();
        });

        document.addEventListener('keydown', (e) => {
            if (!lightbox.classList.contains('active')) return;

            if (e.key === 'Escape') closeLightbox();
            if (e.key === 'ArrowLeft') navigateImage('prev');
            if (e.key === 'ArrowRight') navigateImage('next');
        });

        // Touch/swipe support
        let touchStartX = 0;
        let touchEndX = 0;

        lightbox.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        lightbox.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });

        function handleSwipe() {
            const swipeThreshold = 50;
            const diff = touchStartX - touchEndX;

            if (Math.abs(diff) > swipeThreshold) {
                navigateImage(diff > 0 ? 'next' : 'prev');
            }
        }
    }

    // ============================================
    // PARALLAX EFFECT
    // ============================================
    function initParallax() {
        const hero = document.querySelector('.hero');
        if (!hero) return;

        const handleParallax = utils.rafThrottle(() => {
            const scrolled = window.scrollY;
            const heroContent = hero.querySelector('.hero-content');
            if (heroContent && scrolled < window.innerHeight) {
                // Simplified for performance
                heroContent.style.transform = `translateY(${scrolled * 0.4}px)`;
                heroContent.style.opacity = 1 - (scrolled / (window.innerHeight * 0.8));
            }
        });

        window.addEventListener('scroll', handleParallax, { passive: true });
    }

    // ============================================
    // SMOOTH SCROLL FOR ANCHOR LINKS
    // ============================================
    function initSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href === '#' || href === '') return;

                const target = document.querySelector(href);
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }

    // ============================================
    // ACCESSIBILITY ENHANCEMENTS
    // ============================================
    function initAccessibility() {
        // Keyboard navigation indicator
        function handleFirstTab(e) {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-nav');
                window.removeEventListener('keydown', handleFirstTab);
            }
        }
        
        window.addEventListener('keydown', handleFirstTab);

        window.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-nav');
        });

        // Make gallery items accessible
        document.querySelectorAll('.gallery-item').forEach((item, index) => {
            item.setAttribute('tabindex', '0');
            item.setAttribute('role', 'button');
            const lang = utils.getLanguage();
            const label = lang === 'sv' ? `Se bild ${index + 1}` : `View image ${index + 1}`;
            item.setAttribute('aria-label', label);

            item.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    item.click();
                }
            });
        });
    }

    // ============================================
    // PERFORMANCE OPTIMIZATION
    // ============================================
    function optimizePerformance() {
        if (utils.isLowEndDevice()) {
            document.documentElement.style.setProperty('--transition-smooth', 'ease');
            console.log('Low-end device detected: Optimizations applied');
        }
    }

    // ============================================
    // PAGE VISIBILITY HANDLING
    // ============================================
    function initVisibilityHandling() {
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                document.body.classList.add('paused');
            } else {
                document.body.classList.remove('paused');
            }
        });
    }

    // ============================================
    // ENSURE SHOWCASE IMAGES ARE VISIBLE
    // ============================================
    function ensureShowcaseImages() {
        const showcaseCards = document.querySelectorAll('.showcase-card');
        showcaseCards.forEach((card, index) => {
            if (card.style.backgroundImage) {
                card.classList.add('loaded');
            } else {
                console.warn(`⚠️ Showcase card ${index + 1} missing background image`);
            }
        });
    }

    // ============================================
    // INITIALIZATION
    // ============================================
    function init() {
        try {
            // Initialize all features
            initPageLoad();
            privacyModal.init();
            cookieConsent.init();
            createParticles();
            initMobileMenu();
            initNavbarScroll();
            initActiveNavLink();
            ensureShowcaseImages();
            initLazyLoading();
            initLightbox();
            initParallax();
            initSmoothScroll();
            initAccessibility();
            optimizePerformance();
            initVisibilityHandling();
            scrollToTop.init();
            formHandler.init();

            console.log('✅ Website initialized successfully');
        } catch (error) {
            console.error('❌ Error during initialization:', error);
        }
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Final setup when window loads
    window.addEventListener('load', () => {
        requestAnimationFrame(() => {
            document.body.classList.add('loaded');
        });
    });

})();
