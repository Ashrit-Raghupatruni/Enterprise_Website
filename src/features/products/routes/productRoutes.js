import express from "express";
import jwt from "jsonwebtoken";
import "dotenv/config";
import { ProductController } from "../controllers/productController.js";

const router = express.Router();
const productController = new ProductController();

// ─── Trending Deals ───────────────────────────────────────────────────────────
// Must be registered BEFORE /:id so the literal path "trending" is not
// captured as a product id parameter.

// GET /api/products/trending?limit=10
// Returns top trending products by weighted time-decayed interaction score.
// Inactive-category products are always excluded.
router.get(
  "/products/trending",
  productController.getTrendingProducts.bind(productController)
);

// POST /api/products/:id/interaction
// Body: { type: "PRODUCT_VIEW" | "WISHLIST_ADD" | "CART_ADD" | "PURCHASE" }
// Soft auth: if a valid JWT cookie is present we attach req.user so the
// interaction is tied to the user. Missing/invalid token → guest mode.
router.post(
  "/products/:id/interaction",
  (req, res, next) => {
    try {
      const header = req.headers.cookie || "";
      const match  = header.split(";").map(c => c.trim()).find(c => c.startsWith("authToken="));
      if (match) {
        const token = decodeURIComponent(match.slice("authToken=".length));
        req.user    = jwt.verify(token, process.env.JWT_SECRET);
      }
    } catch (_) { /* token absent or invalid — proceed as guest */ }
    next();
  },
  productController.recordInteraction.bind(productController)
);

// ─── Existing product routes ──────────────────────────────────────────────────
router.get("/products", productController.getProducts.bind(productController));
router.get("/products/category/:category", productController.getProductsByCategory.bind(productController));
router.get("/products/:id", productController.getProductByIdOrSlug.bind(productController));

export default router;
