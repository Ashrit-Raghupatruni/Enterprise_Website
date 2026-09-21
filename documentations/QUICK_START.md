# Quick Start — Admin Panel

## 5 Minutes to Live Admin Panel

### Step 1: Database Migration
```bash
npx prisma migrate dev
```
This creates all admin tables automatically.

### Step 2: Seed Sample Data
```bash
npm run seed:admin
```
Creates 4 banners, 6 products, 4 orders with realistic data.

### Step 3: Start Server
```bash
npm run dev
```

### Step 4: Access Admin
1. Create admin user (via signup or seed script)
2. Login and get JWT token
3. Use token to access `/api/admin/*` endpoints

---

## API Endpoints Quick Reference

### All require: `Authorization: Bearer <JWT_TOKEN>` header

#### Statistics
```
GET /api/admin/stats
```

#### Banners
```
GET    /api/admin/banners                    # List
POST   /api/admin/banners                    # Create
PUT    /api/admin/banners/:id                # Update
PATCH  /api/admin/banners/:id/toggle         # Toggle status
DELETE /api/admin/banners/:id                # Delete
```

#### Products
```
GET    /api/admin/products                        # List
POST   /api/admin/products                        # Create
PUT    /api/admin/products/:id                    # Update
PATCH  /api/admin/products/:id/visibility         # Toggle visibility
DELETE /api/admin/products/:id                    # Delete
```

#### Users
```
GET /api/admin/users        # List all users
GET /api/admin/users/:id    # Get user detail with addresses & orders
```

#### Orders
```
GET    /api/admin/orders          # List all orders
GET    /api/admin/orders/:id      # Get order detail
PATCH  /api/admin/orders/:id/status  # Update status
```

#### Attributes & Variants
```
GET    /api/admin/attributes                  # List all attributes
POST   /api/admin/attributes                  # Create attribute
GET    /api/admin/attributes/:id/values       # List attribute values
POST   /api/admin/attributes/:id/values       # Create value

GET    /api/admin/variants                    # List variants
POST   /api/admin/variants                    # Create variant
PATCH  /api/admin/variants/:id/availability   # Toggle availability
DELETE /api/admin/variants/:id                # Delete variant
```

---

## Common Requests

### Get Statistics
```bash
curl -X GET http://localhost:3001/api/admin/stats \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Create Banner
```bash
curl -X POST http://localhost:3001/api/admin/banners \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My Banner",
    "eyebrow": "New",
    "ctaText": "Shop Now",
    "slug": "my-banner",
    "status": "ACTIVE"
  }'
```

### List Products (with filters)
```bash
curl -X GET "http://localhost:3001/api/admin/products?search=iphone&category=mobiles&page=1&limit=20" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Update Order Status
```bash
curl -X PATCH http://localhost:3001/api/admin/orders/ORDER_ID/status \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status": "DELIVERED"}'
```

---

## Enable Live API on Frontend

In your admin page render routes, pass `useApi: true`:

```javascript
app.get('/admin/dashboard', (req, res) => {
  res.render('admin/dashboard', { useApi: true });
});
```

The frontend will automatically:
- Fetch real data from APIs
- Handle CRUD operations
- Show toast notifications
- Keep the existing design

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Migration fails | Run `npx prisma migrate reset` (clears DB), then `npx prisma migrate dev` |
| API returns 403 | Check user has `role: 'ADMIN'`, verify JWT token |
| Seed script fails | Ensure migration ran, check database connection |
| Frontend not using API | Verify `window.ADMIN_USE_API === true` in browser console |

---

## What's Included

✅ 25 REST API endpoints
✅ Full CRUD operations
✅ Search & filtering
✅ Pagination
✅ Real-time statistics
✅ Multi-dimensional variants
✅ Order tracking
✅ Toast notifications
✅ Comprehensive validation
✅ Production-ready code

---

## Next Steps

1. **Test the API** → Use Postman to explore endpoints
2. **Enable frontend** → Set `useApi: true` in routes
3. **Customize data** → Edit seed scripts for your needs
4. **Deploy** → Set `NODE_ENV=production` for live

---

**Status**: Ready to use! 🚀
