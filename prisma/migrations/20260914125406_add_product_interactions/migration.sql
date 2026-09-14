-- CreateEnum
CREATE TYPE "InteractionType" AS ENUM ('PRODUCT_VIEW', 'WISHLIST_ADD', 'CART_ADD', 'PURCHASE');

-- CreateTable
CREATE TABLE "ProductInteraction" (
    "id" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "userId" TEXT,
    "sessionId" TEXT,
    "type" "InteractionType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProductInteraction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ProductInteraction_productId_idx" ON "ProductInteraction"("productId");

-- CreateIndex
CREATE INDEX "ProductInteraction_type_idx" ON "ProductInteraction"("type");

-- CreateIndex
CREATE INDEX "ProductInteraction_createdAt_idx" ON "ProductInteraction"("createdAt");

-- CreateIndex
CREATE INDEX "ProductInteraction_userId_idx" ON "ProductInteraction"("userId");

-- AddForeignKey
ALTER TABLE "ProductInteraction" ADD CONSTRAINT "ProductInteraction_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
