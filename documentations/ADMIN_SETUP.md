# Admin Panel Setup Guide

## Overview
This guide helps you set up the complete admin panel with all APIs, database tables, and seed data.

## Prerequisites
- Node.js 18+ installed
- PostgreSQL database running
- `.env` file configured with DATABASE_URL

## Installation Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Prisma Migrations
Apply all database migrations (including admin tables):
```bash
npx prisma migrate dev
```

This will:
- Create all new tables: Banner, Order, OrderItem, ProductVariant, VariantAttribute, VariantAttributeValue
- Update existing tables with new relations

### 3. Seed Default Attributes (Optional)
Pre-populate variant attributes (Color, Size, Storage, RAM):
```bash
npm run seed:attributes
```

### 4. Seed Admin Data (Recommended)
Populate the database with sample admin data:
```bash
npm run seed:admin
```

This creates:
- 4 Sample Banners (with different statuses and gradients)
- 6 Sample Products (across different categories)
- 4 Sample Orders (with different statuses)
- 3 Variant Attributes with predefined values

### 5. Start the Server
```bash
npm run dev
```

Server will run at: `http://localhost:3001`

## API Endpoints (All Protected)

All endpoints require:
- JWT authentication token in Authorization header
- Admin role (role = 'ADMIN')

### Stats
- `GET /api/admin/stats` — Dashboard statistics

### Banners
- `GET /api/admin/banners` — List banners (filters: status, search)
- `POST /api/admin/banners` — Create banner
- `PUT /api/admin/banners/:id` — Update banner
- `PATCH /api/admin/banners/:id/toggle` — Toggle status
- `DELETE /api/admin/banners/:id` — Delete banner

### Products
- `GET /api/admin/products` — List products (filters: search, category, pagination)
- `POST /api/admin/products` — Create product
- `PUT /api/admin/products/:id` — Update product
- `PATCH /api/admin/products/:id/visibility` — Toggle visibility
- `DELETE /api/admin/products/:id` — Delete product

### Attributes
- `GET /api/admin/attributes` — List all attributes with values
- `POST /api/admin/attributes` — Create attribute
- `GET /api/admin/attributes/:id/values` — List attribute values
- `POST /api/admin/attributes/:id/values` — Create attribute value

### Variants
- `GET /api/admin/variants` — List variants (filters: productId, availability)
- `POST /api/admin/variants` — Create variant
- `PATCH /api/admin/variants/:id/availability` — Toggle availability
- `DELETE /api/admin/variants/:id` — Delete variant

### Users
- `GET /api/admin/users` — List users (filters: search, role, pagination)
- `GET /api/admin/users/:id` — Get user details with addresses and orders

### Orders
- `GET /api/admin/orders` — List orders (filters: status, search, pagination)
- `GET /api/admin/orders/:id` — Get order details with items
- `PATCH /api/admin/orders/:id/status` — Update order status

## Frontend Integration

### Enable Live API
Pass `useApi: true` when rendering admin pages:

```javascript
// In your admin page routes
res.render('admin/dashboard', { useApi: true });
res.render('admin/banners', { useApi: true });
res.render('admin/products', { useApi: true });
res.render('admin/users', { useApi: true });
res.render('admin/orders', { useApi: true });
```

### Frontend Features
- Automatic API ↔ mock data switching
- Real-time search and filters
- CRUD operations with validation
- Toast notifications for feedback
- Responsive admin UI

## Database Schema

### New Tables

**Banner**
- id, title, eyebrow, subtitle, ctaText, slug, badge, status, bgGradient, accentColor, displayOrder, clicks

**Order**
- id, shortId, userId, status, subtotal, discountAmount, deliveryFee, totalAmount, paymentMethod, paymentStatus, shippingAddress, deliveryDate

**OrderItem**
- id, orderId, productId, variantId, productName, variantDescription, unitPrice, quantity, lineTotal

**ProductVariant**
- id, productId, availability, priceOverride

**VariantAttribute**
- id, name, displayName

**VariantAttributeValue**
- id, attributeId, value, displayValue

### Updated Tables

**Product**
- Added: variants (relation)

**User**
- Added: orders (relation)

**ProductImage**
- Added: variantId (nullable relation)

## Troubleshooting

### Database connection error
- Verify DATABASE_URL in `.env`
- Ensure PostgreSQL is running
- Check database exists

### Migration fails
- Run: `npx prisma migrate reset` (⚠️ WARNING: clears all data)
- Re-run: `npx prisma migrate dev`

### API returns 403
- Check JWT token is valid
- Verify user has admin role
- Check Authorization header format: `Bearer <token>`

### Seed script fails
- Ensure migration ran successfully
- Check database has required tables
- Verify connection string is correct

## Next Steps

1. Create admin users with `role: 'ADMIN'`
2. Generate valid JWT tokens for testing
3. Test endpoints with Postman/Insomnia
4. Enable useApi flag on admin pages
5. Customize seed data as needed

## Support

For issues or questions, refer to the implementation plan: `documentations/admin-Implementation-Plan.md`
