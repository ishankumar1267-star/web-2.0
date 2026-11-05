/**
 * ═══════════════════════════════════════════════════════
 *   Wanderlust Travels & Tourism
 *   API Bridge v3.0 (PHP + SQLite Backend)
 * ═══════════════════════════════════════════════════════
 */

(function () {
    'use strict';

    const KEY = 'rr_site_settings';
    // Determine if we are inside the 'admin' directory correctly (avoiding local paths like C:/Users/admin/)
    const pathParts = window.location.pathname.split('/');
    const lastPart = pathParts[pathParts.length - 1];
    const parentFolder = pathParts[pathParts.length - 2];
    const isInsideAdminFolder = parentFolder === 'admin' || lastPart === 'admin';

    const basePath = isInsideAdminFolder ? '../' : './';
    const API_URL = basePath + 'api.php';

    // ---- Admin Security Guard ----
    const isAdmin = isInsideAdminFolder;
    const isLogin = window.location.pathname.includes('login.html');
    
    if (isAdmin && !isLogin) {
        const token = localStorage.getItem('rr_admin_token') || sessionStorage.getItem('rr_admin_token');
        if (!token) {
            // Unauthenticated! Redirect to login.
            window.location.href = 'login.html';
            return; // stop execution
        }
    }

    const DEFAULTS = {
        siteName:        'Wanderlust Travels & Tourism',
        tagline:         "India's Premier Travel & Holiday Booking Agency",
        logoText:        'Wanderlust',
        logoUrl:         '',
        favicon:         '',
        phone:           '+91 98765 43210',
        email:           'contact@wanderlusttravels.com',
        address:         'Connaught Place, New Delhi, India',
        whatsapp:        '919876543210',
        facebook:        'https://facebook.com/wanderlusttravels',
        instagram:       'https://instagram.com/wanderlusttravels',
        youtube:         'https://youtube.com/wanderlusttravels',
        primaryColor:    '#0d47a1',
        accentColor:     '#ff6f00',
        tourBookingsOpen: true,
        admissionsOpen:  true,
        maintenanceMode: false,
        googleMapUrl:    '',
        metaDesc:        "Discover India's most breathtaking destinations and holiday packages with Wanderlust Travels.",
        heroBg:          '',
        heroBadge:       "New Holiday Packages 2026-27",
        heroTitle:       'Discover India & World',
        heroSubTitle:    'With Wanderlust Travels',
        heroDesc:        'Explore Goa, Rajasthan, Kerala, Manali, Kashmir, Ladakh & International destinations with expert guides and customizable itineraries.',
        heroCTA1Text:    '✈️ Book Tour Now',
        heroCTA1Link:    'enroll.html',
        heroCTA2Text:    '🗺️ Explore Packages',
        heroCTA2Link:    'courses.html',
        banners:         [
            'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&q=80&w=2000',
            'https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&q=80&w=2000',
            'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=2000'
        ]
    };

    window.rr_current_settings = DEFAULTS; // Fallback immediately available

    async function fetchSettingsFromAPI() {
        try {
            const res = await fetch(API_URL + '?action=get&key=' + KEY);
            const text = await res.text();
            if (text) {
                return Object.assign({}, DEFAULTS, JSON.parse(text));
            }
        } catch (e) { console.error('API Error', e); }
        return Object.assign({}, DEFAULTS);
    }

    async function saveSettingsToAPI(updates) {
        const current = window.rr_current_settings || DEFAULTS;
        const merged = Object.assign({}, current, updates);
        try {
            const headers = { 'Content-Type': 'application/json' };
            const token = localStorage.getItem('rr_admin_token') || sessionStorage.getItem('rr_admin_token');
            if (token) headers['X-Admin-Token'] = token;

            const response = await fetch(API_URL + '?action=set&key=' + KEY, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(merged)
            });
            if (!response.ok) {
                if (response.status === 401 && isAdmin) window.location.href = 'login.html';
                throw new Error('Failed to save settings: ' + response.statusText);
            }
        } catch(e) { console.error('Save API Error', e); }
        window.rr_current_settings = merged;
        applySettings(merged);
        
        // Notify other scripts that settings updated
        document.dispatchEvent(new CustomEvent('rr_settings_updated', { detail: merged }));
        return merged;
    }

    function applySettings(s) {
        const root = document.documentElement;
        if (s.primaryColor) {
            root.style.setProperty('--color-primary', s.primaryColor);
            root.style.setProperty('--color-primary-dark', s.primaryColor);
            root.style.setProperty('--admin-primary', s.primaryColor);
            root.style.setProperty('--admin-sidebar', s.primaryColor);
        }
        if (s.accentColor) {
            root.style.setProperty('--color-accent', s.accentColor);
            root.style.setProperty('--color-accent-hover', s.accentColor);
            root.style.setProperty('--admin-accent', s.accentColor);
            root.style.setProperty('--admin-sidebar-active', s.accentColor);
        }

        if (s.favicon) {
            let link = document.querySelector('link[rel="icon"]');
            if (!link) { link = document.createElement('link'); link.rel = 'icon'; document.head.appendChild(link); }
            link.href = s.favicon;
        }

        if (s.logoUrl) {
            document.querySelectorAll('.logo-icon, .logo-icon-footer, .logo-icon-admin').forEach(el => {
                el.innerHTML = '<img src="' + s.logoUrl + '" alt="Logo" style="width:100%;height:100%;object-fit:contain;border-radius:8px;">';
            });
        }

        if (s.logoText) {
            document.querySelectorAll('.logo-text-main, #sidebarLogoText').forEach(el => el.textContent = s.logoText);
        }

        if (s.tagline) {
            document.querySelectorAll('.logo-text-sub').forEach(el => el.textContent = s.tagline.substring(0, 50));
        }

        if (s.phone) {
            const clean = s.phone.replace(/\D/g, '');
            document.querySelectorAll('a[href^="tel:"]').forEach(el => el.href = 'tel:+' + clean);
            document.querySelectorAll('.footer-phone, .site-phone, [data-phone]').forEach(el => el.textContent = s.phone);
        }

        if (s.email) {
            document.querySelectorAll('a[href^="mailto:"]').forEach(el => el.href = 'mailto:' + s.email);
            document.querySelectorAll('.footer-email, .site-email, [data-email]').forEach(el => el.textContent = s.email);
        }

        if (s.whatsapp) {
            document.querySelectorAll('a[href*="wa.me"], [data-social="whatsapp"]').forEach(el => el.href = 'https://wa.me/' + s.whatsapp);
        }

        function applySocial(platform, val, iconUrl) {
            document.querySelectorAll('[data-social="' + platform + '"]').forEach(el => {
                if (val) el.href = (platform === 'whatsapp') ? 'https://wa.me/' + val : val;
                if (iconUrl) el.innerHTML = '<img src="' + iconUrl + '" style="width:20px;height:20px;object-fit:contain;">';
            });
        }
        if (s.facebook)  applySocial('facebook',  s.facebook,  s.fbIconUrl);
        if (s.instagram) applySocial('instagram', s.instagram, s.igIconUrl);
        if (s.youtube)   applySocial('youtube',   s.youtube,   s.ytIconUrl);
        if (s.whatsapp)  applySocial('whatsapp',  s.whatsapp,  s.waIconUrl);

        const isBookingOpen = (s.tourBookingsOpen !== undefined ? s.tourBookingsOpen : s.admissionsOpen) !== false;
        const banner = document.getElementById('bookingBanner');
        if (banner) banner.style.display = isBookingOpen ? '' : 'none';
        document.querySelectorAll('.booking-status').forEach(el => el.textContent = isBookingOpen ? '🟢 Tour Bookings OPEN' : '🔴 Tour Bookings CLOSED');

        if (s.maintenanceMode === true && !window.location.pathname.includes('/admin/')) {
            if (!document.getElementById('rrMaintOverlay')) {
                const ov = document.createElement('div');
                ov.id = 'rrMaintOverlay';
                ov.style.cssText = 'position:fixed;inset:0;background:linear-gradient(135deg,#1a237e,#3949ab);z-index:99999;display:flex;align-items:center;justify-content:center;flex-direction:column;color:#fff;text-align:center;padding:24px;font-family:Poppins,sans-serif;';
                ov.innerHTML = '<div style="font-size:4rem;margin-bottom:16px;">🔧</div>'
                    + '<h1 style="color:#fff;font-size:2rem;margin-bottom:12px;">' + s.siteName + '</h1>'
                    + '<h2 style="color:rgba(255,255,255,0.8);font-weight:500;margin-bottom:16px;">Website Under Maintenance</h2>'
                    + '<p style="opacity:0.75;max-width:400px;line-height:1.8;">We are updating the website. Please check back soon.</p>'
                    + (s.whatsapp ? '<a href="https://wa.me/' + s.whatsapp + '" style="margin-top:24px;background:#25d366;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:700;display:inline-block;">💬 WhatsApp Us</a>' : '');
                document.body.appendChild(ov);
            }
        } else {
            const ov2 = document.getElementById('rrMaintOverlay');
            if (ov2) ov2.remove();
        }

        if (s.googleMapUrl) {
            const mapEl = document.getElementById('googleMapFrame');
            if (mapEl) mapEl.src = s.googleMapUrl;
        }

        // Setup Form Fields if we are on the admin panel
        document.querySelectorAll('[data-setting]').forEach(el => {
            const key = el.dataset.setting;
            const val = s[key];
            if (val === undefined || val === null) return;
            if (el.type === 'checkbox') el.checked = (val === true || val === 'true');
            else el.value = val;
        });

        if (s.address) {
            document.querySelectorAll('.footer-address, .site-address, [data-address]').forEach(el => el.textContent = s.address);
        }

        const heroEl = document.getElementById('heroBannerSection');
        if (heroEl && s.heroBg) heroEl.style.backgroundImage = 'url("' + s.heroBg + '")';

        const hBadge = document.getElementById('heroBadgeText');
        if (hBadge && s.heroBadge) hBadge.textContent = s.heroBadge;

        const hTitle = document.getElementById('heroTitle');
        if (hTitle && s.heroTitle) hTitle.textContent = s.heroTitle;

        const hSub = document.getElementById('heroSubTitle');
        if (hSub && s.heroSubTitle) hSub.textContent = s.heroSubTitle;

        const hDesc = document.getElementById('heroDesc');
        if (hDesc && s.heroDesc) hDesc.textContent = s.heroDesc;

        const cta1 = document.getElementById('heroCTA1');
        if (cta1) {
            if (s.heroCTA1Text) cta1.textContent = s.heroCTA1Text;
            if (s.heroCTA1Link) cta1.href = s.heroCTA1Link;
        }
        const cta2 = document.getElementById('heroCTA2');
        if (cta2) {
            if (s.heroCTA2Text) cta2.textContent = s.heroCTA2Text;
            if (s.heroCTA2Link) cta2.href = s.heroCTA2Link;
        }
        
        // Also fire event to let scripts know the dom is updated
        document.dispatchEvent(new CustomEvent('rr_dom_updated', { detail: s }));

        // Auto-load pages data bridge if not already loaded on this page
        if (typeof window.initPages !== 'function' && !document.querySelector('script[src*="rr-pages-data.js"]')) {
            const script = document.createElement('script');
            script.src = basePath + 'rr-pages-data.js';
            document.head.appendChild(script);
        }
    }

    // Expose Functions
    window.rrSaveSettings = saveSettingsToAPI;
    window.rrGetSettings = () => window.rr_current_settings;
    window.saveSiteSettings = saveSettingsToAPI;
    window.getSiteSettings = () => window.rr_current_settings;

    // Initialization
    async function init() {
        window.rr_current_settings = await fetchSettingsFromAPI();
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => applySettings(window.rr_current_settings));
        } else {
            applySettings(window.rr_current_settings);
        }
    }
    
    // Start bridge
    window.rrBridgePromise = init();

})();
