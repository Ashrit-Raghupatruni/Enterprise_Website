import prisma from '../src/config/prisma.js';

async function seedAdminData() {
  try {
    console.log('🌱 Seeding admin data...\n');

    // ─── Seed Categories (if not exist) ───────────────────────────────────────
    const categories = [
      { name: 'Mobiles', id: 'cat-mobiles' },
      { name: 'TVs', id: 'cat-tvs' },
      { name: 'Air Conditioners', id: 'cat-acs' },
      { name: 'Home Theatres', id: 'cat-home-theatres' },
      { name: 'Kitchen Appliances', id: 'cat-kitchen' },
      { name: 'Refrigerators', id: 'cat-refrigerators' }
    ];

    for (const cat of categories) {
      const exists = await prisma.category.findUnique({
        where: { id: cat.id }
      });
      if (!exists) {
        await prisma.category.create({
          data: {
            id: cat.id,
            name: cat.name
          }
        });
        console.log(`✓ Created category: ${cat.name}`);
      } else {
        console.log(`⊘ Category already exists: ${cat.name}`);
      }
    }

    // ─── Seed Banners ────────────────────────────────────────────────────────
    const banners = [
      {
        title: 'Summer Mega Sale',
        eyebrow: 'Limited Time',
        subtitle: 'Up to 50% off on all electronics',
        ctaText: 'Shop Now',
        slug: 'summer-mega-sale',
        badge: 'Trending',
        status: 'ACTIVE',
        bgGradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        accentColor: '#ff6b6b',
        displayOrder: 1,
        clicks: 2450
      },
      {
        title: 'New iPhone 15 Arrivals',
        eyebrow: 'Just Launched',
        subtitle: 'The latest flagship smartphone with cutting-edge technology',
        ctaText: 'Pre Order',
        slug: 'iphone-15-launch',
        badge: 'New',
        status: 'ACTIVE',
        bgGradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        accentColor: '#ffffff',
        displayOrder: 2,
        clicks: 1890
      },
      {
        title: 'Student Special Discount',
        eyebrow: 'Exclusive Offer',
        subtitle: '20% extra discount with student ID verification',
        ctaText: 'Verify & Enjoy',
        slug: 'student-special',
        badge: 'Exclusive',
        status: 'ACTIVE',
        bgGradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        accentColor: '#ffd700',
        displayOrder: 3,
        clicks: 1340
      },
      {
        title: 'Trade-In Program',
        eyebrow: 'Upgrade Now',
        subtitle: 'Exchange your old device for instant credit',
        ctaText: 'Check Value',
        slug: 'trade-in-program',
        badge: null,
        status: 'INACTIVE',
        bgGradient: 'linear-gradient(135deg, #0d1e4d 0%, #1e3d8f 100%)',
        accentColor: '#f58500',
        displayOrder: 4,
        clicks: 856
      }
    ];

    for (const banner of banners) {
      const exists = await prisma.banner.findFirst({
        where: { slug: banner.slug }
      });
      if (!exists) {
        await prisma.banner.create({
          data: banner
        });
        console.log(`✓ Created banner: ${banner.title}`);
      }
    }

    // ─── Seed Products with Variants ──────────────────────────────────────────
    const products = [
      {
        name: 'iPhone 15 Pro',
        description: 'Premium smartphone with A17 Pro chip, advanced camera system, and all-day battery life',
        brand: 'Apple',
        price: '119999',
        categoryId: 'cat-mobiles',
        slug: 'iphone-15-pro',
        availability: 'AVAILABLE',
        images: [
          { imageUrl: 'https://via.placeholder.com/400x400?text=iPhone+15+Pro+Black', isPrimary: true },
          { imageUrl: 'https://via.placeholder.com/400x400?text=iPhone+15+Pro+Silver', isPrimary: false }
        ]
      },
      {
        name: 'Samsung Galaxy S24',
        description: 'Flagship Android phone with Exynos 2400, dynamic AMOLED display, and 50MP camera',
        brand: 'Samsung',
        price: '89999',
        categoryId: 'cat-mobiles',
        slug: 'samsung-galaxy-s24',
        availability: 'AVAILABLE',
        images: [
          { imageUrl: 'https://via.placeholder.com/400x400?text=Galaxy+S24+Black', isPrimary: true }
        ]
      },
      {
        name: 'LG OLED TV 55"',
        description: '4K OLED television with Dolby Vision, HDMI 2.1, and smart TV features',
        brand: 'LG',
        price: '149999',
        categoryId: 'cat-tvs',
        slug: 'lg-oled-55-inch',
        availability: 'AVAILABLE',
        images: [
          { imageUrl: 'https://via.placeholder.com/400x400?text=LG+OLED+55inch', isPrimary: true }
        ]
      },
      {
        name: 'Daikin 1.5 Ton AC',
        description: 'Energy-efficient air conditioner with inverter technology and smart temperature control',
        brand: 'Daikin',
        price: '45999',
        categoryId: 'cat-acs',
        slug: 'daikin-1.5-ton-ac',
        availability: 'AVAILABLE',
        images: [
          { imageUrl: 'https://via.placeholder.com/400x400?text=Daikin+AC', isPrimary: true }
        ]
      },
      {
        name: 'Sony Dolby Atmos Soundbar',
        description: '3D audio soundbar with Dolby Atmos, wireless subwoofer, and 7.1.2 channels',
        brand: 'Sony',
        price: '79999',
        categoryId: 'cat-home-theatres',
        slug: 'sony-soundbar-atmos',
        availability: 'AVAILABLE',
        images: [
          { imageUrl: 'https://via.placeholder.com/400x400?text=Sony+Soundbar', isPrimary: true }
        ]
      },
      {
        name: 'LG Refrigerator 600L',
        description: 'Double door refrigerator with inverter compressor, fresh guard, and convertible freezer',
        brand: 'LG',
        price: '89999',
        categoryId: 'cat-refrigerators',
        slug: 'lg-refrigerator-600l',
        availability: 'AVAILABLE',
        images: [
          { imageUrl: 'https://via.placeholder.com/400x400?text=LG+Refrigerator', isPrimary: true }
        ]
      }
    ];

    for (const productData of products) {
      const existing = await prisma.product.findUnique({
        where: { slug: productData.slug }
      });

      if (!existing) {
        const { images, ...prodData } = productData;
        const product = await prisma.product.create({
          data: {
            ...prodData,
            productImages: {
              createMany: {
                data: images
              }
            }
          }
        });
        console.log(`✓ Created product: ${product.name}`);
      } else {
        console.log(`⊘ Product already exists: ${productData.name}`);
      }
    }

    // ─── Seed Orders with OrderItems ─────────────────────────────────────────
    const users = await prisma.user.findMany({
      take: 3,
      select: { id: true }
    });

    if (users.length > 0) {
      const orderStatuses = ['PROCESSING', 'CONFIRMED', 'OUT_FOR_DELIVERY', 'DELIVERED', 'CANCELLED'];
      const products_list = await prisma.product.findMany({
        take: 6,
        select: { id: true, name: true, price: true }
      });

      const orders = [
        {
          shortId: 'ORD-001234',
          userId: users[0].id,
          status: 'DELIVERED',
          subtotal: '119999',
          discountAmount: '10000',
          deliveryFee: '499',
          totalAmount: '110498',
          paymentMethod: 'Credit Card',
          paymentStatus: 'Paid',
          shippingAddress: '123 Main St, Mumbai, Maharashtra 400001',
          deliveryDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        },
        {
          shortId: 'ORD-001235',
          userId: users[0].id,
          status: 'OUT_FOR_DELIVERY',
          subtotal: '229998',
          discountAmount: '25000',
          deliveryFee: '0',
          totalAmount: '204998',
          paymentMethod: 'UPI',
          paymentStatus: 'Paid',
          shippingAddress: '123 Main St, Mumbai, Maharashtra 400001',
          deliveryDate: null
        },
        {
          shortId: 'ORD-001236',
          userId: users[1].id,
          status: 'CONFIRMED',
          subtotal: '45999',
          discountAmount: '2000',
          deliveryFee: '99',
          totalAmount: '44098',
          paymentMethod: 'Debit Card',
          paymentStatus: 'Paid',
          shippingAddress: '456 Park Ave, Bangalore, Karnataka 560001',
          deliveryDate: null
        },
        {
          shortId: 'ORD-001237',
          userId: users[2].id,
          status: 'PROCESSING',
          subtotal: '89999',
          discountAmount: '5000',
          deliveryFee: '199',
          totalAmount: '85198',
          paymentMethod: 'Wallet',
          paymentStatus: 'Pending',
          shippingAddress: '789 Tech Lane, Hyderabad, Telangana 500001',
          deliveryDate: null
        }
      ];

      for (let i = 0; i < orders.length; i++) {
        const existing = await prisma.order.findUnique({
          where: { shortId: orders[i].shortId }
        });

        if (!existing && products_list.length > 0) {
          const order = await prisma.order.create({
            data: {
              ...orders[i],
              items: {
                createMany: {
                  data: [
                    {
                      productId: products_list[i % products_list.length].id,
                      productName: products_list[i % products_list.length].name,
                      variantDescription: 'Black, 256GB',
                      unitPrice: products_list[i % products_list.length].price,
                      quantity: 1,
                      lineTotal: products_list[i % products_list.length].price
                    }
                  ]
                }
              }
            }
          });
          console.log(`✓ Created order: ${order.shortId}`);
        } else if (existing) {
          console.log(`⊘ Order already exists: ${orders[i].shortId}`);
        }
      }
    }

    // ─── Seed Variant Attributes ──────────────────────────────────────────────
    const attributes = [
      {
        name: 'Color',
        displayName: 'Color',
        values: [
          { value: 'black', displayValue: 'Black' },
          { value: 'silver', displayValue: 'Silver' },
          { value: 'blue', displayValue: 'Blue' },
          { value: 'gold', displayValue: 'Gold' }
        ]
      },
      {
        name: 'Storage',
        displayName: 'Storage Capacity',
        values: [
          { value: '128gb', displayValue: '128GB' },
          { value: '256gb', displayValue: '256GB' },
          { value: '512gb', displayValue: '512GB' },
          { value: '1tb', displayValue: '1TB' }
        ]
      },
      {
        name: 'RAM',
        displayName: 'RAM',
        values: [
          { value: '8gb', displayValue: '8GB' },
          { value: '12gb', displayValue: '12GB' },
          { value: '16gb', displayValue: '16GB' }
        ]
      }
    ];

    for (const attr of attributes) {
      const existing = await prisma.variantAttribute.findUnique({
        where: { name: attr.name }
      });

      if (!existing) {
        const attribute = await prisma.variantAttribute.create({
          data: {
            name: attr.name,
            displayName: attr.displayName,
            values: {
              createMany: {
                data: attr.values
              }
            }
          }
        });
        console.log(`✓ Created attribute: ${attribute.name} with ${attr.values.length} values`);
      } else {
        console.log(`⊘ Attribute already exists: ${attr.name}`);
      }
    }

    console.log('\n✅ Admin data seeding complete!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seeding failed:', err);
    process.exit(1);
  }
}

seedAdminData();
