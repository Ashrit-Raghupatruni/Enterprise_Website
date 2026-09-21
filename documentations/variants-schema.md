# Product Variants Schema — Database Design Document

**Version**: 1.0  
**Status**: Ready for Implementation  
**Last Updated**: September 2026

---

## Overview

This document defines the database schema for product variants with multi-dimensional attributes. The design allows products to have any number of variants, each identified by a unique combination of attribute values (e.g., Red + Size L + 256GB).

---

## Schema Models

### 1. **ProductVariant** (Core Variant Record)

`sql
CREATE TABLE "ProductVariant" (
  id                SERIAL PRIMARY KEY,
  productId         INT NOT NULL REFERENCES "Product"(id) ON DELETE CASCADE,
  
  -- Availability flag (AVAILABLE | NOT_AVAILABLE)
  -- No numeric stock quantity exposed to admin
  availability      VARCHAR(20) NOT NULL DEFAULT 'AVAILABLE',
  
  -- Price override (NULL = inherit product price)
  priceOverride     DECIMAL(10, 2),
  
  -- Track when variant was added/updated
  createdAt         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  -- Ensure each variant is unique per product
  UNIQUE (productId, id)
);
`

**Purpose**: Represents a single variant of a product. Each variant is a unique combination of attribute values.

**Key Points**:
- vailability is a flag (AVAILABLE/NOT_AVAILABLE), NOT a quantity
- priceOverride allows variant-specific pricing (e.g., 256GB costs more than 128GB)
- If priceOverride is NULL, the variant inherits the base product price
- Variants are uniquely identified by their product ID + variant ID

---

### 2. **VariantAttribute** (Dimension Definition)

`sql
CREATE TABLE "VariantAttribute" (
  id                SERIAL PRIMARY KEY,
  name              VARCHAR(100) NOT NULL UNIQUE, -- "Color", "Size", "Storage", etc.
  displayName       VARCHAR(100) NOT NULL,        -- "Color", "Colour" (localization-friendly)
  
  createdAt         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
`

**Purpose**: Defines the dimensions/attributes that can be applied to variants.

**Examples**:
| name | displayName |
|---|---|
| color | Color |
| size | Size |
| storage | Storage Capacity |
| ram | RAM |
| material | Material |

**Key Points**:
- Global registry of all possible variant dimensions
- 
ame is internal (used in code/API), displayName is user-facing
- One-time setup: create "Color", "Size", "Storage", etc.

---

### 3. **VariantAttributeValue** (Specific Values)

`sql
CREATE TABLE "VariantAttributeValue" (
  id                SERIAL PRIMARY KEY,
  attributeId       INT NOT NULL REFERENCES "VariantAttribute"(id) ON DELETE CASCADE,
  
  -- The actual value (e.g., "Red", "256GB", "L")
  value             VARCHAR(100) NOT NULL,
  
  -- Display version (e.g., "Red", "256 GB", "Large")
  displayValue      VARCHAR(100) NOT NULL,
  
  createdAt         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  -- Each attribute value must be unique per attribute
  UNIQUE (attributeId, value)
);
`

**Purpose**: Stores all possible values for each attribute.

**Examples for Attribute "color"**:
| value | displayValue |
|---|---|
| red | Red |
| blue | Blue |
| black | Black |
| silver | Silver |

**Examples for Attribute "storage"**:
| value | displayValue |
|---|---|
| 128gb | 128 GB |
| 256gb | 256 GB |
| 512gb | 512 GB |

**Key Points**:
- alue is the canonical, code-safe format (lowercase, no spaces)
- displayValue is what the customer/admin sees
- Values are unique per attribute (no duplicates like "Red" twice for color)

---

### 4. **ProductVariantAttributeMapping** (Junction Table)

`sql
CREATE TABLE "ProductVariantAttributeMapping" (
  id                SERIAL PRIMARY KEY,
  variantId         INT NOT NULL REFERENCES "ProductVariant"(id) ON DELETE CASCADE,
  attributeValueId  INT NOT NULL REFERENCES "VariantAttributeValue"(id),
  
  createdAt         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  -- A variant can have only one value per attribute
  -- e.g., iPhone can't be both "Red" and "Blue"
  UNIQUE (variantId, attributeValueId)
);
`

**Purpose**: Maps each variant to its attribute values, creating the unique combination.

**Example for iPhone 15**:
`
Variant 1:
  - attributeValue: Red (from color attribute)
  - attributeValue: 128GB (from storage attribute)
  
Variant 2:
  - attributeValue: Red (from color attribute)
  - attributeValue: 256GB (from storage attribute)
  
Variant 3:
  - attributeValue: Blue (from color attribute)
  - attributeValue: 128GB (from storage attribute)
`

**Key Points**:
- Creates the M:N relationship between variants and their attribute values
- A variant can have multiple attributes but only ONE value per attribute
- The combination of all values in a variant must be unique

---

### 5. **Updated ProductImage** (Variant-Specific Images)

`sql
-- Add variantId column to existing ProductImage table
ALTER TABLE "ProductImage" ADD COLUMN variantId INT REFERENCES "ProductVariant"(id) ON DELETE CASCADE;

-- Images can now be:
-- variantId = NULL  → Base product image (shown for all variants)
-- variantId = 123   → Specific to that variant (color-specific photo)
`

**Purpose**: Allow color-specific or variant-specific images.

**Examples**:
- Base Product (variantId = NULL): iPhone 15 hero shot
- Variant Red (variantId = 1): Close-up of Red iPhone 15
- Variant Blue (variantId = 2): Close-up of Blue iPhone 15

---

### 6. **Updated Product Model**

`sql
-- Add relation in existing Product table
ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS variants ProductVariant[];
-- (Prisma handles this as a relation, not a SQL column)
`

**Key Points**:
- Product can have 0 or more variants
- If a product has variants, customers see variant options
- If a product has no variants, it's sold as-is (base product only)

---

### 7. **Updated Order & OrderItem** (Variant Support)

`sql
CREATE TABLE "Order" (
  id                SERIAL PRIMARY KEY,
  userId            INT NOT NULL REFERENCES "User"(id) ON DELETE CASCADE,
  
  status            VARCHAR(50) NOT NULL DEFAULT 'PROCESSING',
  -- PROCESSING → CONFIRMED → OUT_FOR_DELIVERY → DELIVERED or CANCELLED
  
  totalAmount       DECIMAL(12, 2) NOT NULL,
  
  createdAt         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updatedAt         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "OrderItem" (
  id                SERIAL PRIMARY KEY,
  orderId           INT NOT NULL REFERENCES "Order"(id) ON DELETE CASCADE,
  
  productId         INT NOT NULL REFERENCES "Product"(id),
  
  -- If customer ordered a specific variant, link it here
  -- NULL = base product, >0 = specific variant
  variantId         INT REFERENCES "ProductVariant"(id),
  
  quantity          INT NOT NULL,
  priceAtPurchase   DECIMAL(10, 2) NOT NULL, -- Lock price at purchase time
  
  createdAt         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);
`

**Purpose**: Track what was ordered, including variant details.

**Examples**:
- Order Item 1: iPhone 15, Red + 128GB, qty 2 (variantId = 1)
- Order Item 2: iPhone 15, Blue + 256GB, qty 1 (variantId = 3)
- Order Item 3: iPad (no variants), qty 1 (variantId = NULL)

---

## Data Insertion Examples

### Step 1: Create Attributes
`sql
INSERT INTO "VariantAttribute" (name, displayName)
VALUES 
  ('color', 'Color'),
  ('storage', 'Storage Capacity'),
  ('ram', 'RAM');
`

### Step 2: Create Attribute Values
`sql
-- Color values
INSERT INTO "VariantAttributeValue" (attributeId, value, displayValue)
SELECT id, 'red', 'Red' FROM "VariantAttribute" WHERE name = 'color'
UNION ALL
SELECT id, 'blue', 'Blue' FROM "VariantAttribute" WHERE name = 'color';

-- Storage values
INSERT INTO "VariantAttributeValue" (attributeId, value, displayValue)
SELECT id, '128gb', '128 GB' FROM "VariantAttribute" WHERE name = 'storage'
UNION ALL
SELECT id, '256gb', '256 GB' FROM "VariantAttribute" WHERE name = 'storage';
`

### Step 3: Create Product & Variants
`sql
-- Create product
INSERT INTO "Product" (name, price, categoryId, ...)
VALUES ('iPhone 15', 79999.00, 1, ...) RETURNING id;
-- Assume product id = 10

-- Create variant: Red + 128GB
INSERT INTO "ProductVariant" (productId, availability, priceOverride)
VALUES (10, 'AVAILABLE', NULL) RETURNING id;
-- Assume variant id = 1

-- Map variant to attribute values
INSERT INTO "ProductVariantAttributeMapping" (variantId, attributeValueId)
SELECT 1, id FROM "VariantAttributeValue" WHERE value IN ('red', '128gb');
`

---

## Querying Patterns

### Find all variants of a product
`sql
SELECT v.id, v.availability, v.priceOverride,
       STRING_AGG(CONCAT(a.displayName, ': ', vav.displayValue), ', ') as attributes
FROM "ProductVariant" v
JOIN "ProductVariantAttributeMapping" pvam ON v.id = pvam.variantId
JOIN "VariantAttributeValue" vav ON pvam.attributeValueId = vav.id
JOIN "VariantAttribute" a ON vav.attributeId = a.id
WHERE v.productId = 10
GROUP BY v.id, v.availability, v.priceOverride;
`

### Find available variants
`sql
SELECT v.id, v.productId, v.availability
FROM "ProductVariant" v
WHERE v.availability = 'AVAILABLE'
ORDER BY v.productId;
`

### Get variant with full attribute details
`sql
SELECT v.id, v.productId, v.availability,
       JSON_AGG(JSON_BUILD_OBJECT(
         'attribute', a.displayName,
         'value', vav.displayValue
       )) as attributes
FROM "ProductVariant" v
JOIN "ProductVariantAttributeMapping" pvam ON v.id = pvam.variantId
JOIN "VariantAttributeValue" vav ON pvam.attributeValueId = vav.id
JOIN "VariantAttribute" a ON vav.attributeId = a.id
WHERE v.id = 1
GROUP BY v.id, v.productId, v.availability;
`

---

## Migration Path

1. **Create new tables** (ProductVariant, VariantAttribute, VariantAttributeValue, ProductVariantAttributeMapping)
2. **Populate reference data** (Create "Color", "Size", "Storage" attributes and their values)
3. **Link existing products** (Create variants for existing products, if needed)
4. **Update ProductImage** (Add variantId column, migrate color-specific images)
5. **Create Order & OrderItem** (New tables for order tracking)
6. **Prisma schema update** (Add all new models to schema.prisma)
7. **Run prisma migrate and prisma generate**

---

## Constraints & Validation

### Database Level
- ProductVariant.availability must be in ('AVAILABLE', 'NOT_AVAILABLE')
- ProductVariantAttributeMapping enforces unique (variantId, attributeValueId)
- Cascade deletes: deleting a product deletes all its variants and variant images
- Cascade deletes: deleting an attribute deletes all its values

### Application Level (Service Layer)
- When toggling variant availability, validate input
- When creating a variant, ensure all required attributes are provided
- When deleting a variant, log the action (for audit trail)
- Price override must be > 0 if provided

---

## Performance Considerations

- **Index on ProductVariant.productId** — for fast variant lookup by product
- **Index on ProductVariantAttributeMapping.variantId** — for fast attribute lookup by variant
- **Index on VariantAttributeValue.attributeId** — for fast value lookup
- **Composite index on ProductVariantAttributeMapping.(variantId, attributeValueId)** — enforces uniqueness and improves query speed

---

