/* ================================================
   PRATIK TAWALE — Portfolio JavaScript
   ================================================
   Features:
   1.  Loader screen
   2.  Custom cursor
   3.  Scroll progress bar
   4.  Navbar — scroll + mobile toggle
   5.  Particle canvas (hero)
   6.  Typed text effect
   7.  Scroll reveal animations
   8.  Counter animation
   9.  3D tilt effect on cards
   10. Magnetic buttons
   11. Contact spotlight
   12. Drag-scroll for projects
   13. Active nav highlighting
   14. Konami code easter egg
   ================================================ */

(function () {
    'use strict';

    // =============================================
    // 1. LOADER
    // =============================================
    var loader = document.getElementById('loader');

    window.addEventListener('load', function () {
        setTimeout(function () {
            loader.classList.add('hidden');
            document.body.style.overflow = 'auto';
            initAnimations();
        }, 2800);
    });

    // Prevent scroll during load
    document.body.style.overflow = 'hidden';

    // =============================================
    // 2. CUSTOM CURSOR
    // =============================================
    var cursorDot = document.querySelector('.cursor__dot');
    var cursorRing = document.querySelector('.cursor__ring');
    var cursorEl = document.getElementById('cursor');
    var mouseX = 0, mouseY = 0;
    var ringX = 0, ringY = 0;

    function isTouchDevice() {
        return ('ontouchstart' in window) || navigator.maxTouchPoints > 0;
    }

    if (!isTouchDevice() && cursorDot && cursorRing) {
        document.addEventListener('mousemove', function (e) {
            mouseX = e.clientX;
            mouseY = e.clientY;
            cursorDot.style.left = mouseX + 'px';
            cursorDot.style.top = mouseY + 'px';
        });

        // Smooth ring follow
        function animateRing() {
            ringX += (mouseX - ringX) * 0.15;
            ringY += (mouseY - ringY) * 0.15;
            cursorRing.style.left = ringX + 'px';
            cursorRing.style.top = ringY + 'px';
            requestAnimationFrame(animateRing);
        }
        animateRing();

        // Hover state
        var hoverables = document.querySelectorAll('[data-hover]');
        hoverables.forEach(function (el) {
            el.addEventListener('mouseenter', function () {
                cursorEl.classList.add('hovering');
            });
            el.addEventListener('mouseleave', function () {
                cursorEl.classList.remove('hovering');
            });
        });

        // Hide cursor when leaving window
        document.addEventListener('mouseleave', function () {
            cursorDot.style.opacity = '0';
            cursorRing.style.opacity = '0';
        });
        document.addEventListener('mouseenter', function () {
            cursorDot.style.opacity = '1';
            cursorRing.style.opacity = '1';
        });
    }

    // =============================================
    // 3. SCROLL PROGRESS BAR
    // =============================================
    var scrollProgress = document.getElementById('scrollProgress');

    function updateScrollProgress() {
        var scrollTop = window.scrollY;
        var docHeight = document.documentElement.scrollHeight - window.innerHeight;
        var progress = (scrollTop / docHeight) * 100;
        if (scrollProgress) {
            scrollProgress.style.width = progress + '%';
        }
    }

    window.addEventListener('scroll', updateScrollProgress, { passive: true });

    // =============================================
    // 4. NAVBAR
    // =============================================
    var navbar = document.getElementById('navbar');
    var navToggle = document.getElementById('navToggle');
    var navLinks = document.getElementById('navLinks');
    var navLinkAll = document.querySelectorAll('.navbar__link');

    // Scroll effect
    window.addEventListener('scroll', function () {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, { passive: true });

    // Mobile toggle
    function closeMenu() {
        navToggle.classList.remove('open');
        navLinks.classList.remove('active');
        document.body.classList.remove('menu-open');
    }

    if (navToggle) {
        navToggle.addEventListener('click', function (e) {
            e.stopPropagation();
            var isOpen = navLinks.classList.contains('active');
            if (isOpen) {
                closeMenu();
            } else {
                navToggle.classList.add('open');
                navLinks.classList.add('active');
                document.body.classList.add('menu-open');
            }
        });
    }

    navLinkAll.forEach(function (link) {
        link.addEventListener('click', closeMenu);
    });

    document.addEventListener('click', function (e) {
        if (navLinks && navLinks.classList.contains('active') &&
            !navLinks.contains(e.target) &&
            !navToggle.contains(e.target)) {
            closeMenu();
        }
    });

    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') closeMenu();
    });

    // Active link
    var sections = document.querySelectorAll('section[id]');

    function highlightNav() {
        var scrollY = window.scrollY + 120;
        sections.forEach(function (sec) {
            var top = sec.offsetTop;
            var height = sec.offsetHeight;
            var id = sec.getAttribute('id');
            var link = document.querySelector('.navbar__link[href="#' + id + '"]');
            if (link) {
                if (scrollY >= top && scrollY < top + height) {
                    navLinkAll.forEach(function (l) { l.classList.remove('active'); });
                    link.classList.add('active');
                }
            }
        });
    }

    window.addEventListener('scroll', highlightNav, { passive: true });

    // =============================================
    // 5. PARTICLE CANVAS
    // =============================================
    var canvas = document.getElementById('particleCanvas');

    if (canvas) {
        var ctx = canvas.getContext('2d');
        var particles = [];
        var particleCount = 80;
        var connectionDistance = 120;
        var canvasMouseX = 0;
        var canvasMouseY = 0;

        function resizeCanvas() {
            canvas.width = canvas.parentElement.offsetWidth;
            canvas.height = canvas.parentElement.offsetHeight;
        }

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        canvas.addEventListener('mousemove', function (e) {
            var rect = canvas.getBoundingClientRect();
            canvasMouseX = e.clientX - rect.left;
            canvasMouseY = e.clientY - rect.top;
        });

        function Particle() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.radius = Math.random() * 2 + 0.5;
            this.opacity = Math.random() * 0.5 + 0.1;
        }

        Particle.prototype.update = function () {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

            // Mouse repulsion
            var dx = this.x - canvasMouseX;
            var dy = this.y - canvasMouseY;
            var dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 100) {
                this.x += dx * 0.01;
                this.y += dy * 0.01;
            }
        };

        Particle.prototype.draw = function () {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(108, 92, 231, ' + this.opacity + ')';
            ctx.fill();
        };

        // Create particles
        for (var i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function drawConnections() {
            for (var i = 0; i < particles.length; i++) {
                for (var j = i + 1; j < particles.length; j++) {
                    var dx = particles[i].x - particles[j].x;
                    var dy = particles[i].y - particles[j].y;
                    var dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < connectionDistance) {
                        var opacity = (1 - dist / connectionDistance) * 0.15;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = 'rgba(108, 92, 231, ' + opacity + ')';
                        ctx.lineWidth = 0.5;
                        ctx.stroke();
                    }
                }
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(function (p) {
                p.update();
                p.draw();
            });
            drawConnections();
            requestAnimationFrame(animateParticles);
        }

        animateParticles();
    }

    // =============================================
    // 6. TYPED TEXT EFFECT
    // =============================================
    var typedEl = document.getElementById('typedRole');
    var roles = [
        'Backend Developer',
        'Android Developer',
        'API Architect',
        'System Designer',
        'Problem Solver'
    ];
    var roleIndex = 0;
    var charIndex = 0;
    var isDeleting = false;
    var typingSpeed = 80;

    function typeRole() {
        if (!typedEl) return;

        var currentRole = roles[roleIndex];

        if (isDeleting) {
            typedEl.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typedEl.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }

        var speed = typingSpeed;

        if (!isDeleting && charIndex === currentRole.length) {
            speed = 2000; // Pause at end
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            speed = 400; // Pause before next word
        } else if (isDeleting) {
            speed = 40;
        }

        setTimeout(typeRole, speed);
    }

    // =============================================
    // 7. SCROLL REVEAL
    // =============================================
    var animatedEls = document.querySelectorAll('[data-animate]');

    function revealOnScroll() {
        var trigger = window.innerHeight * 0.87;
        animatedEls.forEach(function (el) {
            var rect = el.getBoundingClientRect();
            if (rect.top < trigger) {
                el.classList.add('visible');
            }
        });
    }

    function initAnimations() {
        revealOnScroll();
        typeRole();
    }

    window.addEventListener('scroll', revealOnScroll, { passive: true });

    // =============================================
    // 8. COUNTER ANIMATION
    // =============================================
    var statCards = document.querySelectorAll('.stat-card');
    var countersRun = false;

    function animateCounters() {
        if (countersRun) return;

        statCards.forEach(function (card) {
            var rect = card.getBoundingClientRect();
            if (rect.top < window.innerHeight * 0.9) {
                countersRun = true;
                var target = parseInt(card.getAttribute('data-count'));
                var numEl = card.querySelector('.stat-card__number');
                var duration = 2000;
                var startTime = null;

                function step(timestamp) {
                    if (!startTime) startTime = timestamp;
                    var progress = Math.min((timestamp - startTime) / duration, 1);
                    // Ease out
                    var eased = 1 - Math.pow(1 - progress, 3);
                    numEl.textContent = Math.floor(eased * target);
                    if (progress < 1) {
                        requestAnimationFrame(step);
                    } else {
                        numEl.textContent = target;
                    }
                }

                requestAnimationFrame(step);
            }
        });
    }

    window.addEventListener('scroll', animateCounters, { passive: true });

    // =============================================
    // 9. 3D TILT EFFECT
    // =============================================
    var tiltCards = document.querySelectorAll('[data-tilt]');

    if (!isTouchDevice()) {
        tiltCards.forEach(function (card) {
            card.addEventListener('mousemove', function (e) {
                var rect = card.getBoundingClientRect();
                var x = e.clientX - rect.left;
                var y = e.clientY - rect.top;
                var centerX = rect.width / 2;
                var centerY = rect.height / 2;
                var rotateX = ((y - centerY) / centerY) * -8;
                var rotateY = ((x - centerX) / centerX) * 8;

                card.style.transform =
                    'perspective(1000px) rotateX(' + rotateX + 'deg) rotateY(' + rotateY + 'deg) translateZ(10px)';
            });

            card.addEventListener('mouseleave', function () {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateZ(0)';
                card.style.transition = 'transform 0.5s ease';
            });

            card.addEventListener('mouseenter', function () {
                card.style.transition = 'none';
            });
        });
    }

    // =============================================
    // 10. MAGNETIC BUTTONS
    // =============================================
    var magneticBtns = document.querySelectorAll('[data-magnetic]');

    if (!isTouchDevice()) {
        magneticBtns.forEach(function (btn) {
            btn.addEventListener('mousemove', function (e) {
                var rect = btn.getBoundingClientRect();
                var x = e.clientX - rect.left - rect.width / 2;
                var y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = 'translate(' + (x * 0.3) + 'px, ' + (y * 0.3) + 'px)';
            });

            btn.addEventListener('mouseleave', function () {
                btn.style.transform = 'translate(0, 0)';
                btn.style.transition = 'transform 0.4s ease';
            });

            btn.addEventListener('mouseenter', function () {
                btn.style.transition = 'none';
            });
        });
    }

    // =============================================
    // 11. CONTACT SPOTLIGHT
    // =============================================
    var spotlight = document.getElementById('contactSpotlight');
    var contactSection = document.getElementById('contact');

    if (spotlight && contactSection && !isTouchDevice()) {
        contactSection.addEventListener('mousemove', function (e) {
            var rect = contactSection.getBoundingClientRect();
            spotlight.style.left = (e.clientX - rect.left) + 'px';
            spotlight.style.top = (e.clientY - rect.top) + 'px';
        });
    }

    // =============================================
    // 12. DRAG SCROLL — Projects Track
    // =============================================
    var track = document.getElementById('projectsTrack');

    if (track) {
        var isDown = false;
        var startX;
        var scrollLeft;

        track.addEventListener('mousedown', function (e) {
            isDown = true;
            track.style.cursor = 'grabbing';
            startX = e.pageX - track.offsetLeft;
            scrollLeft = track.scrollLeft;
        });

        track.addEventListener('mouseleave', function () {
            isDown = false;
            track.style.cursor = 'grab';
        });

        track.addEventListener('mouseup', function () {
            isDown = false;
            track.style.cursor = 'grab';
        });

        track.addEventListener('mousemove', function (e) {
            if (!isDown) return;
            e.preventDefault();
            var x = e.pageX - track.offsetLeft;
            var walk = (x - startX) * 2;
            track.scrollLeft = scrollLeft - walk;
        });
    }

    // =============================================
    // 13. SMOOTH SCROLL FALLBACK
    // =============================================
    document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
        anchor.addEventListener('click', function (e) {
            var targetId = this.getAttribute('href');
            if (targetId === '#') return;
            var target = document.querySelector(targetId);
            if (!target) return;

            if (!('scrollBehavior' in document.documentElement.style)) {
                e.preventDefault();
                var navH = navbar ? navbar.offsetHeight : 0;
                window.scrollTo({
                    top: target.offsetTop - navH,
                    behavior: 'smooth'
                });
            }
        });
    });

    // =============================================
    // 14. FOOTER YEAR
    // =============================================
    var yearEl = document.getElementById('year');
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }

    // =============================================
    // 15. KONAMI CODE EASTER EGG
    // =============================================
    var konamiCode = [
        'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
        'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
        'KeyB', 'KeyA'
    ];
    var konamiIndex = 0;

    document.addEventListener('keydown', function (e) {
        if (e.code === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                konamiIndex = 0;
                activateEasterEgg();
            }
        } else {
            konamiIndex = 0;
        }
    });

    function activateEasterEgg() {
        document.body.style.transition = 'filter 0.5s ease';
        document.body.style.filter = 'hue-rotate(90deg)';

        var msg = document.createElement('div');
        msg.textContent = '🎮 Konami Code Activated! You found the secret!';
        msg.style.cssText =
            'position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);' +
            'background:var(--gradient);color:#fff;padding:20px 40px;border-radius:12px;' +
            'font-family:var(--font);font-size:1.1rem;font-weight:600;z-index:99999;' +
            'box-shadow:0 20px 60px rgba(108,92,231,0.5);text-align:center;';
        document.body.appendChild(msg);

        setTimeout(function () {
            document.body.style.filter = 'none';
            msg.remove();
        }, 3000);
    }

})();
