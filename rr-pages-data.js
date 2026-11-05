/**
 * ═══════════════════════════════════════════════════════
 *   Wanderlust Travels & Tourism
 *   Pages Data & CRUD Bridge v3.0 (PHP + SQLite Backend)
 * ═══════════════════════════════════════════════════════
 */

(function () {
    'use strict';

    const KEY = 'rr_pages_data';
    const pathParts = window.location.pathname.split('/');
    const lastPart = pathParts[pathParts.length - 1];
    const parentFolder = pathParts[pathParts.length - 2];
    const isInsideAdminFolder = parentFolder === 'admin' || lastPart === 'admin';

    const basePath = isInsideAdminFolder ? '../' : './';
    const API_URL = basePath + 'api.php';

    const rrPagesSeed = [
        {
            id: 'p_index',
            title: 'Home — Wanderlust Travels',
            slug: './index.html',
            isBuiltIn: true,
            status: 'Live',
            lastUpdated: '22 Jul 2026',
            metaTitle: 'Wanderlust Travels & Tourism | Explore India & World',
            metaDesc: 'Discover premium holiday packages, weekend getaways, and customized travel tours across India and international destinations.',
            heroHeading: 'Discover India\'s Most Beautiful Destinations',
            heroSubtitle: 'Premium guided holiday packages, luxury stays, and 100% customizable itineraries.',
            content: '<p>Welcome to Wanderlust Travels. Explore our curated holiday packages, flight bookings, and hotel reservations.</p>',
            customSections: {
                welcomeTitle: 'Craft Your Dream Vacation',
                welcomeText: 'We provide world-class holiday experiences across India and global destinations.'
            }
        },
        {
            id: 'p_about',
            title: 'About Us — Wanderlust Travels',
            slug: './about.html',
            isBuiltIn: true,
            status: 'Live',
            lastUpdated: '22 Jul 2026',
            metaTitle: 'About Us | Wanderlust Travels & Tourism',
            metaDesc: 'Learn about Wanderlust Travels — India\'s premier holiday planner and travel agency.',
            heroHeading: 'About Wanderlust Travels',
            heroSubtitle: 'Crafting Unforgettable Journeys Since 2014',
            content: '<p>Wanderlust Travels was established with a passion for exploration: to make world-class travel experiences accessible, seamless, and memorable for travelers across India and abroad.</p><p>Over the years, we have hosted over 25,000 satisfied travelers, organized 1,500+ group departures, and established strong partnerships with top luxury hotels, certified local guides, and trusted airlines worldwide.</p>',
            customSections: {
                missionText: 'To inspire and enable travelers to discover the cultural beauty and breathtaking landscapes of India and the world with personalized service and sustainable tourism.',
                visionText: 'To be India\'s most trusted and beloved holiday travel company, recognized for authentic experiences and excellence in traveler care.',
                directorHeading: 'Passionate Explorers, Dedicated Travel Experts',
                directorMessage: 'We continuously craft unique travel itineraries that combine adventure, comfort, and cultural immersion to make every vacation unforgettable.'
            }
        },
        {
            id: 'p_courses',
            title: 'Destinations & Packages — Wanderlust Travels',
            slug: './courses.html',
            isBuiltIn: true,
            status: 'Live',
            lastUpdated: '22 Jul 2026',
            metaTitle: 'Holiday Destinations & Packages | Wanderlust Travels',
            metaDesc: 'Explore all top holiday packages at Wanderlust Travels - Goa, Rajasthan, Manali, Kerala, Kashmir, Andaman, and International tours.',
            heroHeading: 'Our Holiday Destinations & Packages',
            heroSubtitle: 'Handcrafted Tour Packages For Every Kind of Traveler',
            content: '<p>Discover our popular holiday packages with 100% verified hotels, certified guides, and flexible booking dates.</p>',
            customSections: {}
        },
        {
            id: 'p_gallery',
            title: 'Travel Photo Gallery — Wanderlust Travels',
            slug: './gallery.html',
            isBuiltIn: true,
            status: 'Live',
            lastUpdated: '22 Jul 2026',
            metaTitle: 'Photo Gallery | Wanderlust Travels',
            metaDesc: 'Browse breathtaking photos of our travelers exploring beaches, mountains, palaces, and scenic landscapes.',
            heroHeading: 'Traveler Moments & Destinations',
            heroSubtitle: 'Memories Captured Across India and Beyond',
            content: '<p>Take a visual journey through our scenic destinations and memorable traveler experiences.</p>',
            customSections: {}
        },
        {
            id: 'p_contact',
            title: 'Contact Us — Wanderlust Travels',
            slug: './contact.html',
            isBuiltIn: true,
            status: 'Live',
            lastUpdated: '22 Jul 2026',
            metaTitle: 'Contact Us | Wanderlust Travels',
            metaDesc: 'Get in touch with Wanderlust Travels. Visit our New Delhi office, call our travel desk, or request a custom itinerary.',
            heroHeading: 'Contact Information',
            heroSubtitle: 'We Are Here to Help You Plan Your Dream Holiday',
            content: '<p>Reach out to our trip planners for custom itineraries, group bookings, or holiday inquiries. Our team is ready to assist you.</p>',
            customSections: {
                introText: 'Feel free to visit our booking lounge in New Delhi or contact us via phone, email, or WhatsApp.',
                addressOverride: 'Connaught Place, New Delhi, India',
                phoneOverride: '+91 98765 43210',
                emailOverride: 'contact@wanderlusttravels.com'
            }
        },
        {
            id: 'p_enroll',
            title: 'Tour Reservation — Wanderlust Travels',
            slug: './enroll.html',
            isBuiltIn: true,
            status: 'Live',
            lastUpdated: '22 Jul 2026',
            metaTitle: 'Tour Booking & Reservation | Wanderlust Travels',
            metaDesc: 'Book your holiday package online with flexible advance deposit and instant booking confirmation.',
            heroHeading: 'Tour Booking & Reservation',
            heroSubtitle: 'Reserve Your Dream Holiday in a Few Easy Steps',
            content: '<p>Fill out our simple tour reservation form to lock in your travel dates and preferred accommodations.</p>',
            customSections: {}
        },
        {
            id: 'p_blog',
            title: 'Travel Blog & Guides — Wanderlust Travels',
            slug: './blog.html',
            isBuiltIn: true,
            status: 'Live',
            lastUpdated: '22 Jul 2026',
            metaTitle: 'Travel Blog & Guides | Wanderlust Travels',
            metaDesc: 'Inspiring travel stories, packing tips, destination guides, and holiday ideas from seasoned travelers.',
            heroHeading: 'Travel Inspiration & Stories',
            heroSubtitle: 'Guides, Itineraries & Insider Tips',
            content: '<p>Discover the latest travel guides, secret spots, and packing tips for your next vacation.</p>',
            customSections: {}
        }
    ];

    window.rr_current_pages = rrPagesSeed;

    function getRrAuthHeaders() {
        const headers = { 'Content-Type': 'application/json' };
        const token = localStorage.getItem('rr_admin_token') || sessionStorage.getItem('rr_admin_token');
        if (token) headers['X-Admin-Token'] = token;
        return headers;
    }

    async function initPages() {
        try {
            const res = await fetch(API_URL + '?action=get&key=' + KEY);
            const text = await res.text();
            if (text && text !== 'null') {
                const parsed = JSON.parse(text);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    window.rr_current_pages = parsed;
                }
            } else {
                const token = localStorage.getItem('rr_admin_token') || sessionStorage.getItem('rr_admin_token');
                if (token) {
                    await fetch(API_URL + '?action=set&key=' + KEY, {
                        method: 'POST',
                        headers: getRrAuthHeaders(),
                        body: JSON.stringify(rrPagesSeed)
                    });
                }
            }
        } catch (e) {
            console.error('Failed to load pages from API, using defaults', e);
        }

        applyCurrentPageOverrides();
        document.dispatchEvent(new Event('rr_pages_loaded'));
    }

    async function saveRrPages(pagesArray) {
        try {
            const res = await fetch(API_URL + '?action=set&key=' + KEY, {
                method: 'POST',
                headers: getRrAuthHeaders(),
                body: JSON.stringify(pagesArray)
            });
            if (!res.ok) {
                if (res.status === 401 && isInsideAdminFolder) {
                    alert('Session expired or unauthorized. Please login again.');
                }
                throw new Error('Failed to save pages: ' + res.statusText);
            }
            window.rr_current_pages = pagesArray;
            applyCurrentPageOverrides();
            document.dispatchEvent(new Event('rr_pages_loaded'));
            return true;
        } catch (e) {
            console.error('Failed to save pages to API', e);
            throw e;
        }
    }

    function getRrPages() {
        return window.rr_current_pages || rrPagesSeed;
    }

    function getPageBySlug(slugOrId) {
        const pages = getRrPages();
        return pages.find(p => p.id === slugOrId || p.slug === slugOrId || p.slug === './' + slugOrId || p.slug === slugOrId + '.html' || p.slug === './' + slugOrId + '.html');
    }

    function getCleanPageName(pathOrSlug) {
        if (!pathOrSlug) return '';
        let clean = pathOrSlug.split('/').pop().replace('./', '').replace('.html', '').trim();
        return clean.toLowerCase();
    }

    function applyCurrentPageOverrides() {
        if (isInsideAdminFolder) return; // Do not apply on admin panel pages directly

        const pages = getRrPages();
        const rawPath = window.location.pathname.split('/').pop() || 'index.html';
        const cleanPath = getCleanPageName(rawPath);
        const urlParams = new URLSearchParams(window.location.search);
        const customSlug = urlParams.get('slug') || urlParams.get('id');

        let targetPage = null;

        if (cleanPath === 'page' || cleanPath === 'custom-page') {
            if (customSlug) {
                targetPage = pages.find(p => p.id === customSlug || p.slug.includes(customSlug));
            }
        } else {
            targetPage = pages.find(p => {
                const pClean = getCleanPageName(p.slug);
                return pClean === cleanPath || (cleanPath === '' && pClean === 'index');
            });
        }

        if (!targetPage) return;

        // Apply SEO Meta
        if (targetPage.metaTitle || targetPage.title) {
            document.title = targetPage.metaTitle || targetPage.title;
        }
        if (targetPage.metaDesc) {
            let meta = document.querySelector('meta[name="description"]');
            if (!meta) {
                meta = document.createElement('meta');
                meta.name = 'description';
                document.head.appendChild(meta);
            }
            meta.content = targetPage.metaDesc;
        }

        // Apply Hero Heading and Subtitle/Tag if present on the page
        const heroH1 = document.querySelector('.page-hero h1');
        if (heroH1 && targetPage.heroHeading) {
            heroH1.textContent = targetPage.heroHeading;
        }
        if (targetPage.heroSubtitle) {
            const heroTag = document.querySelector('.page-hero .tag') || document.querySelector('.page-hero p');
            if (heroTag) heroTag.textContent = targetPage.heroSubtitle;
        }

        // Apply specific page customizations
        if (cleanPath === 'about') {
            const cs = targetPage.customSections || {};
            const cards = document.querySelectorAll('.grid-12 .card p');
            if (cs.missionText && cards.length >= 1) cards[0].textContent = cs.missionText;
            if (cs.visionText && cards.length >= 2) cards[1].textContent = cs.visionText;

            // Specifically target the Director's Message heading inside .section-pale (not Mission heading)
            const dirBox = document.querySelector('.section-pale .grid-12 div:nth-child(2)');
            if (dirBox) {
                const dirHeading = dirBox.querySelector('h2');
                if (cs.directorHeading && dirHeading) {
                    dirHeading.textContent = cs.directorHeading;
                }
                if (targetPage.content) {
                    const tagHtml = dirBox.querySelector('.tag') ? dirBox.querySelector('.tag').outerHTML : '<span class="tag">Director\'s Message</span>';
                    const h2Html = dirHeading ? dirHeading.outerHTML : `<h2>${cs.directorHeading || 'Building Digital Skills'}</h2>`;
                    const h4Html = dirBox.querySelector('h4') ? dirBox.querySelector('h4').outerHTML : '';
                    dirBox.innerHTML = `${tagHtml}${h2Html}${targetPage.content}${h4Html}`;
                }
            }
        } else if (cleanPath === 'contact') {
            const cs = targetPage.customSections || {};
            if (cs.introText) {
                const intro = document.querySelector('.section .grid-12 p');
                if (intro) intro.textContent = cs.introText;
            }
            if (cs.addressOverride) {
                document.querySelectorAll('.footer-address, .site-address, [data-address]').forEach(el => el.textContent = cs.addressOverride);
            }
            if (cs.phoneOverride) {
                document.querySelectorAll('.footer-phone, .site-phone, [data-phone]').forEach(el => el.textContent = cs.phoneOverride);
            }
        } else if (cleanPath === 'page' || cleanPath === 'custom-page') {
            const heroH1Custom = document.getElementById('customHeroTitle');
            const heroSubCustom = document.getElementById('customHeroSubtitle');
            const bodyContainer = document.getElementById('customPageContent');
            const breadcrumbText = document.getElementById('customBreadcrumbText');

            if (heroH1Custom) heroH1Custom.textContent = targetPage.heroHeading || targetPage.title.split('—')[0].trim();
            if (heroSubCustom) heroSubCustom.textContent = targetPage.heroSubtitle || 'Wanderlust Travels & Tourism';
            if (breadcrumbText) breadcrumbText.textContent = targetPage.heroHeading || targetPage.title.split('—')[0].trim();
            if (bodyContainer) bodyContainer.innerHTML = targetPage.content || '<p>No content added for this page yet.</p>';
        }
    }

    // Expose functions globally
    window.rrPagesSeed = rrPagesSeed;
    window.initPages = initPages;
    window.saveRrPages = saveRrPages;
    window.getRrPages = getRrPages;
    window.getPageBySlug = getPageBySlug;
    window.applyCurrentPageOverrides = applyCurrentPageOverrides;

    // Start initialization and ensure execution on DOM ready & updates
    window.rrPagesPromise = initPages();
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => applyCurrentPageOverrides());
    } else {
        setTimeout(applyCurrentPageOverrides, 50);
    }
    document.addEventListener('rr_dom_updated', () => applyCurrentPageOverrides());

})();
