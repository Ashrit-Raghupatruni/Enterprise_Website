/**
 * admin-mock-data.js — Mock Data Store for the Admin Panel Frontend Blueprint.
 * Mirrors database entities and existing frontend data structures.
 */

const adminMockData = {
  stats: {
    totalProducts: 128,
    registeredUsers: 542,
    totalOrders: 36,
    totalRevenue: '₹18,45,900',
    activeBanners: 5,
    lowStockCount: 7,
    pendingOrdersCount: 5,
    deliveredOrdersCount: 24,
    revenueGrowth: '+14.8%',
    ordersGrowth: '+22.5%',
    usersGrowth: '+8.3%'
  },

  banners: [
    {
      id: 'BNR-001',
      title: 'Latest Flagship Smartphones',
      eyebrow: 'New Arrivals 2025',
      subtitle: 'Premium flagship phones from Apple, Samsung & OnePlus with official warranty and 0% EMI.',
      ctaText: 'Explore Products',
      slug: 'mobiles',
      badge: 'Up to ₹5,000 Off',
      status: 'Active',
      bgGradient: 'linear-gradient(135deg, #0d1e4d 0%, #1e3d8f 60%, #2f52a0 100%)',
      accentColor: '#f58500',
      icon: 'smartphone',
      displayOrder: 1,
      clicks: 1420
    },
    {
      id: 'BNR-002',
      title: 'Big Festival Electronics Sale',
      eyebrow: 'Festival Season Offers',
      subtitle: 'Unbeatable prices on 4K TVs, ACs, and Multi-door Refrigerators. Limited time festive offer.',
      ctaText: 'Shop Offers',
      slug: 'tvs',
      badge: '20% Off Selected Items',
      status: 'Active',
      bgGradient: 'linear-gradient(135deg, #1a0a00 0%, #6b2d00 55%, #b85e00 100%)',
      accentColor: '#f58500',
      icon: 'festival',
      displayOrder: 2,
      clicks: 980
    },
    {
      id: 'BNR-003',
      title: 'Zero Percent Interest EMI Deals',
      eyebrow: 'Zero Cost EMI',
      subtitle: 'Buy now, pay later with instant approvals via Bajaj Finserv and TVS Credit.',
      ctaText: 'Know Eligibility',
      slug: 'mobiles',
      badge: 'Zero Down Payment',
      status: 'Active',
      bgGradient: 'linear-gradient(135deg, #0a2218 0%, #0d4a2e 55%, #166534 100%)',
      accentColor: '#22c55e',
      icon: 'emi',
      displayOrder: 3,
      clicks: 856
    },
    {
      id: 'BNR-004',
      title: 'Exchange Old Devices for Best Value',
      eyebrow: 'Exchange & Upgrade',
      subtitle: 'Get top resale valuations for your previous phone or laptop towards new purchases.',
      ctaText: 'Get Exchange Value',
      slug: 'mobiles',
      badge: 'Best Exchange Rates',
      status: 'Active',
      bgGradient: 'linear-gradient(135deg, #1a0d2e 0%, #3b1f6b 55%, #5a2ea0 100%)',
      accentColor: '#a78bfa',
      icon: 'exchange',
      displayOrder: 4,
      clicks: 640
    },
    {
      id: 'BNR-005',
      title: '100% Genuine Brand Warranty Store',
      eyebrow: 'Official Warranty',
      subtitle: 'Every product comes backed with authorized brand warranty and local service support.',
      ctaText: 'Shop Now',
      slug: 'all',
      badge: '100% Official Warranty',
      status: 'Active',
      bgGradient: 'linear-gradient(135deg, #0f1a30 0%, #1e3560 55%, #2952a0 100%)',
      accentColor: '#60a5fa',
      icon: 'warranty',
      displayOrder: 5,
      clicks: 430
    },
    {
      id: 'BNR-006',
      title: 'Monsoon Home Appliance Clearance',
      eyebrow: 'Seasonal Deals',
      subtitle: 'Exclusive discounts on smart Inverter ACs and washing machines.',
      ctaText: 'View Deals',
      slug: 'acs',
      badge: 'Flat 15% Cashback',
      status: 'Inactive',
      bgGradient: 'linear-gradient(135deg, #1e293b 0%, #334155 60%, #475569 100%)',
      accentColor: '#38bdf8',
      icon: 'appliance',
      displayOrder: 6,
      clicks: 120
    }
  ],

  products: [
    {
      id: 'PRD-101',
      name: 'Samsung Galaxy S25 Ultra 5G',
      category: 'Mobiles',
      categorySlug: 'mobiles',
      brand: 'Samsung',
      price: 134999,
      originalPrice: 144999,
      stock: 18,
      minStockThreshold: 5,
      status: 'In Stock',
      availability: 'AVAILABLE',
      slug: 'samsung-galaxy-s25-ultra',
      rating: 4.9,
      imageSvg: 'mobile-s25',
      description: 'Dynamic AMOLED 2X 120Hz display with Snapdragon 8 Elite and Titanium frame build.'
    },
    {
      id: 'PRD-102',
      name: 'Apple iPhone 16 Pro Max 256GB',
      category: 'Mobiles',
      categorySlug: 'mobiles',
      brand: 'Apple',
      price: 159900,
      originalPrice: 169900,
      stock: 4,
      minStockThreshold: 5,
      status: 'Low Stock',
      availability: 'AVAILABLE',
      slug: 'apple-iphone-16-pro-max',
      rating: 4.9,
      imageSvg: 'mobile-iphone',
      description: 'A18 Pro chip, Grade 5 Titanium chassis, 48MP Fusion camera system with 5x optical zoom.'
    },
    {
      id: 'PRD-103',
      name: 'Samsung Neo QLED 8K 75" Smart TV',
      category: 'TVs',
      categorySlug: 'tvs',
      brand: 'Samsung',
      price: 299999,
      originalPrice: 349999,
      stock: 2,
      minStockThreshold: 3,
      status: 'Low Stock',
      availability: 'AVAILABLE',
      slug: 'samsung-neo-qled-8k-75',
      rating: 4.8,
      imageSvg: 'tv-samsung',
      description: 'Neo Quantum Processor 8K with AI upscaling, Mini LED backlights, and Dolby Atmos sound.'
    },
    {
      id: 'PRD-104',
      name: 'LG OLED C3 65" 4K Smart Cinema TV',
      category: 'TVs',
      categorySlug: 'tvs',
      brand: 'LG',
      price: 159990,
      originalPrice: 189990,
      stock: 9,
      minStockThreshold: 3,
      status: 'In Stock',
      availability: 'AVAILABLE',
      slug: 'lg-oled-c3-65',
      rating: 4.8,
      imageSvg: 'tv-lg',
      description: 'Self-lit OLED pixels with α9 AI Gen6 processor, Dolby Vision & Atmos support.'
    },
    {
      id: 'PRD-105',
      name: 'Daikin 1.5 Ton 5★ Inverter Split AC',
      category: 'Air Conditioners',
      categorySlug: 'acs',
      brand: 'Daikin',
      price: 44990,
      originalPrice: 52990,
      stock: 14,
      minStockThreshold: 4,
      status: 'In Stock',
      availability: 'AVAILABLE',
      slug: 'daikin-1-5t-5-star-ac',
      rating: 4.7,
      imageSvg: 'ac-daikin',
      description: 'Streamer Technology PM2.5 filtration, 5-Star power rating, copper condenser.'
    },
    {
      id: 'PRD-106',
      name: 'Bosch 559L Multi Door Frost-Free Refrigerator',
      category: 'Refrigerators',
      categorySlug: 'refrigerators',
      brand: 'Bosch',
      price: 79990,
      originalPrice: 94990,
      stock: 0,
      minStockThreshold: 2,
      status: 'Out of Stock',
      availability: 'NOT_AVAILABLE',
      slug: 'bosch-559l-multi-door-fridge',
      rating: 4.6,
      imageSvg: 'fridge-bosch',
      description: 'VarioInverter technology with VitaFresh Plus dual climate drawers and stainless steel finish.'
    },
    {
      id: 'PRD-107',
      name: 'Sony HT-A7000 7.1.2ch Dolby Atmos Soundbar',
      category: 'Home Theatres',
      categorySlug: 'home-theatres',
      brand: 'Sony',
      price: 89990,
      originalPrice: 104990,
      stock: 6,
      minStockThreshold: 2,
      status: 'In Stock',
      availability: 'AVAILABLE',
      slug: 'sony-ht-a7000-soundbar',
      rating: 4.7,
      imageSvg: 'soundbar-sony',
      description: '360 Spatial Sound Mapping with dual built-in subwoofers and Hi-Res audio playback.'
    },
    {
      id: 'PRD-108',
      name: 'OnePlus 12 5G (16GB RAM / 512GB)',
      category: 'Mobiles',
      categorySlug: 'mobiles',
      brand: 'OnePlus',
      price: 69999,
      originalPrice: 74999,
      stock: 22,
      minStockThreshold: 5,
      status: 'In Stock',
      availability: 'AVAILABLE',
      slug: 'oneplus-12-5g',
      rating: 4.8,
      imageSvg: 'mobile-oneplus',
      description: '4th Gen Hasselblad camera for mobile with 100W SUPERVOOC charging and 2K ProXDR display.'
    }
  ],

  categories: [
    { id: 'cat-mobiles', name: 'Mobiles', slug: 'mobiles', count: 42 },
    { id: 'cat-tvs', name: 'TVs', slug: 'tvs', count: 28 },
    { id: 'cat-acs', name: 'Air Conditioners', slug: 'acs', count: 19 },
    { id: 'cat-refrigerators', name: 'Refrigerators', slug: 'refrigerators', count: 16 },
    { id: 'cat-home-theatres', name: 'Home Theatres', slug: 'home-theatres', count: 12 },
    { id: 'cat-kitchen', name: 'Kitchen Appliances', slug: 'kitchen', count: 11 }
  ],

  users: [
    {
      id: 'USR-1001',
      name: 'Rahul Sharma',
      email: 'rahul.sharma@example.com',
      phone: '+91 98765 43210',
      role: 'USER',
      gender: 'Male',
      joinedDate: '14 Jan 2024',
      status: 'Active',
      ordersCount: 4,
      totalSpent: '₹2,94,989',
      addressCount: 2,
      addresses: [
        {
          id: 'ADDR-1',
          name: 'Rahul Sharma (Home)',
          line1: 'Flat 402, Sai Residency, Road No. 12',
          city: 'Banjara Hills, Hyderabad',
          state: 'Telangana',
          pincode: '500034',
          isDefault: true
        }
      ]
    },
    {
      id: 'USR-1002',
      name: 'Priya Patel',
      email: 'priya.patel@example.com',
      phone: '+91 98234 56789',
      role: 'USER',
      gender: 'Female',
      joinedDate: '22 Mar 2024',
      status: 'Active',
      ordersCount: 3,
      totalSpent: '₹1,59,990',
      addressCount: 1,
      addresses: [
        {
          id: 'ADDR-2',
          name: 'Priya Patel (Work)',
          line1: 'Tower B, Tech Park, Gachibowli',
          city: 'Hyderabad',
          state: 'Telangana',
          pincode: '500081',
          isDefault: true
        }
      ]
    },
    {
      id: 'USR-1003',
      name: 'Kishor Gunithi',
      email: 'admin@enterprisestore.com',
      phone: '+91 99636 57799',
      role: 'ADMIN',
      gender: 'Male',
      joinedDate: '01 Jan 2024',
      status: 'Active',
      ordersCount: 12,
      totalSpent: '₹6,40,000',
      addressCount: 1,
      addresses: [
        {
          id: 'ADDR-3',
          name: 'Kishor Enterprises HQ',
          line1: 'Main Road, Commercial Complex',
          city: 'Hyderabad',
          state: 'Telangana',
          pincode: '500001',
          isDefault: true
        }
      ]
    },
    {
      id: 'USR-1004',
      name: 'Ananya Verma',
      email: 'ananya.v@example.com',
      phone: '+91 97112 34567',
      role: 'USER',
      gender: 'Female',
      joinedDate: '05 May 2024',
      status: 'Active',
      ordersCount: 1,
      totalSpent: '₹44,990',
      addressCount: 1,
      addresses: [
        {
          id: 'ADDR-4',
          name: 'Ananya Verma',
          line1: 'B-14, Green Meadows, Whitefield',
          city: 'Bengaluru',
          state: 'Karnataka',
          pincode: '560066',
          isDefault: true
        }
      ]
    },
    {
      id: 'USR-1005',
      name: 'Vikramaditya Rao',
      email: 'vikram.rao@example.com',
      phone: '+91 94401 88990',
      role: 'USER',
      gender: 'Male',
      joinedDate: '18 Jun 2024',
      status: 'Active',
      ordersCount: 2,
      totalSpent: '₹1,24,980',
      addressCount: 1,
      addresses: [
        {
          id: 'ADDR-5',
          name: 'Vikram Rao',
          line1: 'House 8-2-120, Jubilee Hills',
          city: 'Hyderabad',
          state: 'Telangana',
          pincode: '500033',
          isDefault: true
        }
      ]
    },
    {
      id: 'USR-1006',
      name: 'Sneha Reddy',
      email: 'sneha.reddy@example.com',
      phone: '+91 99887 76655',
      role: 'USER',
      gender: 'Female',
      joinedDate: '12 Aug 2024',
      status: 'Active',
      ordersCount: 0,
      totalSpent: '₹0',
      addressCount: 0,
      addresses: []
    }
  ],

  orders: [
    {
      id: 'ES-2025-001847',
      shortId: '#ORD-1847',
      customer: {
        name: 'Rahul Sharma',
        email: 'rahul.sharma@example.com',
        phone: '+91 98765 43210'
      },
      items: [
        {
          name: 'Samsung Galaxy S25 Ultra 5G',
          category: 'Mobiles',
          brand: 'Samsung',
          variant: '256GB · Titanium Black',
          quantity: 1,
          price: 134999,
          subtotal: 134999
        }
      ],
      totalAmount: 134999,
      subtotal: 134999,
      discount: 0,
      deliveryFee: 0,
      paymentMethod: 'UPI / Razorpay',
      paymentStatus: 'Paid',
      status: 'delivered',
      date: '12 Jul 2025',
      deliveryDate: '15 Jul 2025',
      shippingAddress: 'Flat 402, Sai Residency, Road No. 12, Banjara Hills, Hyderabad, Telangana — 500034',
      timeline: [
        { label: 'Order Placed', date: '12 Jul 2025, 3:42 PM', done: true },
        { label: 'Confirmed', date: '12 Jul 2025, 4:10 PM', done: true },
        { label: 'Packed', date: '13 Jul 2025, 10:00 AM', done: true },
        { label: 'Out for Delivery', date: '15 Jul 2025, 9:30 AM', done: true },
        { label: 'Delivered', date: '15 Jul 2025, 2:15 PM', done: true }
      ]
    },
    {
      id: 'ES-2025-001821',
      shortId: '#ORD-1821',
      customer: {
        name: 'Vikramaditya Rao',
        email: 'vikram.rao@example.com',
        phone: '+91 94401 88990'
      },
      items: [
        {
          name: 'Apple iPhone 16 Pro Max',
          category: 'Mobiles',
          brand: 'Apple',
          variant: '512GB · Natural Titanium',
          quantity: 1,
          price: 159900,
          subtotal: 159900
        }
      ],
      totalAmount: 159900,
      subtotal: 159900,
      discount: 0,
      deliveryFee: 0,
      paymentMethod: 'Credit Card (HDFC EMI)',
      paymentStatus: 'Paid',
      status: 'out_for_delivery',
      date: '08 Jul 2025',
      deliveryDate: '16 Jul 2025',
      shippingAddress: 'House 8-2-120, Jubilee Hills, Hyderabad, Telangana — 500033',
      timeline: [
        { label: 'Order Placed', date: '08 Jul 2025, 11:20 AM', done: true },
        { label: 'Confirmed', date: '08 Jul 2025, 11:45 AM', done: true },
        { label: 'Packed', date: '09 Jul 2025, 2:00 PM', done: true },
        { label: 'Out for Delivery', date: '16 Jul 2025, 8:00 AM', done: true },
        { label: 'Delivered', date: 'Expected today by 7 PM', done: false }
      ]
    },
    {
      id: 'ES-2025-001794',
      shortId: '#ORD-1794',
      customer: {
        name: 'Priya Patel',
        email: 'priya.patel@example.com',
        phone: '+91 98234 56789'
      },
      items: [
        {
          name: 'LG OLED C3 65" Smart TV',
          category: 'TVs',
          brand: 'LG',
          variant: '65 inch · 4K · OLED',
          quantity: 1,
          price: 159990,
          subtotal: 159990
        }
      ],
      totalAmount: 159990,
      subtotal: 159990,
      discount: 0,
      deliveryFee: 0,
      paymentMethod: 'Net Banking',
      paymentStatus: 'Paid',
      status: 'confirmed',
      date: '05 Jul 2025',
      deliveryDate: '18 Jul 2025',
      shippingAddress: 'Tower B, Tech Park, Gachibowli, Hyderabad, Telangana — 500081',
      timeline: [
        { label: 'Order Placed', date: '05 Jul 2025, 6:00 PM', done: true },
        { label: 'Confirmed', date: '05 Jul 2025, 6:30 PM', done: true },
        { label: 'Packed', date: 'In progress', done: false },
        { label: 'Out for Delivery', date: '—', done: false },
        { label: 'Delivered', date: 'Expected 18 Jul 2025', done: false }
      ]
    },
    {
      id: 'ES-2025-001762',
      shortId: '#ORD-1762',
      customer: {
        name: 'Ananya Verma',
        email: 'ananya.v@example.com',
        phone: '+91 97112 34567'
      },
      items: [
        {
          name: 'Daikin 1.5 Ton 5★ Inverter Split AC',
          category: 'Air Conditioners',
          brand: 'Daikin',
          variant: '1.5 Ton · 5 Star · Inverter',
          quantity: 1,
          price: 44990,
          subtotal: 44990
        }
      ],
      totalAmount: 44990,
      subtotal: 44990,
      discount: 0,
      deliveryFee: 0,
      paymentMethod: 'Cash on Delivery',
      paymentStatus: 'Pending',
      status: 'processing',
      date: '01 Jul 2025',
      deliveryDate: '20 Jul 2025',
      shippingAddress: 'B-14, Green Meadows, Whitefield, Bengaluru, Karnataka — 560066',
      timeline: [
        { label: 'Order Placed', date: '01 Jul 2025, 2:15 PM', done: true },
        { label: 'Confirmed', date: 'Verification pending', done: false },
        { label: 'Packed', date: '—', done: false },
        { label: 'Out for Delivery', date: '—', done: false },
        { label: 'Delivered', date: 'Expected 20 Jul 2025', done: false }
      ]
    },
    {
      id: 'ES-2025-001703',
      shortId: '#ORD-1703',
      customer: {
        name: 'Rahul Sharma',
        email: 'rahul.sharma@example.com',
        phone: '+91 98765 43210'
      },
      items: [
        {
          name: 'Bosch 559L Multi Door Refrigerator',
          category: 'Refrigerators',
          brand: 'Bosch',
          variant: '559L · Silver · 5 Star',
          quantity: 1,
          price: 79990,
          subtotal: 79990
        }
      ],
      totalAmount: 79990,
      subtotal: 79990,
      discount: 0,
      deliveryFee: 0,
      paymentMethod: 'Credit Card',
      paymentStatus: 'Refunded',
      status: 'cancelled',
      date: '20 Jun 2025',
      deliveryDate: '—',
      shippingAddress: 'Flat 402, Sai Residency, Road No. 12, Banjara Hills, Hyderabad, Telangana — 500034',
      timeline: [
        { label: 'Order Placed', date: '20 Jun 2025, 10:00 AM', done: true },
        { label: 'Confirmed', date: '20 Jun 2025, 10:30 AM', done: true },
        { label: 'Cancelled', date: '21 Jun 2025, 9:00 AM (Customer requested cancellation)', done: true },
        { label: 'Packed', date: '—', done: false },
        { label: 'Delivered', date: '—', done: false }
      ]
    }
  ]
};

// Expose globally on window for client scripts
if (typeof window !== 'undefined') {
  window.adminMockData = adminMockData;
}
