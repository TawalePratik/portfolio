/* ================================================
   Pratik Tawale — Portfolio JavaScript
   ================================================
   Features:
   1. Mobile nav toggle with overlay
   2. Navbar style on scroll
   3. Smooth scroll (fallback)
   4. Scroll-based reveal animations
   5. Active nav link highlighting
   ================================================ */

(function () {
    'use strict';

    // =============================================
    // DOM ELEMENTS
    // =============================================
    const navbar     = document.getElementById('navbar');
    const navToggle  = document.getElementById('navToggle');
    const navLinks   = document.getElementById('navLinks');
    const allLinks   = document.querySelectorAll('.navbar__link');
    const sections   = document.querySelectorAll('.section, .hero');
    const animatedEls = document.querySelectorAll('[data-animate]');

    // =============================================
    // 1. MOBILE MENU TOGGLE
    // =============================================
    function openMenu() {
        navToggle.classList.add('open');
        navLinks.classList.add('active');
        document.body.classList.add('menu-open');
    }

    function closeMenu() {
        navToggle.classList.remove('open');
        navLinks.classList.remove('active');
        document.body.classList.remove('menu-open');
    }

    function toggleMenu() {
        if (navLinks.classList.contains('active')) {
            closeMenu();
        } else {
            openMenu();
        }
    }

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function (e) {
            e.stopPropagation();
            toggleMenu();
        });
    }

    // Close menu when clicking a link
    allLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            closeMenu();
        });
    });

    // Close menu when clicking outside (on overlay)
    document.addEventListener('click', function (e) {
        if (
            navLinks.classList.contains('active') &&
            !navLinks.contains(e.target) &&
            !navToggle.contains(e.target)
        ) {
            closeMenu();
        }
    });

    // Close menu on Escape key
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && navLinks.classList.contains('active')) {
            closeMenu();
        }
    });

    // =============================================
    // 2. NAVBAR — SCROLL EFFECT
    // =============================================
    let lastScroll = 0;

    function handleNavbarScroll() {
        var scrollY = window.scrollY;

        // Add shadow when scrolled
        if (scrollY > 20) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        lastScroll = scrollY;
    }

    if (navbar) {
        window.addEventListener('scroll', handleNavbarScroll, { passive: true });
    }

    // =============================================
    // 3. ACTIVE NAV LINK HIGHLIGHTING
    // =============================================
    function highlightActiveLink() {
        var scrollPos = window.scrollY + 100;

        sections.forEach(function (section) {
            var top    = section.offsetTop;
            var height = section.offsetHeight;
            var id     = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                allLinks.forEach(function (link) {
                    link.classList.remove('navbar__link--active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('navbar__link--active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', highlightActiveLink, { passive: true });

    // =============================================
    // 4. SCROLL REVEAL ANIMATIONS
    // =============================================
    function revealOnScroll() {
        var triggerOffset = window.innerHeight * 0.85;

        animatedEls.forEach(function (el) {
            var rect = el.getBoundingClientRect();

            if (rect.top < triggerOffset) {
                el.classList.add('visible');
            }
        });
    }

    // Run once on load
    revealOnScroll();

    // Run on scroll
    window.addEventListener('scroll', revealOnScroll, { passive: true });

    // =============================================
    // 5. SMOOTH SCROLL FALLBACK
    //    (for browsers that don't support CSS scroll-behavior)
    // =============================================
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;

            var target = document.querySelector(targetId);
            if (!target) return;

            // Only use JS scroll if CSS smooth scroll not supported
            if (!('scrollBehavior' in document.documentElement.style)) {
                e.preventDefault();
                var navHeight = navbar ? navbar.offsetHeight : 0;
                var targetPos = target.offsetTop - navHeight;

                window.scrollTo({
                    top: targetPos,
                    behavior: 'smooth'
                });
            }
        });
    });

    // =============================================
    // 6. TYPED EFFECT ON HERO (Optional subtle touch)
    // =============================================
    var heroTitle = document.querySelector('.hero__title');

    if (heroTitle) {
        heroTitle.style.opacity = '0';
        heroTitle.style.transition = 'opacity 0.6s ease';

        setTimeout(function () {
            heroTitle.style.opacity = '1';
        }, 400);
    }

    // =============================================
    // 7. CURRENT YEAR IN FOOTER (auto-update)
    // =============================================
    var footerCopy = document.querySelector('.footer__copy');
    if (footerCopy) {
        var currentYear = new Date().getFullYear();
        footerCopy.innerHTML = footerCopy.innerHTML.replace('2026', currentYear);
    }

})();