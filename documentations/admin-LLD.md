# Admin Panel Backend — Low Level Design (LLD)

**Project**: Kishor Enterprises — Enterprise Store  
**Module**: Admin Panel Backend  
**Version**: 2.1 (with Product Variants)

---

## 1. File Structure

src/features/admin/
├── routes/
│   └── adminApiRoutes.js       (NEW)
├── controllers/                (NEW)
│   ├── AdminStatsController.js
│   ├── AdminBannerController.js
│   ├── AdminProductController.js
│   ├── AdminVariantController.js
│   ├── AdminAttributeController.js
│   ├── AdminUserController.js
│   └── AdminOrderController.js
├── services/                   (NEW)
│   └── (same 7 service files)
└── repositories/               (NEW)
    └── (same 7 repository files)

---

## 2. Middleware

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

---

## 3. Route Table (25 Endpoints)

GET    /api/admin/stats                      AdminStatsController.getStats
GET    /api/admin/banners                    AdminBannerController.list
POST   /api/admin/banners                    AdminBannerController.create
PUT    /api/admin/banners/:id                AdminBannerController.update
PATCH  /api/admin/banners/:id/toggle         AdminBannerController.toggle
DELETE /api/admin/banners/:id                AdminBannerController.remove
GET    /api/admin/products                   AdminProductController.list
POST   /api/admin/products                   AdminProductController.create
PUT    /api/admin/products/:id               AdminProductController.update
PATCH  /api/admin/products/:id/visibility    AdminProductController.toggleVisibility
DELETE /api/admin/products/:id               AdminProductController.remove
GET    /api/admin/attributes                 AdminAttributeController.list
POST   /api/admin/attributes                 AdminAttributeController.create
GET    /api/admin/attributes/:id/values      AdminAttributeController.listValues
POST   /api/admin/attributes/:id/values      AdminAttributeController.createValue
GET    /api/admin/variants                   AdminVariantController.list
POST   /api/admin/variants                   AdminVariantController.create
PATCH  /api/admin/variants/:id/availability  AdminVariantController.toggleAvailability
DELETE /api/admin/variants/:id               AdminVariantController.remove
GET    /api/admin/users                      AdminUserController.list
GET    /api/admin/users/:id                  AdminUserController.getDetail
GET    /api/admin/orders                     AdminOrderController.list
GET    /api/admin/orders/:id                 AdminOrderController.getDetail
PATCH  /api/admin/orders/:id/status          AdminOrderController.updateStatus

---

## 4. Response Envelope

Success:
{ "success": true, "data": { ... } }

Paginated:
{
  "success": true,
  "data": {
    "items": [...],
    "total": 128,
    "page": 1,
    "limit": 20
  }
}

Error:
{ "success": false, "message": "Descriptive error" }

---

## 5. Service Layer Pattern

export class AdminBannerService {
  constructor() {
    this.repository = new AdminBannerRepository();
  }

  async list(filters) {
    // Build where clause, call repo, return data
  }

  async create(data) {
    // Validate, call repo, return or throw Error with .status
  }
}

Key: Throw Error with .status property (400, 404, 409, 500)

---

## 6. Repository Layer Pattern

export class AdminBannerRepository {
  async findAll(where, orderBy) {
    return prisma.banner.findMany({ where, orderBy });
  }

  async findById(id) {
    return prisma.banner.findUnique({ where: { id } });
  }

  async create(data) {
    return prisma.banner.create({ data });
  }

  async update(id, data) {
    return prisma.banner.update({ where: { id }, data });
  }

  async delete(id) {
    return prisma.banner.delete({ where: { id } });
  }
}

Key: Only Prisma calls, no business logic

---

## 7. Controller Layer Pattern

export class AdminBannerController {
  constructor() {
    this.service = new AdminBannerService();
  }

  async list(req, res) {
    try {
      const data = await this.service.list(req.query);
      res.json({ success: true, data });
    } catch (err) {
      res.status(err.status || 500).json({ 
        success: false, 
        message: err.message 
      });
    }
  }

  async create(req, res) {
    try {
      const result = await this.service.create(req.body);
      res.status(201).json({ success: true, data: result });
    } catch (err) {
      res.status(err.status || 500).json({ 
        success: false, 
        message: err.message 
      });
    }
  }
}

Key: Bind methods when registering: ctrl.list.bind(ctrl)

---

## 8. server.js Integration

Add:
import adminApiRoutes from './src/features/admin/routes/adminApiRoutes.js';
import adminGuard from './src/middleware/adminGuard.js';

app.use('/api/admin', jwtAuthenticate, adminGuard, adminApiRoutes);

---

## 9. Frontend Migration

In adminRoutes.js:
res.render('dashboard', { useApi: true });

In admin-head.ejs:
<script>window.ADMIN_USE_API = <%= useApi %>;</script>

In admin.js:
if (window.ADMIN_USE_API) {
  fetch('/api/admin/stats').then(r => r.json())...
} else {
  use window.adminMockData fallback
}

After all APIs work, remove admin-mock-data.js script tags.

---

See admin-Implementation-Plan.md for step-by-step tasks.
