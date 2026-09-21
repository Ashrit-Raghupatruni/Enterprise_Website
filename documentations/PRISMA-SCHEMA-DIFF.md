# Prisma Schema — Exact Changes (Copy-Paste Ready)

**File**: \prisma/schema.prisma\

This document shows the EXACT lines to add/modify in your current schema.

---

## Current Schema (What You Have)

\\\prisma
model User {
  id            String   @id @default(cuid())
  username      String
  email         String   @unique
  password_hash String
  gender        Gender?
  role          Role     @default(USER)
  created_at    DateTime @default(now())
  updated_at    DateTime @updatedAt
  phone_number  String   @unique

  addresses     Address[]
}

model Product {
  id              String @id @default(cuid())
  categoryId      String
  name            String
  description     String
  brand           String
  price           Decimal
  availability    Status
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  slug            String @unique
  category        Category @relation(fields:[categoryId],references:[id],onDelete:Cascade)
  productImages   ProductImage[]
  interactions    ProductInteraction[]

  @@index([categoryId])
}

model ProductImage {
  id              String @id @default(cuid())
  productId       String
  imageUrl        String
  isPrimary       Boolean @default(false)
  createdAt       DateTime @default(now())

  product         Product @relation(fields:[productId],references:[id],onDelete:Cascade)

  @@index([productId])
}

enum Status {
  AVAILABLE
  NOT_AVAILABLE
}
\\\

---

## Changes to Make (In Order)

### Change 1: Update \User\ Model

**FIND THIS**:
\\\prisma
model User {
  id            String   @id @default(cuid())
  username      String
  email         String   @unique
  password_hash String
  gender        Gender?
  role          Role     @default(USER)
  created_at    DateTime @default(now())
  updated_at    DateTime @updatedAt
  phone_number  String   @unique

  addresses     Address[]
}
\\\

**REPLACE WITH**:
\\\prisma
model User {
  id            String   @id @default(cuid())
  username      String
  email         String   @unique
  password_hash String
  gender        Gender?
  role          Role     @default(USER)
  created_at    DateTime @default(now())
  updated_at    DateTime @updatedAt
  phone_number  String   @unique

  addresses     Address[]
  orders        Order[]

  @@index([email])
}
\\\

---

### Change 2: Update \Product\ Model

**FIND THIS**:
\\\prisma
model Product {
  id              String @id @default(cuid())
  categoryId      String
  name            String
  description     String
  brand           String
  price           Decimal
  availability    Status
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  slug            String @unique
  category        Category @relation(fields:[categoryId],references:[id],onDelete:Cascade)
  productImages   ProductImage[]
  interactions    ProductInteraction[]

  @@index([categoryId])
}
\\\

**REPLACE WITH**:
\\\prisma
model Product {
  id              String @id @default(cuid())
  categoryId      String
  name            String
  description     String
  brand           String
  price           Decimal
  availability    Status @default(AVAILABLE)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  slug            String @unique
  category        Category @relation(fields:[categoryId],references:[id],onDelete:Cascade)
  productImages   ProductImage[]
  interactions    ProductInteraction[]
  variants        ProductVariant[]
  orderItems      OrderItem[]

  @@index([categoryId])
}
\\\

---

### Change 3: Update \ProductImage\ Model

**FIND THIS**:
\\\prisma
model ProductImage {
  id              String @id @default(cuid())
  productId       String
  imageUrl        String
  isPrimary       Boolean @default(false)
  createdAt       DateTime @default(now())

  product         Product @relation(fields:[productId],references:[id],onDelete:Cascade)

  @@index([productId])
}
\\\

**REPLACE WITH**:
\\\prisma
model ProductImage {
  id              String @id @default(cuid())
  productId       String
  imageUrl        String
  isPrimary       Boolean @default(false)
  createdAt       DateTime @default(now())
  variantId       String?

  product         Product @relation(fields:[productId],references:[id],onDelete:Cascade)
  variant         ProductVariant? @relation(fields:[variantId],references:[id],onDelete:Cascade)

  @@index([productId])
  @@index([variantId])
}
\\\

---

### Change 4: Add New Enums (BEFORE the models section)

**ADD THIS** (after the existing \Status\ enum, before \Gender\ or any model):
\\\prisma
enum BannerStatus {
  ACTIVE
  INACTIVE
}

enum OrderStatus {
  PROCESSING
  CONFIRMED
  OUT_FOR_DELIVERY
  DELIVERED
  CANCELLED
}
\\\

---

### Change 5: Add New Models (AT THE END of the file, after ProductInteraction)

**ADD ALL OF THIS** at the very end of your schema.prisma:

\\\prisma
// ─── VARIANT ATTRIBUTES ──────────────────────────────────────────────────────

model VariantAttribute {
  id          String @id @default(cuid())
  name        String @unique
  displayName String

  values      VariantAttributeValue[]

  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
}

model VariantAttributeValue {
  id          String @id @default(cuid())
  attributeId String
  attribute   VariantAttribute @relation(fields: [attributeId], references: [id], onDelete: Cascade)

  value           String
  displayValue    String

  variants        ProductVariant[]

  @@unique([attributeId, value])
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}

// ─── PRODUCT VARIANTS ────────────────────────────────────────────────────────

model ProductVariant {
  id              String @id @default(cuid())
  productId       String
  product         Product @relation(fields: [productId], references: [id], onDelete: Cascade)

  availability    Status @default(AVAILABLE)
  priceOverride   Decimal? @db.Decimal(10, 2)

  attributeValues VariantAttributeValue[]
  images          ProductImage[]
  orderItems      OrderItem[]

  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@index([productId])
}

// ─── BANNERS ─────────────────────────────────────────────────────────────────

model Banner {
  id           String        @id @default(cuid())
  title        String
  eyebrow      String
  subtitle     String        @default("")
  ctaText      String
  slug         String
  badge        String?
  status       BannerStatus  @default(ACTIVE)
  bgGradient   String        @default("linear-gradient(135deg, #0d1e4d 0%, #1e3d8f 100%)")
  accentColor  String        @default("#f58500")
  displayOrder Int           @default(0)
  clicks       Int           @default(0)
  createdAt    DateTime      @default(now())
  updatedAt    DateTime      @updatedAt
}

// ─── ORDERS ──────────────────────────────────────────────────────────────────

model Order {
  id              String      @id @default(cuid())
  shortId         String      @unique
  userId          String
  status          OrderStatus @default(PROCESSING)
  subtotal        Decimal     @db.Decimal(12, 2)
  discountAmount  Decimal     @default(0)
  deliveryFee     Decimal     @default(0)
  totalAmount     Decimal     @db.Decimal(12, 2)
  paymentMethod   String
  paymentStatus   String      @default("Pending")
  shippingAddress String
  deliveryDate    String?
  createdAt       DateTime    @default(now())
  updatedAt       DateTime    @updatedAt

  user            User        @relation(fields: [userId], references: [id], onDelete: Cascade)
  items           OrderItem[]

  @@index([userId])
  @@index([status])
}

model OrderItem {
  id                 String   @id @default(cuid())
  orderId            String
  productId          String
  productName        String
  variantDescription String   @default("")
  unitPrice          Decimal  @db.Decimal(10, 2)
  quantity           Int
  lineTotal          Decimal  @db.Decimal(12, 2)
  createdAt          DateTime @default(now())

  order              Order    @relation(fields: [orderId], references: [id], onDelete: Cascade)
  product            Product  @relation(fields: [productId], references: [id])

  @@index([orderId])
  @@index([productId])
}
\\\

---

## Validation Checklist

After making changes, run:

\\\ash
npx prisma validate
\\\

Expected output:
\\\
✓ Your schema is valid
\\\

If you get errors:
- Check for missing commas
- Check for typos in model/field names
- Check that all brackets are balanced

---

## Migration

Once schema validates:

\\\ash
npx prisma migrate dev --name admin_panel_with_variants
npx prisma generate
\\\

This will:
1. Create migration file (timestamped in \prisma/migrations/\)
2. Run SQL against Neon PostgreSQL
3. Regenerate Prisma Client

**Verify**:
- Check Neon dashboard — new tables should appear
- \
px prisma studio\ — browse the new models

---

## If Migration Fails

Common issues:

**Issue**: \elation "\" does not exist\
- **Fix**: Make sure User, Product, Category tables exist (they should)

**Issue**: \duplicate key violates unique constraint\
- **Fix**: Your migration ran twice; clear it and re-run

**Issue**: Type mismatch errors
- **Fix**: Check field types (Decimal vs Int, String vs Boolean)

If stuck, share the full error and I'll help debug.

---

