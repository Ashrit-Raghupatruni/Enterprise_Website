/**
 * home-products.js — Product data for all Home page carousel sections.
 * Keyed by category slug so home-slider.js can render each section independently.
 */

const homeProductsData = {

  trending: [
    { id: 101, brand: 'Samsung',  name: 'Galaxy S24 Ultra',             category: 'Mobiles',  rating: 4.8, reviews: 2340, originalPrice: 134999, salePrice: 119999, discount: 11, badge: 'Bestseller', badgeType: 'primary', color: '#1e3d8f' },
    { id: 102, brand: 'Apple',    name: 'iPhone 15 Pro Max',             category: 'Mobiles',  rating: 4.9, reviews: 4120, originalPrice: 159900, salePrice: 149900, discount:  6, badge: 'Top Rated',  badgeType: 'accent',  color: '#374151' },
    { id: 103, brand: 'LG',       name: 'OLED C3 65" Smart TV',          category: 'TVs',      rating: 4.7, reviews:  890, originalPrice: 189990, salePrice: 159990, discount: 16, badge: 'Hot Deal',   badgeType: 'accent',  color: '#b85e00' },
    { id: 104, brand: 'Daikin',   name: '1.5 Ton 5-Star Inverter AC',    category: 'ACs',      rating: 4.6, reviews: 1450, originalPrice:  52990, salePrice:  44990, discount: 15, badge: '5 Star',     badgeType: 'success', color: '#0369a1' },
    { id: 105, brand: 'OnePlus',  name: 'OnePlus 12 5G',                 category: 'Mobiles',  rating: 4.7, reviews: 1870, originalPrice:  64999, salePrice:  56999, discount: 12, badge: 'New',        badgeType: 'primary', color: '#dc2626' },
    { id: 106, brand: 'Samsung',  name: '55" QLED 4K Smart TV',          category: 'TVs',      rating: 4.5, reviews:  670, originalPrice:  89999, salePrice:  74999, discount: 17, badge: 'Sale',       badgeType: 'accent',  color: '#1e3d8f' },
    { id: 107, brand: 'Whirlpool',name: '340L Double Door Refrigerator', category: 'Fridges',  rating: 4.4, reviews:  540, originalPrice:  38990, salePrice:  32990, discount: 15, badge: 'Popular',    badgeType: 'primary', color: '#047857' },
    { id: 108, brand: 'Sony',     name: 'WH-1000XM5 Headphones',         category: 'Acc',      rating: 4.8, reviews: 3100, originalPrice:  29990, salePrice:  24990, discount: 17, badge: 'Award Win',  badgeType: 'accent',  color: '#374151' },
  ],

  mobiles: [],

  // TVs data is fetched live from the backend api(postgreSQL+cloudinary)
  tvs: [],

  // ACs data is fetched live from the backend api(postgreSQL+ cloudinary)
  acs: [],

  homeTheatres: [
    { id: 501, brand: 'Sony',     name: 'HT-A9 4.0ch Dolby Atmos',   rating: 4.8, reviews:  240, originalPrice:  99990, salePrice:  84990, discount: 15, badge: 'Premium',   badgeType: 'primary', color: '#374151' },
    { id: 502, brand: 'Samsung',  name: 'Q990C 11.1.4ch Soundbar',   rating: 4.7, reviews:  180, originalPrice:  89990, salePrice:  74990, discount: 17, badge: 'Dolby',     badgeType: 'accent',  color: '#1e3d8f' },
    { id: 503, brand: 'LG',       name: 'SP11RA 7.1.4ch Soundbar',   rating: 4.6, reviews:  150, originalPrice:  69990, salePrice:  57990, discount: 17, badge: null,        badgeType: 'primary', color: '#b85e00' },
    { id: 504, brand: 'Bose',     name: 'Smart Soundbar 900',        rating: 4.8, reviews:  320, originalPrice:  84990, salePrice:  71990, discount: 15, badge: 'Top Pick',  badgeType: 'success', color: '#374151' },
    { id: 505, brand: 'JBL',      name: 'Bar 1300 11.1.4ch',         rating: 4.5, reviews:  210, originalPrice:  74990, salePrice:  62990, discount: 16, badge: null,        badgeType: 'accent',  color: '#0ea5e9' },
    { id: 506, brand: 'Yamaha',   name: 'YHT-4950U 5.1ch System',    rating: 4.4, reviews:  280, originalPrice:  39990, salePrice:  33990, discount: 15, badge: 'Value',     badgeType: 'primary', color: '#1e3d8f' },
    { id: 507, brand: 'Philips',  name: 'TAB8905 3.1ch Soundbar',    rating: 4.2, reviews:  190, originalPrice:  29990, salePrice:  24990, discount: 17, badge: null,        badgeType: 'accent',  color: '#374151' },
    { id: 508, brand: 'Denon',    name: 'DHT-S517 Soundbar',         rating: 4.5, reviews:  160, originalPrice:  44990, salePrice:  37990, discount: 16, badge: null,        badgeType: 'primary', color: '#374151' },
  ],

  // Kitchen Appliances — temporarily unavailable (not in showroom inventory).
  // To re-enable: restore product data here and in src/config/categoryConfig.js.
  kitchen: [],

  // Refrigerators — temporarily unavailable (not in showroom inventory).
  // To re-enable: restore product data here and in src/config/categoryConfig.js.
  refrigerators: [],

};

window.homeProductsData = homeProductsData;
