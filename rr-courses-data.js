const rrCoursesSeed = [
    {
        id: "c1",
        category: "beach",
        icon: "umbrella",
        tag: "BEST SELLER",
        title: "Goa Beach Holiday",
        subtitle: "4 Nights / 5 Days Beach Paradise",
        desc: "Relax on golden sands of Calangute and Baga, experience thrilling water sports, sunset cruises on Mandovi river, and vibrant beach shacks.",
        duration: "4 Nights / 5 Days",
        eligibility: "All Travelers",
        subjects: "Beach Resort, Watersports, Island Cruise, Nightlife Tour",
        certification: "IATA Certified Tour Package",
        feeBadge: "₹12,999 / person",
        gradient: "linear-gradient(135deg, var(--color-primary), var(--color-primary-light))",
        color: "var(--color-primary)",
        colorLabel: "Blue",
        image: "https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=600&auto=format&fit=crop&q=80"
    },
    {
        id: "c2",
        category: "heritage",
        icon: "landmark",
        tag: "HERITAGE",
        title: "Rajasthan Royal Heritage",
        subtitle: "6 Nights / 7 Days Forts & Palaces",
        desc: "Explore royal forts of Jaipur, blue streets of Jodhpur, desert safari in Jaisalmer, and romantic lakes of Udaipur with authentic Rajasthani dining.",
        duration: "6 Nights / 7 Days",
        eligibility: "All Travelers",
        subjects: "Jaipur, Jodhpur, Jaisalmer, Udaipur, Desert Camp",
        certification: "IATA Certified Tour Package",
        feeBadge: "₹15,999 / person",
        gradient: "linear-gradient(135deg, #4a0080, #7b1fa2)",
        color: "#7b1fa2",
        colorLabel: "Purple",
        image: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?w=600&auto=format&fit=crop&q=80"
    },
    {
        id: "c3",
        category: "beach",
        icon: "anchor",
        tag: "HONEYMOON",
        title: "Kerala Backwaters & Hills",
        subtitle: "5 Nights / 6 Days God's Own Country",
        desc: "Munnar tea gardens, houseboat cruise in Alleppey backwaters, and Kovalam beaches. Includes authentic Kerala Ayurveda rejuvenation experience.",
        duration: "5 Nights / 6 Days",
        eligibility: "Couples & Families",
        subjects: "Munnar, Alleppey Houseboat, Thekkady, Kovalam",
        certification: "IATA Certified Tour Package",
        feeBadge: "₹18,499 / person",
        gradient: "linear-gradient(135deg, var(--color-secondary), #00695c)",
        color: "var(--color-secondary)",
        colorLabel: "Teal",
        image: "https://images.unsplash.com/photo-1593693411515-c20261bcad6e?w=600&auto=format&fit=crop&q=80"
    },
    {
        id: "c4",
        category: "adventure",
        icon: "mountain",
        tag: "ADVENTURE",
        title: "Manali Snow Trek & Solang",
        subtitle: "3 Nights / 4 Days Himalayan Thrills",
        desc: "Experience snow sports at Solang Valley, Rohtang Pass expedition, river rafting in Beas, riverside camp stay, and Old Manali cafe trails.",
        duration: "3 Nights / 4 Days",
        eligibility: "Adventure Lovers",
        subjects: "Solang Valley, Rohtang, Paragliding, River Rafting",
        certification: "IATA Certified Tour Package",
        feeBadge: "₹9,999 / person",
        gradient: "linear-gradient(135deg, var(--color-pink), #c2185b)",
        color: "var(--color-pink)",
        colorLabel: "Pink",
        image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?w=600&auto=format&fit=crop&q=80"
    },
    {
        id: "c5",
        category: "hills",
        icon: "cloud-snow",
        tag: "POPULAR",
        title: "Kashmir Paradise Explorer",
        subtitle: "6 Nights / 7 Days Heaven on Earth",
        desc: "Dal Lake houseboat stay in Srinagar, Gondola cable car ride in Gulmarg, lush valleys of Pahalgam, and Sonmarg glaciers with local shikara ride.",
        duration: "6 Nights / 7 Days",
        eligibility: "All Travelers",
        subjects: "Srinagar, Gulmarg, Pahalgam, Sonmarg, Dal Lake",
        certification: "IATA Certified Tour Package",
        feeBadge: "₹22,999 / person",
        gradient: "linear-gradient(135deg, #1565c0, #1976d2)",
        color: "#1565c0",
        colorLabel: "Blue",
        image: "https://images.unsplash.com/photo-1566837945700-30057527ade0?w=600&auto=format&fit=crop&q=80"
    },
    {
        id: "c6",
        category: "adventure",
        icon: "compass",
        tag: "OFFBEAT",
        title: "Spiti Valley Expedition",
        subtitle: "7 Nights / 8 Days High Altitude Circuit",
        desc: "Venture into remote trans-Himalayan desert: Kaza, Key Monastery, highest post office at Hikkim, Langza fossils, and camping at Chandratal Lake.",
        duration: "7 Nights / 8 Days",
        eligibility: "Adventure Seekers",
        subjects: "Kaza, Key Monastery, Chandratal, 4x4 Expedition",
        certification: "IATA Certified Tour Package",
        feeBadge: "₹13,499 / person",
        gradient: "linear-gradient(135deg, var(--color-accent), #e65100)",
        color: "var(--color-accent)",
        colorLabel: "Orange",
        image: "https://images.unsplash.com/photo-1598091383021-15ddea10925d?w=600&auto=format&fit=crop&q=80"
    },
    {
        id: "c7",
        category: "international",
        icon: "plane",
        tag: "INTERNATIONAL",
        title: "Thailand Delight Tour",
        subtitle: "5 Nights / 6 Days Bangkok & Pattaya",
        desc: "Coral Island speedboat tour, Bangkok grand palace, floating markets, Alcazar show, and exotic street shopping with private transfers.",
        duration: "5 Nights / 6 Days",
        eligibility: "Passport Required",
        subjects: "Bangkok, Pattaya, Coral Island, Temple Tours",
        certification: "IATA Certified Tour Package",
        feeBadge: "₹35,999 / person",
        gradient: "linear-gradient(135deg, #2e7d32, #388e3c)",
        color: "#2e7d32",
        colorLabel: "Green",
        image: "https://images.unsplash.com/photo-1508009603885-50cf7c579365?w=600&auto=format&fit=crop&q=80"
    },
    {
        id: "c8",
        category: "international",
        icon: "sun",
        tag: "LUXURY",
        title: "Bali Dream Vacation",
        subtitle: "6 Nights / 7 Days Island of the Gods",
        desc: "Ubud rice terraces, Sacred Monkey Forest, Tanah Lot sunset temple, Nusa Penida island speedboat trip, and private villa with pool.",
        duration: "6 Nights / 7 Days",
        eligibility: "Passport Required",
        subjects: "Ubud, Seminyak, Nusa Penida, Tanah Lot, Spa",
        certification: "IATA Certified Tour Package",
        feeBadge: "₹42,999 / person",
        gradient: "linear-gradient(135deg, #f57f17, #f9a825)",
        color: "#f57f17",
        colorLabel: "Orange",
        image: "https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=600&auto=format&fit=crop&q=80"
    }
];

window.rr_current_courses = rrCoursesSeed;
const API_URL = (window.location.pathname.includes('/admin/') ? '../' : './') + 'api.php';

function getRrAuthHeaders() {
    const headers = { 'Content-Type': 'application/json' };
    const token = localStorage.getItem('rr_admin_token') || sessionStorage.getItem('rr_admin_token');
    if (token) headers['X-Admin-Token'] = token;
    return headers;
}

async function initCourses() {
    try {
        const res = await fetch(API_URL + '?action=get&key=rr_courses');
        const text = await res.text();
        if (text && text !== 'null') {
            window.rr_current_courses = JSON.parse(text);
        } else {
            const token = localStorage.getItem('rr_admin_token') || sessionStorage.getItem('rr_admin_token');
            if (token) {
                await fetch(API_URL + '?action=set&key=rr_courses', {
                    method: 'POST',
                    headers: getRrAuthHeaders(),
                    body: JSON.stringify(rrCoursesSeed)
                });
            }
        }
    } catch (e) {
        console.error('Failed to load courses from API, using fallback', e);
    }
    document.dispatchEvent(new Event('rr_courses_loaded'));
}

async function saveRrCourses(coursesArray) {
    try {
        const res = await fetch(API_URL + '?action=set&key=rr_courses', {
            method: 'POST',
            headers: getRrAuthHeaders(),
            body: JSON.stringify(coursesArray)
        });
        if (!res.ok) {
            if (res.status === 401) {
                alert('Session expired or unauthorized. Please login again in Admin Panel.');
            }
            throw new Error('Failed to save courses: ' + res.statusText);
        }
        window.rr_current_courses = coursesArray;
    } catch (e) {
        console.error('Failed to save courses to API', e);
        throw e;
    }
}

window.rrCoursesPromise = initCourses();

function getRrCourses() {
    return window.rr_current_courses;
}
