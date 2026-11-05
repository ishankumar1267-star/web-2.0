/**
 * Wanderlust Travels & Tourism
 * Tour Bookings & Travelers Seed Data
 */
const rrStudentsSeed = [
    {
        id: '1',
        name: 'Rahul Sharma',
        email: 'rahul.travel@gmail.com',
        phone: '+91 98765 12345',
        course: 'Goa Beach Paradise (5D/4N)',
        batch: '15 Nov 2026 – 20 Nov 2026',
        bookingDate: '01 Oct 2026',
        feeStatus: 'Deposit Paid (₹12,999)',
        status: 'Confirmed',
        image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
    },
    {
        id: '2',
        name: 'Priya Negi',
        email: 'priya.wanderer@gmail.com',
        phone: '+91 98765 23456',
        course: 'Kerala Backwaters & Houseboat (6D/5N)',
        batch: '10 Dec 2026 – 16 Dec 2026',
        bookingDate: '05 Oct 2026',
        feeStatus: 'Full Payment (₹19,999)',
        status: 'Confirmed',
        image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&auto=format&fit=crop&q=80'
    },
    {
        id: '3',
        name: 'Amit & Sneha Kumar',
        email: 'amit.kumar@yahoo.com',
        phone: '+91 98765 34567',
        course: 'Manali & Rohtang Pass Adventure (5D/4N)',
        batch: '22 Dec 2026 – 27 Dec 2026',
        bookingDate: '10 Oct 2026',
        feeStatus: 'Advance Deposit (₹15,499)',
        status: 'Confirmed',
        image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80'
    },
    {
        id: '4',
        name: 'Vikramaditya Rathore',
        email: 'vikram.rathore@outlook.com',
        phone: '+91 98765 45678',
        course: 'Rajasthan Royal Heritage (7D/6N)',
        batch: '05 Jan 2027 – 12 Jan 2027',
        bookingDate: '12 Oct 2026',
        feeStatus: 'Full Payment (₹24,999)',
        status: 'Confirmed',
        image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80'
    },
    {
        id: '5',
        name: 'Ananya Deshmukh',
        email: 'ananya.d@gmail.com',
        phone: '+91 98765 56789',
        course: 'Kashmir Paradise Valley Tour (6D/5N)',
        batch: '18 Jan 2027 – 24 Jan 2027',
        bookingDate: '15 Oct 2026',
        feeStatus: 'Advance Deposit (₹21,999)',
        status: 'Pending Voucher',
        image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80'
    },
    {
        id: '6',
        name: 'Rohan Mehra & Friends',
        email: 'rohan.mehra@gmail.com',
        phone: '+91 98765 67890',
        course: 'Ladakh High Passes Road Trip (8D/7N)',
        batch: '01 Feb 2027 – 09 Feb 2027',
        bookingDate: '18 Oct 2026',
        feeStatus: 'Deposit Paid (₹28,999)',
        status: 'Confirmed',
        image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80'
    }
];

if (typeof window !== 'undefined') {
    window.rrStudentsSeed = rrStudentsSeed;
    window.wtBookingsSeed = rrStudentsSeed;
}
