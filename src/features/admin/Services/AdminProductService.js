import { AdminProductRepository } from '../repositories/AdminProductRepository.js';
import { uploadImageSource } from '../../../config/cloudinary.js';

export class AdminProductService {
  constructor() {
    this.repository = new AdminProductRepository();
  }

  _resolveProductCategoryFolder(category) {
    if (!category) return 'enterprise_store/products';
    const cat = String(category).toLowerCase().trim();
    if (cat.includes('ac') || cat.includes('air condition')) return 'enterprise_store/products/acs';
    if (cat.includes('mobile') || cat.includes('phone')) return 'enterprise_store/products/mobiles';
    if (cat.includes('tv') || cat.includes('television')) return 'enterprise_store/products/tvs';
    if (cat.includes('refrigerat') || cat.includes('fridge')) return 'enterprise_store/products/refrigerators';
    if (cat.includes('theatre') || cat.includes('theater')) return 'enterprise_store/products/home-theatres';
    if (cat.includes('kitchen') || cat.includes('appliance')) return 'enterprise_store/products/kitchen';

    const cleanSlug = cat.replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    return cleanSlug ? `enterprise_store/products/${cleanSlug}` : 'enterprise_store/products';
  }

  /**
   * Helper: Resolve raw image list (uploading base64 to Cloudinary if necessary)
   */
  async _resolveProductImageList(images, category = '') {
    if (!Array.isArray(images) || images.length === 0) {
      return [];
    }

    const folder = this._resolveProductCategoryFolder(category);
    const resolved = [];
    let hasPrimary = false;

    for (let i = 0; i < images.length; i++) {
      const item = images[i];
      let url = typeof item === 'string' ? item : (item.url || item.imageUrl);
      const isPrimary = typeof item === 'object' ? !!item.isPrimary : (i === 0);

      if (!url || typeof url !== 'string') continue;
      url = url.trim();
      if (!url) continue;

      // If it's a base64 data URI, upload to Cloudinary in the category folder
      if (url.startsWith('data:image/')) {
        try {
          const uploadRes = await uploadImageSource(url, { folder });
          url = uploadRes.secure_url || uploadRes.url;
        } catch (err) {
          console.error('Failed to upload product image to Cloudinary:', err);
          throw new Error(`Cloudinary upload failed for image #${i + 1}: ${err.message}`);
        }
      }

      if (isPrimary) hasPrimary = true;
      resolved.push({
        imageUrl: url,
        isPrimary
      });
    }

    // Ensure at least one image is marked primary
    if (resolved.length > 0 && !hasPrimary) {
      resolved[0].isPrimary = true;
    }

    return resolved;
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
   * Optional: availability, images, stock
   */
  async create(data) {
    try {
      const categoryIdentifier = data.categoryId || data.category;

      // Validate required fields
      if (!data.name || !data.description || !data.brand || !data.price || !categoryIdentifier || !data.slug) {
        const error = new Error('Missing required fields: name, description, brand, price, categoryId/category, slug');
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

      // Check if slug already exists
      const slugExists = await this.repository.findBySlug(data.slug);
      if (slugExists) {
        const error = new Error('Product slug already exists');
        error.status = 409;
        throw error;
      }

      // Check if category exists
      const category = await this.repository.categoryExists(categoryIdentifier);
      if (!category) {
        const error = new Error(`Category "${categoryIdentifier}" not found`);
        error.status = 404;
        throw error;
      }

      const createData = {
        name: data.name,
        description: data.description,
        brand: data.brand,
        price: data.price,
        categoryId: category.id,
        slug: data.slug,
        availability: data.availability || 'AVAILABLE',
        stock: data.stock !== undefined ? Math.max(0, parseInt(data.stock, 10) || 0) : 0
      };

      const rawImages = data.images || data.productImages;
      if (Array.isArray(rawImages) && rawImages.length > 0) {
        const resolvedImages = await this._resolveProductImageList(rawImages, category.name || data.category);
        if (resolvedImages.length > 0) {
          createData.productImages = {
            create: resolvedImages
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
        const slugExists = await this.repository.findBySlug(data.slug);
        if (slugExists && slugExists.id !== id) {
          const error = new Error('Product slug already exists');
          error.status = 409;
          throw error;
        }
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

      // If images are provided in update payload, resolve & sync them
      const rawImages = data.images || data.productImages;
      if (Array.isArray(rawImages)) {
        const categoryName = categoryIdentifier || existing.category?.name || '';
        const resolvedImages = await this._resolveProductImageList(rawImages, categoryName);
        updateData.productImages = {
          deleteMany: {},
          create: resolvedImages
        };
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
