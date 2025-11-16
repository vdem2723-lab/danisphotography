// Progressive Enhancement: Soft Page Transitions
// This feature gracefully enhances navigation with smooth transitions

(function() {
    'use strict';

    // Only run if browser supports required APIs
    if (!window.fetch || !window.history || !window.history.pushState) {
        console.log('📝 Soft navigation not supported in this browser');
        return;
    }

    // Configuration
    const config = {
        transitionDuration: 300,
        enabledSelectors: 'a[href]:not([target="_blank"]):not([href^="mailto:"]):not([href^="tel:"]):not([href^="#"])',
        excludePatterns: ['/assets/', '/images/', '.pdf', '.jpg', '.png', '.gif'],
    };

    // Check if link should use soft navigation
    function shouldIntercept(link) {
        const href = link.getAttribute('href');
        
        // Skip external links
        if (link.hostname !== window.location.hostname) return false;
        
        // Skip excluded patterns
        if (config.excludePatterns.some(pattern => href.includes(pattern))) return false;
        
        // Skip if explicitly disabled
        if (link.hasAttribute('data-no-transition')) return false;
        
        return true;
    }

    // Fade out current page
    function fadeOut() {
        return new Promise((resolve) => {
            document.body.style.opacity = '0';
            document.body.style.transition = `opacity ${config.transitionDuration}ms ease-out`;
            setTimeout(resolve, config.transitionDuration);
        });
    }

    // Fade in new page
    function fadeIn() {
        requestAnimationFrame(() => {
            document.body.style.opacity = '1';
            setTimeout(() => {
                document.body.style.transition = '';
            }, config.transitionDuration);
        });
    }

    // Swap page content
    async function loadPage(url) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error('Page not found');
            
            const html = await response.text();
            const parser = new DOMParser();
            const newDoc = parser.parseFromString(html, 'text/html');
            
            // Update title
            document.title = newDoc.title;
            
            // Update main content
            const newMain = newDoc.querySelector('main');
            const currentMain = document.querySelector('main');
            
            if (newMain && currentMain) {
                currentMain.innerHTML = newMain.innerHTML;
            } else {
                // Fallback: replace entire body if main not found
                document.body.innerHTML = newDoc.body.innerHTML;
            }
            
            // Update meta tags
            updateMetaTags(newDoc);
            
            // Re-initialize scripts for new content
            reinitialize();
            
            // Scroll to top
            window.scrollTo({ top: 0, behavior: 'instant' });
            
            return true;
        } catch (error) {
            console.error('Soft navigation failed:', error);
            // Fallback to normal navigation
            window.location.href = url;
            return false;
        }
    }

    // Update meta tags
    function updateMetaTags(newDoc) {
        // Update description
        const newDesc = newDoc.querySelector('meta[name="description"]');
        const currentDesc = document.querySelector('meta[name="description"]');
        if (newDesc && currentDesc) {
            currentDesc.setAttribute('content', newDesc.getAttribute('content'));
        }
        
        // Update OG tags
        ['og:title', 'og:description', 'og:url', 'og:image'].forEach(property => {
            const newTag = newDoc.querySelector(`meta[property="${property}"]`);
            const currentTag = document.querySelector(`meta[property="${property}"]`);
            if (newTag && currentTag) {
                currentTag.setAttribute('content', newTag.getAttribute('content'));
            }
        });
    }

    // Reinitialize necessary scripts
    function reinitialize() {
        // Trigger custom event for other scripts to reinitialize
        window.dispatchEvent(new CustomEvent('soft-navigation-complete'));
        
        // Reinitialize common features
        if (window.initLazyLoading) window.initLazyLoading();
        if (window.initLightbox) window.initLightbox();
        if (window.initAccessibility) window.initAccessibility();
    }

    // Handle navigation
    async function navigate(url, updateHistory = true) {
        // Fade out
        await fadeOut();
        
        // Load new content
        const success = await loadPage(url);
        
        if (success) {
            // Update URL
            if (updateHistory) {
                window.history.pushState({ url: url }, '', url);
            }
            
            // Fade in
            fadeIn();
        }
    }

    // Intercept link clicks
    function interceptLinks() {
        document.addEventListener('click', (e) => {
            const link = e.target.closest(config.enabledSelectors);
            
            if (!link || !shouldIntercept(link)) return;
            
            e.preventDefault();
            const url = link.getAttribute('href');
            navigate(url);
        }, true);
    }

    // Handle back/forward buttons
    window.addEventListener('popstate', (e) => {
        if (e.state && e.state.url) {
            navigate(e.state.url, false);
        }
    });

    // Initialize
    function init() {
        // Save current state
        window.history.replaceState({ url: window.location.href }, '', window.location.href);
        
        // Start intercepting links
        interceptLinks();
        
        console.log('✨ Soft page transitions enabled');
    }

    // Start when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

})();
