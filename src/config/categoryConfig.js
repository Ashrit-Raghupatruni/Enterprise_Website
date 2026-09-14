/**
 * categoryConfig.js — Central category availability configuration.
 *
 * INACTIVE_CATEGORIES lists category slugs that are temporarily unavailable
 * in the showroom. These categories exist in the database and codebase but
 * are hidden from all customer-facing UI surfaces.
 *
 * To re-enable a category: remove its slug from this array.
 * Future: replace this array with an Admin Panel toggle stored in the DB.
 *
 * Affected surfaces (all controlled from here):
 *   - /products/:slug  → redirects to /products with a notice
 *   - Home page carousels        → section not rendered
 *   - Home category strip        → item not rendered
 *   - Category page strip        → item not rendered
 *   - Category PLP static data   → cleared to []
 */
export const INACTIVE_CATEGORIES = [
  'kitchen',
  'refrigerators',
];

/**
 * Returns true when the given route slug belongs to an inactive category.
 * @param {string} slug  — the URL slug, e.g. 'kitchen'
 */
export function isCategoryInactive(slug) {
  return INACTIVE_CATEGORIES.includes(slug);
}
