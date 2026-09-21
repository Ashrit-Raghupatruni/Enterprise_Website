# Admin Panel Backend — High Level Design (HLD)

**Project**: Kishor Enterprises — Enterprise Store  
**Module**: Admin Panel Backend  
**Version**: 2.1 (with Product Variants support)  
**Status**: Ready for Development

---

## 1. Objective

Build REST APIs for the existing admin panel frontend (5 EJS pages + admin.js) to:
- Replace window.adminMockData mock reads with live PostgreSQL queries
- Support full CRUD operations on products, banners, orders, users
- Introduce product variants with multi-dimensional attributes (e.g., Color + Size)
- Enforce admin-only access via JWT + role check

**Admin Pages** (already built, waiting for APIs):
- Dashboard (stats, recent orders, low-stock alerts)
- Banners (full CRUD)
- Products (CRUD + stock management)
- Users (read-only, with detail drawer)
- Orders (list + status updates)

---

## 2. Current State

### What exists in codebase
- ✅ PostgreSQL (Neon) with User, Address, Category, Product, ProductImage, ProductInteraction tables
- ✅ Express + Prisma + JWT auth (src/features/auth/)
- ✅ Profile API + Product API (src/features/profile/, src/features/products/)
- ✅ Class-based pattern: Controller → Service → Repository
- ✅ Admin EJS views (5 pages) + mock data + dmin.js
- ✅ dmin-mock-data.js with stats, banners, products, orders, users structures

### What needs to be built
- ❌ /api/admin/* REST endpoints (17 routes)
- ❌ dminGuard middleware (role check)
- ❌ Admin controllers, services, repositories (5 modules)
- ❌ Banner, Order, OrderItem DB models
- ❌ Product variants support: ProductVariant, VariantAttribute, VariantAttributeValue models
- ❌ Variant CRUD endpoints
- ❌ Stock management (availability flags, not numeric quantity)

---

## 3. Scope

### In Scope

| Feature | Scope |
|---|---|
| **Dashboard** | KPI stats, recent orders, low-stock alerts — all from DB |
| **Banners** | Full CRUD, toggle active/inactive, sort by displayOrder |
| **Products** | Full CRUD, stock management (availability flags), visibility toggle |
| **Product Variants** | Create variants per product with multi-dimensional attributes; independent availability toggle per variant |
| **Variant Attributes** | List/create dimensions (Color, Size, Storage, RAM, etc.); manage values per attribute |
| **Users** | Read-only list with detail drawer; order history + total spent |
| **Orders** | List with status filter; detail drawer; update fulfillment status |

### Out of Scope
- Cart / Checkout
- Payment integration
- Admin user management UI (set role via DB manually)
- Product image upload (URLs are Cloudinary strings)
- Revenue charts / analytics

---

## 4. Architecture

`
┌─────────────────────────────────────────────────────┐
│  Browser (5 admin EJS pages)                        │
│  - dashboard.ejs, banners.ejs, products.ejs, etc.   │
│  - admin.js ← currently uses window.adminMockData   │
└────────────────┬────────────────────────────────────┘
                 │ fetch('/api/admin/*')
                 ▼
┌─────────────────────────────────────────────────────┐
│  Express.js Router: /api/admin/*                    │
│                                                     │
│  Middleware stack:                                  │
│    1. jwtAuthenticate (reads 'authToken' cookie)   │
│    2. adminGuard (checks role === 'ADMIN')         │
│    3. Route handler                                │
│                                                     │
│  5 Feature modules (Controller → Service → Repo):   │
│    • AdminBannerController                         │
│    • AdminProductController (+ variants)           │
│    • AdminVariantController                        │
│    • AdminAttributeController                      │
│    • AdminUserController                           │
│    • AdminOrderController                          │
│    • AdminStatsController                          │
└────────────┬──────────────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────────┐
│  Prisma Client → PostgreSQL (Neon)           │
│  Tables:                                     │
│  - User, Address, Category, Product          │
│  - ProductImage, ProductInteraction          │
│  - Banner, Order, OrderItem (NEW)            │
│  - ProductVariant, VariantAttribute,         │
│    VariantAttributeValue (NEW)               │
└──────────────────────────────────────────────┘
`

---

## 5. Key Design Decisions

### 5.1 Stock Visibility (No Numeric Quantity Exposed)

**Admin sees**: AVAILABLE / NOT_AVAILABLE flags only  
**Database stores**: vailability enum (not numeric stock_quantity)  

**At variant level**:
- Each variant has its own vailability: Status (AVAILABLE or NOT_AVAILABLE)
- Admin toggles each variant independently
- No stock numbers visible in admin panel

**At product level**:
- Base product also has vailability: Status
- If product has variants, customer sees variant options
- If product has no variants, it's sold as-is

### 5.2 Variants — Multi-Dimensional Support

Example: iPhone 15 with variants
`
Variant 1:  Red      + 128GB  → availability: AVAILABLE
Variant 2:  Red      + 256GB  → availability: NOT_AVAILABLE
Variant 3:  Blue     + 128GB  → availability: AVAILABLE
Variant 4:  Titanium + 256GB  → availability: AVAILABLE
`

Each variant is uniquely identified by its attribute combination (e.g., Red + 256GB).

**Attributes** (global reference data):
- Color (values: Red, Blue, Titanium, ...)
- Storage (values: 128GB, 256GB, 512GB, ...)

**Admin operations**:
- Create new attribute (e.g., "RAM")
- Add values to attribute (e.g., "8GB", "12GB" to "RAM")
- Create variants by selecting attribute values
- Toggle availability for each variant independently

---

## 6. Database Schema Overview

### New Models

#### **ProductVariant** — a specific variant combination
`
id              String (CUID)
productId       String (FK → Product)
availability    Status (AVAILABLE | NOT_AVAILABLE)
priceOverride   Decimal? (null = inherit product price)
attributeValues VariantAttributeValue[] (the combination)
images          ProductImage[] (variant-specific)
orderItems      OrderItem[] (orders containing this variant)
createdAt, updatedAt
`

#### **VariantAttribute** — defines a dimension
`
id              String (CUID)
name            String unique (e.g., "color", "storage")
displayName     String (e.g., "Color", "Storage Capacity")
values          VariantAttributeValue[]
createdAt, updatedAt
`

#### **VariantAttributeValue** — specific values
`
id              String (CUID)
attributeId     String (FK → VariantAttribute)
value           String (e.g., "red", "128gb")
displayValue    String (e.g., "Red", "128 GB")
variants        ProductVariant[]
createdAt, updatedAt
`

#### **Banner** — hero banners
`
id              String (CUID)
title, eyebrow, subtitle, ctaText, slug
status          BannerStatus (ACTIVE | INACTIVE)
bgGradient, accentColor, badge
displayOrder    Int (sort order)
clicks          Int (telemetry)
createdAt, updatedAt
`

#### **Order** — customer order
`
id              String (CUID)
shortId         String unique (e.g., "#ORD-1847")
userId          String (FK → User)
status          OrderStatus (PROCESSING | CONFIRMED | OUT_FOR_DELIVERY | DELIVERED | CANCELLED)
subtotal, discountAmount, deliveryFee, totalAmount Decimal
paymentMethod, paymentStatus String
shippingAddress String (denormalized for history)
deliveryDate    String?
items           OrderItem[]
createdAt, updatedAt
`

#### **OrderItem** — line item
`
id              String (CUID)
orderId         String (FK → Order)
productId       String (FK → Product)
productName     String (snapshot at purchase)
variantDescription String (e.g., "Red + 128GB")
unitPrice, quantity Decimal/Int
lineTotal       Decimal
createdAt
`

### Updated Models

**Product**: Add ariants: ProductVariant[] relation  
**User**: Add orders: Order[] relation  
**ProductImage**: Add optional ariantId for variant-specific images

---

## 7. API Routes Overview

**Base**: GET/POST/PATCH/DELETE /api/admin/<resource>

| Module | Endpoints | Count |
|---|---|---|
| Stats | GET /api/admin/stats | 1 |
| Banners | GET list, POST create, PUT update, PATCH toggle, DELETE remove | 5 |
| Products | GET list, POST create, PUT update, PATCH stock, PATCH visibility, DELETE remove | 6 |
| Variants | GET list, POST create, PATCH availability, DELETE remove | 4 |
| Attributes | GET list, POST create, GET values, POST values | 4 |
| Users | GET list, GET detail | 2 |
| Orders | GET list, GET detail, PATCH status | 3 |

**Total**: 25 endpoints

All behind jwtAuthenticate + dminGuard.

---

## 8. Response Format (Consistent Envelope)

`json
// Success
{ "success": true, "data": { ... } }

// Paginated
{
  "success": true,
  "data": {
    "items": [ ... ],
    "total": 128,
    "page": 1,
    "limit": 20
  }
}

// Error
{ "success": false, "message": "Descriptive error" }
`

---

## 9. Technology Stack

| Layer | Tech |
|---|---|
| **Runtime** | Node.js v24, ES Modules |
| **Framework** | Express.js v5 |
| **ORM** | Prisma v7 + PrismaPg adapter |
| **Database** | PostgreSQL (Neon) |
| **Auth** | JWT in uthToken httpOnly cookie |
| **Pattern** | Class-based: Controller → Service → Repository |
| **Validation** | Service layer (throw Error with .status) |

---

## 10. Non-Functional Requirements

| Requirement | Target |
|---|---|
| API response time | < 200ms for list endpoints |
| Auth enforcement | 100% of /api/admin/* behind auth + role check |
| Error handling | Return structured JSON, never expose stack traces |
| Input validation | 400 for bad input, 404 for not found, 409 for conflict |
| Data integrity | Cascade deletes via Prisma relations |
| Security | password_hash never in any response |
| Availability flag | Must be AVAILABLE or NOT_AVAILABLE (enforced in service) |
| Variant uniqueness | Combination of attribute values unique per product |

---

## 11. Migration Path

1. Update Prisma schema with new models ✓
2. Run prisma migrate dev ✓
3. Create dminGuard middleware ✓
4. Create admin repositories, services, controllers (per module) ✓
5. Wire routes in /api/admin ✓
6. Mount routes in server.js with auth guards ✓
7. Update dmin.js to fetch from APIs (replace mock data) ✓
8. Test all 5 admin pages with real data ✓
9. Remove mock data script tags ✓

---

