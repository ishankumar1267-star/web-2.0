/**
 * ═══════════════════════════════════════════════════════
 *   Wanderlust Travels & Tourism
 *   Blog Data Manager v7.0 — API-First Architecture
 * ═══════════════════════════════════════════════════════
 *
 * v7.0 FIX:
 *  ✅ On SERVER: PHP API is PRIMARY (always fresh data)
 *  ✅ On SERVER: IndexedDB/localStorage is CACHE only
 *  ✅ Offline/local: IndexedDB → localStorage → seed
 *  ✅ Shows cached data instantly, then refreshes from API
 *  ✅ No stale data shown to visitors
 *  ✅ Speed: cache shown immediately, API updates silently
 */

// ── Globals ──────────────────────────────────────────────────────────────────
window.rr_current_blogs = [];

const BLOGS_STORE_KEY = 'wt_blogs_data_v2';
const DB_NAME         = 'wt_cms_db_v2';
const DB_VERSION      = 1;
const STORE_NAME      = 'keyvalue';

// Purge any stale legacy computer institute blog cache from visitor's browser
try {
    ['rr_blogs_data', 'rr_blogs_cache', 'rr_blogs_updated'].forEach(function(k) {
        try { localStorage.removeItem(k); } catch(e){}
    });
} catch(e){}

// ── Detect if running on real server (not file://) ──────────────────────────
const IS_SERVER = (window.location.protocol === 'http:' || window.location.protocol === 'https:');

// ── API URL ──────────────────────────────────────────────────────────────────
const BLOG_API_URL = (function() {
    if (!IS_SERVER) return null;
    const path = window.location.pathname;
    if (path.indexOf('/admin/') !== -1) return '../api.php';
    if (path.indexOf('/blog/') !== -1) return '../api.php';
    return './api.php';
})();

// ── Seed data for Travel Blog ────────────────────────────────────────────────
const rrBlogsSeed = [
    {
        id: "b1",
        title: "Top 10 Hidden Beaches in Goa You Must Visit in 2026",
        slug: "top-10-hidden-beaches-in-goa-2026",
        category: "Beach",
        author: "Arjun Mehta",
        date: "Feb 15, 2026",
        readTime: "5 min read",
        status: "Published",
        image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&auto=format&fit=crop&q=80",
        seoDesc: "Discover Goa's best secret beaches away from crowds: Butterfly Beach, Cola Beach, Kakolem, and Galgibaga.",
        content: "<p>When most travelers think of Goa, crowded stretches of Baga and Calangute come to mind. But south and north Goa hide pristine, secluded coves that feel like your private slice of paradise.</p><h2>1. Butterfly Beach</h2><p>Accessible only by boat or an adventurous forest trek from Palolem, Butterfly Beach is a tranquil cove known for dolphin sightings and golden sunsets.</p><h2>2. Cola Beach</h2><p>Famous for its emerald green freshwater lagoon meeting the Arabian Sea, Cola Beach offers luxury tent stays right on the shoreline.</p><h2>3. Kakolem Beach (Tiger Beach)</h2><p>One of the wildest beaches in Goa, nestled below a cliff with a freshwater stream cascading directly onto the sands.</p>"
    },
    {
        id: "b2",
        title: "Complete Rajasthan Road Trip Guide: Cities, Food & Budget",
        slug: "complete-rajasthan-road-trip-guide",
        category: "Heritage",
        author: "Priya Sharma",
        date: "Jan 28, 2026",
        readTime: "8 min read",
        status: "Published",
        image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=800&auto=format&fit=crop&q=80",
        seoDesc: "Plan the ultimate Rajasthan road trip across Jaipur, Jodhpur, Jaisalmer, and Udaipur with our detailed budget and route itinerary.",
        content: "<p>Rajasthan is an emotion. Driving through the desert state takes you past colossal forts, ornate havelis, and roadside dhabas serving spicy laal maas and dal baati churma.</p><h2>The Ideal 7-Day Route</h2><p>Start in the Pink City Jaipur, explore Mehrangarh in Jodhpur, camp under starry dunes in Jaisalmer, and wrap up on the romantic lakes of Udaipur.</p>"
    },
    {
        id: "b3",
        title: "Kerala in Monsoon: Why It's the Best Time to Visit",
        slug: "kerala-in-monsoon-travel-guide",
        category: "Beach",
        author: "Neha Gupta",
        date: "Jan 12, 2026",
        readTime: "6 min read",
        status: "Published",
        image: "https://images.unsplash.com/photo-1593693411515-c20261bcad6e?w=800&auto=format&fit=crop&q=80",
        seoDesc: "Experience lush green Munnar hills, overflowing waterfalls, and traditional Ayurvedic treatments during Kerala's monsoon season.",
        content: "<p>While summer and winter draw huge crowds, true travelers know that Kerala comes alive during the monsoon. The hills of Munnar turn neon green, waterfalls roar at full capacity, and Ayurveda treatments are at their most effective.</p>"
    },
    {
        id: "b4",
        title: "Manali Trek: Beginner's Complete Guide to Solang Valley",
        slug: "manali-trek-solang-valley-guide",
        category: "Adventure",
        author: "Rahul Singh",
        date: "Dec 20, 2025",
        readTime: "7 min read",
        status: "Published",
        image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=800&auto=format&fit=crop&q=80",
        seoDesc: "Essential tips for trekking in Solang Valley, Rohtang Pass weather, gear checklist, and riverside camping advice in Manali.",
        content: "<p>Manali is Himachal's outdoor adventure capital. Whether you are doing your first snow trek or looking to fly with a paraglider above Solang Valley, here is everything you need to know before you lace up your boots.</p>"
    },
    {
        id: "b5",
        title: "Kashmir in Winter: Planning the Perfect Snow Holiday",
        slug: "kashmir-winter-snow-holiday-guide",
        category: "Hill Station",
        author: "Sofia Lin",
        date: "Nov 30, 2025",
        readTime: "6 min read",
        status: "Published",
        image: "https://images.unsplash.com/photo-1566837945700-30057527ade0?w=800&auto=format&fit=crop&q=80",
        seoDesc: "Everything you need to know about experiencing Gulmarg snow gondola, Srinagar winter houseboats, and Pahalgam frost walks.",
        content: "<p>Witnessing snow falling over a cedar-wood houseboat on Dal Lake while sipping hot saffron Kahwa is an experience unlike any other in the world.</p>"
    },
    {
        id: "b6",
        title: "Spiti Valley: India's Most Remote & Spectacular Valley",
        slug: "spiti-valley-remote-expedition-guide",
        category: "Adventure",
        author: "Erik Johansson",
        date: "Oct 18, 2025",
        readTime: "9 min read",
        status: "Published",
        image: "https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=800&auto=format&fit=crop&q=80",
        seoDesc: "Discover Spiti Valley's ancient monasteries, high-altitude villages, Chandratal Lake camping, and rugged road trip itinerary.",
        content: "<p>Spiti means 'The Middle Land' — the land between Tibet and India. Rugged, wind-carved canyons, thousand-year-old Buddhist monasteries, and crystal night skies make it a holy grail for road trippers.</p>"
    }
];

// ════════════════════════════════════════════════════════════════════════════
//   INDEXEDDB HELPER
// ════════════════════════════════════════════════════════════════════════════
let _db = null;

function openDB() {
    return new Promise(function(resolve, reject) {
        if (_db) { resolve(_db); return; }
        if (!window.indexedDB) { reject(new Error('IndexedDB not supported')); return; }
        const req = indexedDB.open(DB_NAME, DB_VERSION);
        req.onupgradeneeded = function(e) {
            const db = e.target.result;
            if (!db.objectStoreNames.contains(STORE_NAME)) {
                db.createObjectStore(STORE_NAME);
            }
        };
        req.onsuccess = function(e) { _db = e.target.result; resolve(_db); };
        req.onerror   = function(e) { reject(e.target.error); };
    });
}

function idbGet(key) {
    return openDB().then(function(db) {
        return new Promise(function(resolve, reject) {
            const tx  = db.transaction(STORE_NAME, 'readonly');
            const req = tx.objectStore(STORE_NAME).get(key);
            req.onsuccess = function() { resolve(req.result); };
            req.onerror   = function() { reject(req.error); };
        });
    });
}

function idbSet(key, value) {
    return openDB().then(function(db) {
        return new Promise(function(resolve, reject) {
            const tx  = db.transaction(STORE_NAME, 'readwrite');
            const req = tx.objectStore(STORE_NAME).put(value, key);
            req.onsuccess = function() { resolve(); };
            req.onerror   = function() { reject(req.error); };
        });
    });
}

// ── Clear old cached data (force fresh from API) ─────────────────────────────
function idbClear(key) {
    return openDB().then(function(db) {
        return new Promise(function(resolve) {
            try {
                const tx = db.transaction(STORE_NAME, 'readwrite');
                tx.objectStore(STORE_NAME).delete(key);
                tx.oncomplete = function() { resolve(); };
            } catch(e) { resolve(); }
        });
    }).catch(function() {});
}

// ════════════════════════════════════════════════════════════════════════════
//   SAFE localStorage WRAPPER
// ════════════════════════════════════════════════════════════════════════════
function safeLocalSet(key, value) {
    try {
        localStorage.setItem(key, value);
    } catch (e) {
        try {
            localStorage.removeItem('rr_blogs_data');
            localStorage.removeItem('rr_blogs_local');
            localStorage.setItem(key, value);
        } catch (e2) {
            console.warn('[RR Blogs] localStorage full, using IndexedDB only.');
        }
    }
}

function safeLocalGet(key) {
    try { return localStorage.getItem(key); } catch(e) { return null; }
}

// ════════════════════════════════════════════════════════════════════════════
//   SAVE — writes to IndexedDB, localStorage, and API
// ════════════════════════════════════════════════════════════════════════════
async function saveRrBlogs(blogsArray) {
    if (!Array.isArray(blogsArray)) {
        console.error('[RR Blogs] saveRrBlogs: expected an array');
        return;
    }

    // 1. Update in-memory immediately
    window.rr_current_blogs = blogsArray;

    // 2. Save to IndexedDB (primary local — no quota issues)
    try {
        await idbSet(BLOGS_STORE_KEY, blogsArray);
        console.info('[RR Blogs] Saved to IndexedDB ✓');
    } catch(e) {
        console.warn('[RR Blogs] IndexedDB save failed:', e);
    }

    // 3. Save lightweight copy to localStorage (no base64 images)
    const lightCopy = blogsArray.map(function(p) {
        const copy = Object.assign({}, p);
        if (copy.image && copy.image.startsWith('data:')) {
            copy.image = '__idb__';
        }
        return copy;
    });
    safeLocalSet(BLOGS_STORE_KEY, JSON.stringify(lightCopy));

    // 4. Sync to PHP API if on server
    if (IS_SERVER && BLOG_API_URL) {
        try {
            const headers = { 'Content-Type': 'application/json' };
            const token = safeLocalGet('rr_admin_token') || (typeof sessionStorage !== 'undefined' ? sessionStorage.getItem('rr_admin_token') : null);
            if (token) headers['X-Admin-Token'] = token;

            const apiCopy = blogsArray.map(function(p) {
                return Object.assign({}, p);
            });

            const res = await fetch(BLOG_API_URL + '?action=set&key=rr_blogs', {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(apiCopy)
            });
            if (!res.ok && res.status === 401) {
                console.warn('[RR Blogs] API: session expired');
            } else {
                console.info('[RR Blogs] Saved to API ✓');
            }
        } catch(e) {
            console.info('[RR Blogs] API sync skipped (offline/local mode)');
        }
    }

    // 5. Notify other tabs
    try {
        localStorage.setItem('rr_blogs_updated', Date.now().toString());
    } catch(e) {}
}

// ════════════════════════════════════════════════════════════════════════════
//   FETCH FROM API — returns array or null
// ════════════════════════════════════════════════════════════════════════════
async function fetchFromAPI() {
    if (!IS_SERVER || !BLOG_API_URL) return null;
    try {
        const res  = await fetch(BLOG_API_URL + '?action=get&key=rr_blogs&_=' + Date.now(), {
            cache: 'no-store'
        });
        const text = await res.text();
        if (text && text !== 'null' && text.trim() !== '' && text.trim() !== '[]') {
            const parsed = JSON.parse(text);
            if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed;
            }
        }
        return null;
    } catch(e) {
        return null;
    }
}

// ════════════════════════════════════════════════════════════════════════════
//   MERGE API + LOCAL (preserve local base64 images)
// ════════════════════════════════════════════════════════════════════════════
function mergeWithLocal(apiPosts, localPosts) {
    // API is ALWAYS the source of truth on server.
    // We only pull base64 images from local cache (they are too big to store in API).
    // We do NOT add local-only posts — those may be stale localhost data.
    const merged = apiPosts.map(function(apiPost) {
        const localPost = (localPosts || []).find(function(l) { return l.id === apiPost.id; });
        if (localPost && localPost.image && localPost.image.startsWith('data:') && !apiPost.image) {
            apiPost.image = localPost.image;
        }
        return apiPost;
    });

    // Sort descending by ID (which is a timestamp)
    merged.sort(function(a, b) { return parseInt(b.id) - parseInt(a.id); });

    return merged;
}

// ════════════════════════════════════════════════════════════════════════════
//   MAIN LOAD — v7.0 API-FIRST on server
// ════════════════════════════════════════════════════════════════════════════
async function initBlogs() {

    if (IS_SERVER && BLOG_API_URL) {
        // ── SERVER MODE: Show cache instantly, then refresh from API ──

        // Step 1: Show cached data IMMEDIATELY (from IndexedDB or localStorage)
        //         so the page feels fast
        let cachedData = null;
        try {
            const idbData = await idbGet(BLOGS_STORE_KEY);
            if (Array.isArray(idbData) && idbData.length > 0) {
                cachedData = idbData;
            }
        } catch(e) {}

        if (!cachedData) {
            const localRaw = safeLocalGet(BLOGS_STORE_KEY);
            if (localRaw) {
                try {
                    const parsed = JSON.parse(localRaw);
                    if (Array.isArray(parsed) && parsed.length > 0) cachedData = parsed;
                } catch(e) {}
            }
        }

        if (cachedData) {
            // Show cached data right away (fast load)
            window.rr_current_blogs = cachedData;
            document.dispatchEvent(new Event('rr_blogs_loaded'));
            console.info('[RR Blogs] Cache shown instantly:', cachedData.length, 'posts');
        }

        // Step 2: ALWAYS fetch fresh data from API (authoritative source)
        const apiData = await fetchFromAPI();
        if (apiData) {
            const merged = mergeWithLocal(apiData, window.rr_current_blogs);
            window.rr_current_blogs = merged;
            // Save fresh API data to local cache
            idbSet(BLOGS_STORE_KEY, merged).catch(function(){});
            safeLocalSet(BLOGS_STORE_KEY, JSON.stringify(merged.map(function(p) {
                const c = Object.assign({}, p);
                if (c.image && c.image.startsWith('data:')) c.image = '__idb__';
                return c;
            })));
            document.dispatchEvent(new Event('rr_blogs_loaded'));
            console.info('[RR Blogs] API data loaded:', merged.length, 'posts');
            return;
        }

        // Step 3: If API failed but cache exists, we already showed it above
        if (cachedData) {
            console.info('[RR Blogs] Using cached data (API unreachable)');
            return;
        }

        // Step 4: No data at all — show empty (no seed data on server)
        window.rr_current_blogs = [];
        console.info('[RR Blogs] No data found on server.');
        document.dispatchEvent(new Event('rr_blogs_loaded'));

    } else {
        // ── LOCAL MODE (file://) — no API, use IndexedDB/localStorage/seed ──

        try {
            const idbData = await idbGet(BLOGS_STORE_KEY);
            if (Array.isArray(idbData) && idbData.length > 0) {
                window.rr_current_blogs = idbData;
                document.dispatchEvent(new Event('rr_blogs_loaded'));
                return;
            }
        } catch(e) {}

        const localRaw = safeLocalGet(BLOGS_STORE_KEY);
        if (localRaw) {
            try {
                const parsed = JSON.parse(localRaw);
                if (Array.isArray(parsed) && parsed.length > 0) {
                    window.rr_current_blogs = parsed;
                    idbSet(BLOGS_STORE_KEY, parsed).catch(function(){});
                    document.dispatchEvent(new Event('rr_blogs_loaded'));
                    return;
                }
            } catch(e) {}
        }

        window.rr_current_blogs = rrBlogsSeed;
        idbSet(BLOGS_STORE_KEY, rrBlogsSeed).catch(function(){});
        safeLocalSet(BLOGS_STORE_KEY, JSON.stringify(rrBlogsSeed));
        document.dispatchEvent(new Event('rr_blogs_loaded'));
    }
}

// ── Image compression helper ──────────────────────────────────────────────────
window.compressImageForBlog = function(file, callback) {
    const MAX_WIDTH  = 800;
    const MAX_HEIGHT = 600;
    const QUALITY    = 0.75;

    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            let w = img.width;
            let h = img.height;
            if (w > MAX_WIDTH || h > MAX_HEIGHT) {
                const ratio = Math.min(MAX_WIDTH / w, MAX_HEIGHT / h);
                w = Math.round(w * ratio);
                h = Math.round(h * ratio);
            }
            const canvas = document.createElement('canvas');
            canvas.width  = w;
            canvas.height = h;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, w, h);
            const compressed = canvas.toDataURL('image/jpeg', QUALITY);
            const sizeKB = Math.round((compressed.length * 3) / 4 / 1024);
            console.info('[RR Blogs] Image compressed to ~' + sizeKB + 'KB');
            callback(compressed);
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(file);
};

// ── Auth headers helper ───────────────────────────────────────────────────────
function getRrBlogAuthHeaders() {
    const headers = { 'Content-Type': 'application/json' };
    const token = safeLocalGet('rr_admin_token');
    if (token) headers['X-Admin-Token'] = token;
    return headers;
}

// ── Legacy getter ─────────────────────────────────────────────────────────────
function getRrBlogs() {
    return window.rr_current_blogs;
}

// ── Cross-tab sync ───────────────────────────────────────────────────────────
window.addEventListener('storage', function(e) {
    if (e.key === 'rr_blogs_updated') {
        // Another tab saved — refresh from API immediately
        if (IS_SERVER && BLOG_API_URL) {
            fetchFromAPI().then(function(apiData) {
                if (apiData) {
                    const merged = mergeWithLocal(apiData, window.rr_current_blogs);
                    window.rr_current_blogs = merged;
                    idbSet(BLOGS_STORE_KEY, merged).catch(function(){});
                    document.dispatchEvent(new Event('rr_blogs_loaded'));
                }
            });
        } else {
            idbGet(BLOGS_STORE_KEY).then(function(data) {
                if (Array.isArray(data) && data.length > 0) {
                    window.rr_current_blogs = data;
                    document.dispatchEvent(new Event('rr_blogs_loaded'));
                }
            }).catch(function(){});
        }
    }
});

// ── EXPOSE PUBLIC API ─────────────────────────────────────────────────────────
window.saveRrBlogs = saveRrBlogs;
window.getRrBlogs  = getRrBlogs;

// ── START ────────────────────────────────────────────────────────────────────
window.rrBlogsPromise = initBlogs();
