/* ============================================
   Wanderlust Travels & Tourism
   Main JavaScript File
   ============================================ */
/* Admin↔Website bridge is handled by rr-bridge.js (loaded before this file in each page) */


document.addEventListener('DOMContentLoaded', function () {

    // ─── Lucide Icons ───────────────────────────────────────
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // ─── Custom Item-Based Search Category Dropdown ──────────
    function initSearchCategoryDropdown() {
        const dropdown = document.getElementById('searchCategoryDropdown');
        const triggerBtn = document.getElementById('categoryDropdownBtn');
        const selectedLabel = document.getElementById('selectedCategoryLabel');
        const hiddenSelect = document.getElementById('headerCategorySelect');
        const menu = document.getElementById('categoryDropdownMenu');

        if (dropdown && triggerBtn && menu) {
            // Toggle dropdown open/close
            triggerBtn.addEventListener('click', function (e) {
                e.stopPropagation();
                const isOpen = dropdown.classList.toggle('open');
                triggerBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
            });

            // Select an item
            const items = menu.querySelectorAll('[data-slot="item"]');
            items.forEach(function (item) {
                item.addEventListener('click', function (e) {
                    e.stopPropagation();
                    const val = this.getAttribute('data-value') || 'all';
                    const label = this.getAttribute('data-label') || this.querySelector('[data-slot="item-title"]').textContent.trim();

                    if (selectedLabel) selectedLabel.textContent = label;
                    if (hiddenSelect) {
                        hiddenSelect.value = val;
                        hiddenSelect.dispatchEvent(new Event('change', { bubbles: true }));
                    }

                    items.forEach(function (i) {
                        i.classList.remove('selected');
                        i.setAttribute('aria-selected', 'false');
                    });
                    this.classList.add('selected');
                    this.setAttribute('aria-selected', 'true');

                    dropdown.classList.remove('open');
                    triggerBtn.setAttribute('aria-expanded', 'false');
                });
            });

            // Close when clicking outside
            document.addEventListener('click', function (e) {
                if (!dropdown.contains(e.target)) {
                    dropdown.classList.remove('open');
                    triggerBtn.setAttribute('aria-expanded', 'false');
                }
            });

            // Close on Escape
            document.addEventListener('keydown', function (e) {
                if (e.key === 'Escape' && dropdown.classList.contains('open')) {
                    dropdown.classList.remove('open');
                    triggerBtn.setAttribute('aria-expanded', 'false');
                    triggerBtn.focus();
                }
            });
        }

        // Global Search Execution (Search button or Enter key)
        const searchBtn = document.getElementById('headerSearchBtn');
        const searchInput = document.getElementById('headerSearchInput');

        function executeHeaderSearch() {
            const query = searchInput ? searchInput.value.trim() : '';
            const cat = hiddenSelect ? hiddenSelect.value : 'all';

            const isCourses = window.location.pathname.includes('courses.html');
            const isServices = window.location.pathname.includes('services.html');

            if (isCourses || isServices) {
                // If on courses or services, trigger existing category tabs
                const targetBtn = document.querySelector(`.category-tab-btn[data-cat="${cat}"], .srv-filter-btn[data-filter="${cat}"]`);
                if (targetBtn) targetBtn.click();
                const targetSection = document.getElementById('destCatalog') || document.querySelector('.services-grid');
                if (targetSection) targetSection.scrollIntoView({ behavior: 'smooth' });
            } else {
                // Redirect to courses catalog with query and category params
                let targetUrl = 'courses.html';
                const params = [];
                if (cat && cat !== 'all') params.push('cat=' + encodeURIComponent(cat));
                if (query) params.push('q=' + encodeURIComponent(query));
                if (params.length > 0) targetUrl += '?' + params.join('&');
                window.location.href = targetUrl;
            }
        }

        if (searchBtn) {
            searchBtn.addEventListener('click', executeHeaderSearch);
        }
        if (searchInput) {
            searchInput.addEventListener('keydown', function (e) {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    executeHeaderSearch();
                }
            });
        }

        // Check URL params on courses.html to activate category
        if (window.location.pathname.includes('courses.html')) {
            const urlParams = new URLSearchParams(window.location.search);
            const urlCat = urlParams.get('cat');
            if (urlCat) {
                setTimeout(function () {
                    const btn = document.querySelector(`.category-tab-btn[data-cat="${urlCat}"]`);
                    if (btn) btn.click();
                    if (hiddenSelect) hiddenSelect.value = urlCat;
                    const matchingItem = document.querySelector(`[data-slot="item"][data-value="${urlCat}"]`);
                    if (matchingItem && selectedLabel) {
                        selectedLabel.textContent = matchingItem.getAttribute('data-label') || urlCat;
                        document.querySelectorAll('[data-slot="item"]').forEach(function (i) { i.classList.remove('selected'); });
                        matchingItem.classList.add('selected');
                    }
                }, 100);
            }
        }
    }

    initSearchCategoryDropdown();

    // ─── Navbar Scroll Behaviour ────────────────────────────
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        const handleScroll = () => {
            if (window.scrollY > 60) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        handleScroll(); // Run on load
    }

    // ─── Mobile Navigation Drawer & Hamburger Menu ───────────
    const mobileBtn = document.getElementById('mobileMenuBtn') || document.querySelector('.mobile-toggle') || document.querySelector('.hamburger');
    const navMenu = document.getElementById('mainNav') || document.querySelector('.main-nav') || document.querySelector('.nav-links');

    // Create backdrop overlay if not existing
    let navOverlay = document.querySelector('.site-nav-overlay');
    if (!navOverlay) {
        navOverlay = document.createElement('div');
        navOverlay.className = 'site-nav-overlay';
        document.body.appendChild(navOverlay);
    }

    function closeMobileMenu() {
        if (!navMenu) return;
        navMenu.classList.remove('mobile-active');
        navMenu.classList.remove('active');
        if (navOverlay) navOverlay.classList.remove('active');
        if (mobileBtn) {
            mobileBtn.classList.remove('active');
            const icon = mobileBtn.querySelector('i');
            if (icon) {
                icon.setAttribute('data-lucide', 'menu');
                if (typeof lucide !== 'undefined') lucide.createIcons();
            }
        }
        document.body.style.overflow = '';
    }

    function openMobileMenu() {
        if (!navMenu) return;
        navMenu.classList.add('mobile-active');
        navMenu.classList.add('active');
        if (navOverlay) navOverlay.classList.add('active');
        if (mobileBtn) {
            mobileBtn.classList.add('active');
            const icon = mobileBtn.querySelector('i');
            if (icon) {
                icon.setAttribute('data-lucide', 'x');
                if (typeof lucide !== 'undefined') lucide.createIcons();
            }
        }
        document.body.style.overflow = 'hidden';
    }

    if (mobileBtn && navMenu) {
        mobileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const isOpen = navMenu.classList.contains('mobile-active') || navMenu.classList.contains('active');
            if (isOpen) {
                closeMobileMenu();
            } else {
                openMobileMenu();
            }
        });

        if (navOverlay) {
            navOverlay.addEventListener('click', closeMobileMenu);
        }

        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMobileMenu);
        });

        document.addEventListener('click', (e) => {
            if ((navMenu.classList.contains('mobile-active') || navMenu.classList.contains('active')) &&
                !navMenu.contains(e.target) &&
                !mobileBtn.contains(e.target)) {
                closeMobileMenu();
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeMobileMenu();
        });
    }

    // ─── Animated Counter ────────────────────────────────────
    const counters = document.querySelectorAll('.counter');
    if (counters.length > 0) {
        const animateCounter = (el) => {
            const target = parseInt(el.getAttribute('data-target')) || 0;
            const hasPlus = el.getAttribute('data-plus') === 'true';
            const duration = 2200;
            const step = target / (duration / 16);
            let current = 0;
            const timer = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(timer);
                }
                el.textContent = Math.floor(current).toLocaleString('en-IN') + (hasPlus ? '+' : '');
            }, 16);
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !entry.target.dataset.animated) {
                    entry.target.dataset.animated = 'true';
                    animateCounter(entry.target);
                }
            });
        }, { threshold: 0.4 });

        counters.forEach(counter => observer.observe(counter));
    }

    // ─── Back to Top Button ──────────────────────────────────
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                backToTop.classList.add('visible');
            } else {
                backToTop.classList.remove('visible');
            }
        }, { passive: true });

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ─── Smooth Page Entrance Animations ────────────────────
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                fadeObserver.unobserve(entry.target);
            }
        });
    }, observerOptions);

    document.querySelectorAll('.card, .stat-item, .why-item, .testimonial-card, .gallery-item, .course-full-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        fadeObserver.observe(el);
    });

    // ─── Active Nav Link Highlight ───────────────────────────
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav-links a').forEach(link => {
        const href = link.getAttribute('href');
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.style.color = 'var(--color-accent)';
        }
    });

    // ─── Sticky Nav Active on Scroll (Sections) ─────────────
    const sections = document.querySelectorAll('section[id]');
    if (sections.length > 0) {
        window.addEventListener('scroll', () => {
            sections.forEach(section => {
                const rect = section.getBoundingClientRect();
                if (rect.top <= 100 && rect.bottom >= 100) {
                    const id = section.getAttribute('id');
                    document.querySelectorAll('.nav-links a').forEach(link => {
                        link.classList.remove('active-section');
                        if (link.getAttribute('href') === '#' + id) {
                            link.classList.add('active-section');
                        }
                    });
                }
            });
        }, { passive: true });
    }

    // ─── Form Validation Enhancement ─────────────────────────
    document.querySelectorAll('form').forEach(form => {
        form.querySelectorAll('.form-control').forEach(input => {
            input.addEventListener('blur', () => {
                if (input.required && !input.value.trim()) {
                    input.style.borderColor = '#e53935';
                } else {
                    input.style.borderColor = 'var(--color-primary)';
                }
            });
            input.addEventListener('input', () => {
                if (input.value.trim()) {
                    input.style.borderColor = 'var(--color-primary)';
                }
            });
        });
    });

    // ─── Card Hover 3D Tilt Effect (subtle) ──────────────────
    document.querySelectorAll('.card, .course-full-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / centerY * -3;
            const rotateY = (x - centerX) / centerX * 3;
            card.style.transform = `translateY(-10px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
            card.style.transition = 'all 0.35s ease';
        });
    });

    // ─── Notice Bar Pause on Hover ────────────────────────────
    const noticeTrack = document.querySelector('.notice-track');
    if (noticeTrack) {
        noticeTrack.addEventListener('mouseenter', () => {
            noticeTrack.style.animationPlayState = 'paused';
        });
        noticeTrack.addEventListener('mouseleave', () => {
            noticeTrack.style.animationPlayState = 'running';
        });
    }

    // ─── Gallery Lightbox Keyboard Navigation ─────────────────
    document.addEventListener('keydown', (e) => {
        const lightbox = document.getElementById('lightbox');
        if (lightbox && lightbox.classList.contains('open') && e.key === 'Escape') {
            lightbox.classList.remove('open');
        }
    });

    // ─── Progress Bar Animation ───────────────────────────────
    const progressObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const width = bar.style.width;
                bar.style.width = '0';
                setTimeout(() => {
                    bar.style.transition = 'width 1.5s ease';
                    bar.style.width = width;
                }, 200);
                progressObserver.unobserve(bar);
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('.progress-bar').forEach(bar => {
        progressObserver.observe(bar);
    });

    // ─── Floating Enroll Button Pulse ────────────────────────
    const floatingBtn = document.querySelector('.floating-enroll');
    if (floatingBtn) {
        let pulse = true;
        setInterval(() => {
            if (pulse) {
                floatingBtn.style.boxShadow = '0 0 0 10px rgba(255,111,0,0.15), 0 8px 32px rgba(255,111,0,0.35)';
            } else {
                floatingBtn.style.boxShadow = '0 8px 32px rgba(255,111,0,0.25)';
            }
            pulse = !pulse;
        }, 1500);
    }

    // ─── Smooth Scroll for anchor links ─────────────────────
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ─── Hero Swiper Initialization ─────────────────────────
    function renderHeroSlidesFromList(banners) {
        const swiperWrapper = document.getElementById('heroSwiperWrapper');
        if (!swiperWrapper) return;

        swiperWrapper.innerHTML = '';
        banners.forEach(b => {
            const slide = document.createElement('div');
            slide.className = 'swiper-slide';
            slide.style.width = '100%';
            slide.style.height = '100%';
            slide.style.overflow = 'hidden';

            const img = document.createElement('img');
            img.src = b.url;
            img.alt = "Slider Image";
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
            img.style.objectPosition = 'center';
            img.style.display = 'block';
            /* Enable high-quality rendering */
            img.style.imageRendering = '-webkit-optimize-contrast';
            img.style.imageRendering = 'crisp-edges';

            slide.appendChild(img);

            if (b.link) {
                slide.style.cursor = 'pointer';
                slide.addEventListener('click', () => { window.location.href = b.link; });
            }
            swiperWrapper.appendChild(slide);
        });

        if (typeof Swiper !== 'undefined' && !window.heroSwiperInstance) {
            window.heroSwiperInstance = new Swiper('.heroSwiper', {
                loop: true,
                autoplay: { delay: 3000, disableOnInteraction: false },
                scrollbar: { el: '.swiper-scrollbar', hide: false },
                pagination: { el: '.swiper-pagination', clickable: true },
                effect: 'fade',
                fadeEffect: { crossFade: true },
            });
        } else if (window.heroSwiperInstance) {
            window.heroSwiperInstance.update();
        }
    }

    function initHeroSwiper() {
        const swiperWrapper = document.getElementById('heroSwiperWrapper');
        if (!swiperWrapper) return;

        /* Priority: rr_sliders (Slider Manager) → settings.banners → defaults */
        let banners = [];
        try {
            const raw = localStorage.getItem('rr_sliders');
            if (raw) {
                const slides = JSON.parse(raw);
                banners = slides.filter(s => s.status === 'active' && s.image).map(s => ({
                    url: s.image,
                    link: s.link || null
                }));
            }
        } catch (e) { }

        if (banners.length === 0) {
            const settings = window.rr_current_settings || {};
            const urls = settings.banners || [
                'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=2000'
            ];
            banners = urls.map(u => ({ url: u, link: null }));
        }

        renderHeroSlidesFromList(banners);

        // Asynchronously sync latest sliders from server database
        if (!window.rrSliderSyncDone) {
            window.rrSliderSyncDone = true;
            fetch('api.php?action=get&key=rr_sliders')
                .then(res => res.text())
                .then(text => {
                    if (text && text !== 'null') {
                        const slides = JSON.parse(text);
                        localStorage.setItem('rr_sliders', text);
                        const apiBanners = slides.filter(s => s.status === 'active' && s.image).map(s => ({
                            url: s.image,
                            link: s.link || null
                        }));
                        if (apiBanners.length > 0 && JSON.stringify(apiBanners) !== JSON.stringify(banners)) {
                            renderHeroSlidesFromList(apiBanners);
                        }
                    }
                })
                .catch(e => console.warn('Could not sync sliders from API', e));
        }
    }

    initHeroSwiper();
    document.addEventListener('rr_dom_updated', initHeroSwiper);

    console.log('✅ Wanderlust Travels & Tourism — Website loaded successfully!');
});
