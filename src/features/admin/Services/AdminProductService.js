import { AdminProductRepository } from '../repositories/AdminProductRepository.js';

export class AdminProductService {
  constructor() {
    this.repository = new AdminProductRepository();
  }

  /**
   * List products with filters and pagination
   * Query params: search, category, page (default 1), limit (default 20)
   */
  async list(filters = {}) {
    try {
      const where = {};

      // Search by product name, description, or brand
      if (filters.search) {
        where.OR = [
          { name: { contains: filters.search, mode: 'insensitive' } },
          { description: { contains: filters.search, mode: 'insensitive' } },
          { brand: { contains: filters.search, mode: 'insensitive' } }
        ];
      }

      // Filter by category
      if (filters.category) {
        where.category = {
          name: { contains: filters.category, mode: 'insensitive' }
        };
      }

      // Pagination
      const page = Math.max(1, parseInt(filters.page) || 1);
      const limit = Math.min(100, Math.max(1, parseInt(filters.limit) || 20));
      const skip = (page - 1) * limit;

      const { products, total } = await this.repository.findAll(where, skip, limit);

      return {
        success: true,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit)
        },
        count: products.length,
        data: products
      };
    } catch (err) {
      const error = new Error(`Failed to fetch products: ${err.message}`);
      error.status = 500;
      throw error;
    }
  }

  /**
   * Create a new product
   * Required: name, description, brand, price, categoryId or category, slug
   * Optional: availability, images
   */
  async create(data) {
    try {
      const categoryIdentifier = data.categoryId || data.category;

      // Validate required core fields with specific messages
      const missing = [];
      if (!data.name || !String(data.name).trim()) missing.push('name');
      if (!data.brand || !String(data.brand).trim()) missing.push('brand');
      if (data.price === undefined || data.price === null || data.price === '') missing.push('price');
      if (!categoryIdentifier) missing.push('category');

      if (missing.length > 0) {
        const error = new Error(`Missing required fields: ${missing.join(', ')}`);
        error.status = 400;
        throw error;
      }

      // Validate price is a positive number
      const price = parseFloat(data.price);
      if (isNaN(price) || price <= 0) {
        const error = new Error('Price must be a positive number');
        error.status = 400;
        throw error;
      }

      // Auto-generate slug if omitted or blank
      let slug = (data.slug && String(data.slug).trim())
        ? String(data.slug).trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
        : String(data.name).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

      if (!slug) {
        slug = `prod-${Date.now()}`;
      }

      // Check if slug exists; append short unique suffix if needed
      const slugExists = await this.repository.findBySlug(slug);
      if (slugExists) {
        slug = `${slug}-${Math.random().toString(36).substring(2, 6)}`;
      }

      // Check if category exists
      const category = await this.repository.categoryExists(categoryIdentifier);
      if (!category) {
        const error = new Error(`Category "${categoryIdentifier}" not found`);
        error.status = 404;
        throw error;
      }

      // Ensure description is never blank (Prisma schema requires non-null String)
      const description = (data.description && String(data.description).trim())
        ? String(data.description).trim()
        : `${String(data.name).trim()} - Official ${String(data.brand).trim()} product.`;

      const createData = {
        name: String(data.name).trim(),
        description,
        brand: String(data.brand).trim(),
        price: data.price,
        categoryId: category.id,
        slug,
        availability: data.availability || 'AVAILABLE',
        stock: data.stock !== undefined ? Math.max(0, parseInt(data.stock, 10) || 0) : 0
      };

      const rawImages = data.images || data.productImages;
      if (Array.isArray(rawImages)) {
        const validImages = rawImages.filter(img => {
          const url = typeof img === 'string' ? img : (img?.url || img?.imageUrl);
          return url && typeof url === 'string' && url.trim().length > 0;
        });

        if (validImages.length > 0) {
          const hasPrimary = validImages.some(img => typeof img === 'object' && img.isPrimary);
          createData.productImages = {
            create: validImages.map((img, idx) => ({
              imageUrl: (typeof img === 'string' ? img : (img.url || img.imageUrl)).trim(),
              isPrimary: typeof img === 'object' ? (hasPrimary ? !!img.isPrimary : idx === 0) : (idx === 0)
            }))
          };
        }
      }

      // Create product
      const product = await this.repository.create(createData);

      return {
        success: true,
        message: 'Product created successfully',
        data: product
      };
    } catch (err) {
      const error = err.status ? err : new Error(`Failed to create product: ${err.message}`);
      if (!error.status) error.status = 500;
      throw error;
    }
  }

  /**
   * Update a product
   */
  async update(id, data) {
    try {
      // Check if product exists
      const existing = await this.repository.findById(id);
      if (!existing) {
        const error = new Error('Product not found');
        error.status = 404;
        throw error;
      }

      // Validate price if being updated
      if (data.price !== undefined) {
        const price = parseFloat(data.price);
        if (isNaN(price) || price <= 0) {
          const error = new Error('Price must be a positive number');
          error.status = 400;
          throw error;
        }
      }

      // If slug is being updated, check for duplicates
      if (data.slug && data.slug !== existing.slug) {
        const cleanSlug = String(data.slug).trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const slugExists = await this.repository.findBySlug(cleanSlug);
        if (slugExists && slugExists.id !== id) {
          const error = new Error('Product slug already exists');
          error.status = 409;
          throw error;
        }
        data.slug = cleanSlug;
      }

      const updateData = { ...data };
      delete updateData.category;
      delete updateData.images;
      delete updateData.productImages;

      if (data.stock !== undefined) {
        updateData.stock = Math.max(0, parseInt(data.stock, 10) || 0);
        if (updateData.stock === 0 && !data.availability) {
          updateData.availability = 'NOT_AVAILABLE';
        }
      }

      // If category or categoryId is being updated, check if category exists
      const categoryIdentifier = data.categoryId || data.category;
      if (categoryIdentifier) {
        const category = await this.repository.categoryExists(categoryIdentifier);
        if (!category) {
          const error = new Error(`Category "${categoryIdentifier}" not found`);
          error.status = 404;
          throw error;
        }
        updateData.categoryId = category.id;
      }

      // Update images if provided
      const rawImages = data.images || data.productImages;
      if (Array.isArray(rawImages)) {
        await this.repository.updateImages(id, rawImages);
      }

      const product = await this.repository.update(id, updateData);

      return {
        success: true,
        message: 'Product updated successfully',
        data: product
      };
    } catch (err) {
      const error = err.status ? err : new Error(`Failed to update product: ${err.message}`);
      if (!error.status) error.status = 500;
      throw error;
    }
  }

  /**
   * Delete a product
   */
  async remove(id) {
    try {
      // Check if product exists
      const existing = await this.repository.findById(id);
      if (!existing) {
        const error = new Error('Product not found');
        error.status = 404;
        throw error;
      }

      await this.repository.remove(id);

      return {
        success: true,
        message: 'Product deleted successfully'
      };
    } catch (err) {
      const error = err.status ? err : new Error(`Failed to delete product: ${err.message}`);
      if (!error.status) error.status = 500;
      throw error;
    }
  }

  /**
   * Toggle product visibility (AVAILABLE ↔ NOT_AVAILABLE)
   */
  async toggleVisibility(id) {
    try {
      const product = await this.repository.findById(id);

      if (!product) {
        const error = new Error('Product not found');
        error.status = 404;
        throw error;
      }

      const newAvailability = product.availability === 'AVAILABLE' ? 'NOT_AVAILABLE' : 'AVAILABLE';

      const updated = await this.repository.update(id, {
        availability: newAvailability
      });

      return {
        success: true,
        message: `Product availability changed to ${newAvailability}`,
        data: updated
      };
    } catch (err) {
      const error = err.status ? err : new Error(`Failed to toggle visibility: ${err.message}`);
      if (!error.status) error.status = 500;
      throw error;
    }
  }
}
