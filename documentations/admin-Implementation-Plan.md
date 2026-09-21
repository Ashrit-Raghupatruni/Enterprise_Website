# Admin Panel Backend — Tasks & Implementation Plan

**Project**: Kishor Enterprises — Enterprise Store  
**Module**: Admin Panel Backend  
**Version**: 2.1 (with Product Variants)

---

## Overview

5 sprints, 28 tasks, ~12 hours total

Sprint 1: Foundation       (1.5h)
Sprint 2: Read APIs        (3h)
Sprint 3: Write APIs       (3h)
Sprint 4: Variants         (3h)
Sprint 5: Frontend         (1.5h)

---

## Important Conventions

1. Class-based: export class AdminBannerController {}
2. Named exports: export class Foo {}
3. Route binding: ctrl.method.bind(ctrl)
4. Prisma import: import prisma from '../../../config/prisma.js'
5. Error pattern: throw new Error(msg); err.status = 400
6. No password_hash: never include in responses
7. Variant attributes: each attribute is a dimension (Color, Size, Storage)

---

## Sprint 1 — Foundation (1.5 hours)

### Task 1.1 — Update Prisma Schema

File: prisma/schema.prisma

Follow PRISMA-SCHEMA-DIFF.md for exact changes:
- Add variants ProductVariant[] to Product
- Add orderItems OrderItem[] to Product
- Add orders Order[] to User
- Add variantId String? to ProductImage
- Add variant ProductVariant? relation to ProductImage
- Add 3 new enums: BannerStatus, OrderStatus
- Add 6 new models: VariantAttribute, VariantAttributeValue, ProductVariant, Banner, Order, OrderItem

Acceptance: npx prisma validate passes with no errors

---

### Task 1.2 — Run Migration

npx prisma migrate dev --name admin_panel_with_variants
npx prisma generate

Acceptance: Migration runs cleanly, new tables appear in Neon

---

### Task 1.3 — Create adminGuard Middleware

File: src/middleware/adminGuard.js

export default function adminGuard(req, res, next) {
  if (!req.user || req.user.role !== 'ADMIN') {
    return res.status(403).json({
      success: false,
      message: 'Forbidden: Admin access only.'
    });
  }
  next();
}

Acceptance: Returns 403 for USER, calls next() for ADMIN

---

### Task 1.4 — Create API Route Scaffold

File: src/features/admin/routes/adminApiRoutes.js

- Import Router
- Define all 25 routes (see LLD)
- Each handler returns { success: true, message: 'TODO' }
- Export router

Acceptance: Every route responds 200 with placeholder

---

### Task 1.5 — Mount Routes in server.js

File: server.js

import adminApiRoutes from './src/features/admin/routes/adminApiRoutes.js';
import adminGuard from './src/middleware/adminGuard.js';

app.use('/api/admin', jwtAuthenticate, adminGuard, adminApiRoutes);

Acceptance: 401 without auth, 403 for USER, 200 placeholder for ADMIN

---

## Sprint 2 — Read APIs (3 hours)

### Task 2.1 — Stats

Files: 3 files
- AdminStatsRepository: countProducts, countUsers, countOrders, sumRevenue, countLowStock, countPendingOrders, countActiveBanners
- AdminStatsService: aggregate() calls all in Promise.all
- AdminStatsController: getStats() calls service

Acceptance: GET /api/admin/stats returns real counts

---

### Task 2.2 — Banner List

Files: 3 files
- Repository: findAll(where, orderBy)
- Service: list(filters) build where
- Controller: list()

Acceptance: GET /api/admin/banners works, filters by status/search

---

### Task 2.3 — Product List

Files: 3 files
- Include category + primary image
- Service: search, category filter, pagination
- Return variantsCount

Acceptance: GET /api/admin/products works

---

### Task 2.4 — User List + Detail

Files: 3 files
- list(filters): search, role filter, include counts
- getDetail(id): full user + addresses + compute totalSpent
- Strip password_hash from all responses

Acceptance: GET /api/admin/users and GET /api/admin/users/:id work

---

### Task 2.5 — Order List + Detail

Files: 3 files
- list(filters): status filter, search, include user + item count
- getDetail(id): full order with items

Acceptance: GET /api/admin/orders works

---

## Sprint 3 — Write APIs (3 hours)

### Task 3.1 — Banner Writes

Add to AdminBannerService: create(), update(), toggle(), remove()
Add to controller and routes

Acceptance: POST/PUT/PATCH/DELETE /api/admin/banners/* persist to DB

---

### Task 3.2 — Product Writes

Add create(), update(), remove()
Validate required fields, check slug uniqueness (409)

Acceptance: POST/PUT/DELETE /api/admin/products/* work

---

### Task 3.3 — Product Visibility

Add toggleVisibility()
Flip AVAILABLE ↔ NOT_AVAILABLE

Acceptance: PATCH /api/admin/products/:id/visibility works

---

### Task 3.4 — Order Status Update

Add updateStatus(id, status)
Validate status enum value

Acceptance: PATCH /api/admin/orders/:id/status works

---

## Sprint 4 — Variants (3 hours)

### Task 4.1 — Variant Attributes CRUD

Create 3 files:
- Repository: findAll(), findById(), create(), findValues(), createValue()
- Service: list(), create(), listValues(), createValue()
- Controller: list(), create(), listValues(), createValue()

Acceptance: All attribute CRUD endpoints work

---

### Task 4.2 — Seed Default Attributes

Pre-populate:
- Color (red, blue, black, silver, titanium)
- Size (S, M, L, XL, XXL)
- Storage (128gb, 256gb, 512gb, 1tb)
- RAM (4gb, 6gb, 8gb, 12gb, 16gb)

Acceptance: Query GET /api/admin/attributes returns 4+ attributes

---

### Task 4.3 — Variant CRUD

Create 3 files:
- Repository: findAll(where), findById(id), create(data), update(id, data), delete(id)
- Service: list(filters), create(data), toggleAvailability(id), remove(id)
- Controller: list(), create(), toggleAvailability(), remove()

Service: validate all required attribute values provided

Acceptance: All variant CRUD endpoints work

---

## Sprint 5 — Frontend (1.5 hours)

### Task 5.1 — Pass useApi Flag

File: src/features/admin/routes/adminRoutes.js

Add useApi: true to all res.render() calls for dashboard, banners, products, users, orders

Acceptance: window.ADMIN_USE_API === true in browser

---

### Task 5.2 — Update admin-head.ejs

File: frontend/views/partials/admin/admin-head.ejs

Add: <script>window.ADMIN_USE_API = <%= useApi %>;</script>

Acceptance: window.ADMIN_USE_API accessible in console

---

### Task 5.3-5.7 — Wire All Pages

Replace mock data reads in admin.js with fetch() calls:

5.3 Dashboard: fetch('/api/admin/stats'), fetch('/api/admin/orders?limit=5')
5.4 Banners: fetch('/api/admin/banners/*') for all CRUD
5.5 Products: fetch('/api/admin/products/*') for all CRUD
5.6 Users: fetch('/api/admin/users') and fetch('/api/admin/users/:id')
5.7 Orders: fetch('/api/admin/orders*')

Acceptance: All pages show real data

---

### Task 5.8 — Remove Mock Data

Remove <script src="/assets/data/admin-mock-data.js"></script> from all 5 admin EJS pages

Acceptance: Admin panel works without mock data script

---

## Summary Table

Sprint | Task | Est. | Key Files
-------|------|------|----------
1 | 1.1 Schema | 30m | schema.prisma
1 | 1.2 Migrate | 10m | (migration runs)
1 | 1.3 adminGuard | 15m | adminGuard.js
1 | 1.4 Routes scaffold | 20m | adminApiRoutes.js
1 | 1.5 Mount | 10m | server.js
2 | 2.1 Stats | 30m | 3 files
2 | 2.2 Banner list | 30m | 3 files
2 | 2.3 Product list | 45m | 3 files
2 | 2.4 User list+detail | 45m | 3 files
2 | 2.5 Order list+detail | 30m | 3 files
3 | 3.1 Banner writes | 45m | 2 files
3 | 3.2 Product writes | 45m | 2 files
3 | 3.3 Visibility | 15m | 1 file
3 | 3.4 Order status | 15m | 1 file
4 | 4.1 Attributes | 45m | 3 files
4 | 4.2 Seed attributes | 30m | seed script
4 | 4.3 Variants | 60m | 3 files
5 | 5.1 useApi flag | 15m | adminRoutes.js
5 | 5.2 admin-head.ejs | 15m | admin-head.ejs
5 | 5.3-5.7 Wire pages | 120m | admin.js (all pages)
5 | 5.8 Remove mock | 10m | 5 EJS pages

Total: ~12 hours

---

## Strict Order

Sprint 1 → Sprint 2 (parallel) → Sprint 3 (per module) → Sprint 4 → Sprint 5

---

## Definition of Done

✅ All 25 endpoints built and tested
✅ Input validation returns 400/404/409 for bad inputs
✅ Auth guards enforce role === 'ADMIN'
✅ No unhandled promise rejections
✅ Admin frontend renders live data (no mock data)
✅ Variants support multi-dimensional attributes
✅ Each variant toggles independently for availability
✅ Orders track variant details correctly

---
