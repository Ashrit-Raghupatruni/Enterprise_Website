# Admin Panel Backend — Quick Start Guide

**Status**: Ready to Code  
**Total Docs**: 4 files in documentations/  
**Estimated Time**: 12 hours (5 sprints)

---

## 📖 Documentation Files

### 1. **admin-HLD.md** ← START HERE
   - **What**: High-level overview, objectives, scope, architecture
   - **For**: Understanding the big picture
   - **Read time**: 10 minutes
   - **Covers**: 11 objectives overview, why we're doing this

### 2. **admin-LLD.md** ← THEN READ THIS
   - **What**: Low-level technical design, API contracts, code patterns
   - **For**: Understanding exact endpoints, request/response formats, database models
   - **Read time**: 30 minutes
   - **Covers**: File structure, Prisma schema (exact SQL changes), 25 API endpoints with examples, error handling

### 3. **admin-Implementation-Plan.md** ← THEN YOUR TODO LIST
   - **What**: Step-by-step tasks split into 5 sprints
   - **For**: Your coding checklist
   - **Read time**: 20 minutes
   - **Covers**: 28 tasks in order, estimated hours per task, definition of done

### 4. **variants-schema.md** ← REFERENCE ONLY
   - **What**: Deep dive into variant database design
   - **For**: Understanding variant relationships, SQL queries, migration examples
   - **Read time**: 15 minutes (skim as needed)
   - **Covers**: Variant tables, example queries, constraints

---

## 🚀 Your Next Step

Choose ONE:

**Option A: Deep Dive** (15 min)
1. Read admin-HLD.md (understand why)
2. Read admin-LLD.md (understand what)
3. Start coding Task 1.1

**Option B: Quick Start** (5 min)
1. Skim admin-HLD.md §4-5 (architecture + design decisions)
2. Skip to admin-Implementation-Plan.md Task 1.1
3. Use admin-LLD.md as reference while coding

**Option C: Variant-Focused** (10 min)
1. Read admin-HLD.md §5.2 (variants overview)
2. Read variants-schema.md §1-3 (schema models)
3. Read admin-Implementation-Plan.md §Sprint 4 (variant tasks)

---

## 📋 Your Task Checklist

Copy this into your project tracker:

**Sprint 1 — Foundation** (1.5h)
- [ ] Task 1.1: Update Prisma schema
- [ ] Task 1.2: Run migration
- [ ] Task 1.3: Create adminGuard.js
- [ ] Task 1.4: Scaffold adminApiRoutes.js
- [ ] Task 1.5: Mount routes in server.js

**Sprint 2 — Read APIs** (3h)
- [ ] Task 2.1: Stats (repository, service, controller)
- [ ] Task 2.2: Banner list
- [ ] Task 2.3: Product list
- [ ] Task 2.4: User list + detail
- [ ] Task 2.5: Order list + detail

**Sprint 3 — Write APIs** (3h)
- [ ] Task 3.1: Banner CRUD writes
- [ ] Task 3.2: Product CRUD writes
- [ ] Task 3.3: Product visibility PATCH
- [ ] Task 3.4: Order status PATCH

**Sprint 4 — Variants** (3h)
- [ ] Task 4.1: Variant attributes CRUD
- [ ] Task 4.2: Seed default attributes
- [ ] Task 4.3: Variant CRUD

**Sprint 5 — Frontend** (1.5h)
- [ ] Task 5.1-5.8: Wire all pages, remove mock data

---

## 💡 Key Takeaways

### Architecture
`
admin.js (frontend)
    ↓ fetch('/api/admin/*')
Express router with jwtAuthenticate + adminGuard
    ↓
Controller (HTTP handling)
    ↓
Service (business logic)
    ↓
Repository (Prisma queries)
    ↓
PostgreSQL
`

### Stock Visibility
- **No numeric quantities** — only AVAILABLE / NOT_AVAILABLE flags
- **Product level**: base availability
- **Variant level**: each variant has independent availability

### Variants
- **Multi-dimensional**: e.g., Red + 128GB + 8GB RAM
- **Per-variant control**: toggle each variant independently
- **Global attributes**: Color, Size, Storage, RAM (defined once, used by all products)

### File Pattern (from existing codebase)
- Class-based: \xport class AdminBannerController {}\
- Route binding: \ctrl.list.bind(ctrl)\
- Error handling: \	hrow new Error(msg); err.status = 400\
- Prisma import: \import prisma from '../../../config/prisma.js'\

---

## ⚡ Getting Started NOW

### First, prepare your schema:

1. Open \prisma/schema.prisma\
2. Follow **admin-LLD.md §2** (exact changes to make)
3. Run migration:
   \\\ash
   npx prisma migrate dev --name admin_panel_with_variants
   npx prisma generate
   \\\

### Then, scaffold middleware:

4. Create \src/middleware/adminGuard.js\ (copy from admin-LLD.md §3)
5. Create \src/features/admin/routes/adminApiRoutes.js\ (scaffold from admin-LLD.md §4)

### Then, wire server:

6. Open \server.js\ and add admin routes (3 lines from admin-LLD.md §10)

### Test it:

7. Start server: \
pm run dev\
8. Try: \curl -H "Cookie: authToken=..." http://localhost:3000/api/admin/stats\
   - No cookie → 401
   - USER role → 403
   - ADMIN role → 200 { success: true, message: 'TODO' }

---

## 🎯 Success Criteria

You're done when:
- ✅ All 25 endpoints built and tested
- ✅ Admin panel renders live data (no mock data)
- ✅ Variants work with multi-dimensional attributes
- ✅ Each variant can toggle availability independently
- ✅ Orders track variant details
- ✅ All CRUD operations persist to Neon PostgreSQL

---

## 📞 Questions?

If stuck:
1. Check the error in admin-LLD.md §9 (Error Handling)
2. Check the exact API contract in admin-LLD.md §5
3. Check the repository pattern in admin-LLD.md §7

Good luck! 🚀

