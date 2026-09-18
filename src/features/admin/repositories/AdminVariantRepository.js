import prisma from '../../../config/prisma.js';

export class AdminVariantRepository {
  /**
   * Find all variants with filters and pagination
   */
  async findAll(where = {}, skip = 0, take = 20, orderBy = { createdAt: 'desc' }) {
    const variants = await prisma.productVariant.findMany({
      where,
      skip,
      take,
      orderBy,
      select: {
        id: true,
        productId: true,
        availability: true,
        priceOverride: true,
        createdAt: true,
        updatedAt: true,
        product: {
          select: {
            id: true,
            name: true,
            price: true
          }
        },
        attributeValues: {
          select: {
            id: true,
            value: true,
            displayValue: true,
            attribute: {
              select: {
                id: true,
                name: true,
                displayName: true
              }
            }
          }
        },
        _count: {
          select: {
            images: true,
            orderItems: true
          }
        }
      }
    });

    const total = await prisma.productVariant.count({ where });

    return {
      variants: variants.map(v => ({
        ...v,
        imageCount: v._count.images,
        orderCount: v._count.orderItems,
        _count: undefined
      })),
      total
    };
  }

  /**
   * Find variant by ID with all relations
   */
  async findById(id) {
    return prisma.productVariant.findUnique({
      where: { id },
      select: {
        id: true,
        productId: true,
        availability: true,
        priceOverride: true,
        createdAt: true,
        updatedAt: true,
        product: {
          select: {
            id: true,
            name: true,
            price: true,
            slug: true
          }
        },
        attributeValues: {
          select: {
            id: true,
            value: true,
            displayValue: true,
            attribute: {
              select: {
                id: true,
                name: true,
                displayName: true
              }
            }
          }
        },
        images: {
          select: {
            id: true,
            imageUrl: true,
            isPrimary: true
          }
        },
        _count: {
          select: {
            orderItems: true
          }
        }
      }
    });
  }

  /**
   * Create a new variant
   */
  async create(data) {
    const { productId, availability, priceOverride, attributeValueIds } = data;

    return prisma.productVariant.create({
      data: {
        productId,
        availability: availability || 'AVAILABLE',
        priceOverride: priceOverride || null,
        attributeValues: {
          connect: attributeValueIds.map(id => ({ id }))
        }
      },
      select: {
        id: true,
        productId: true,
        availability: true,
        priceOverride: true,
        createdAt: true,
        updatedAt: true,
        product: {
          select: {
            id: true,
            name: true,
            price: true
          }
        },
        attributeValues: {
          select: {
            id: true,
            value: true,
            displayValue: true,
            attribute: {
              select: {
                id: true,
                name: true,
                displayName: true
              }
            }
          }
        }
      }
    });
  }

  /**
   * Update variant
   */
  async update(id, data) {
    return prisma.productVariant.update({
      where: { id },
      data,
      select: {
        id: true,
        productId: true,
        availability: true,
        priceOverride: true,
        createdAt: true,
        updatedAt: true,
        product: {
          select: {
            id: true,
            name: true,
            price: true
          }
        },
        attributeValues: {
          select: {
            id: true,
            value: true,
            displayValue: true,
            attribute: {
              select: {
                id: true,
                name: true,
                displayName: true
              }
            }
          }
        }
      }
    });
  }

  /**
   * Delete variant
   */
  async remove(id) {
    return prisma.productVariant.delete({
      where: { id }
    });
  }

  /**
   * Check if product exists
   */
  async productExists(productId) {
    return prisma.product.findUnique({
      where: { id: productId }
    });
  }

  /**
   * Check if attribute value exists
   */
  async attributeValueExists(valueId) {
    return prisma.variantAttributeValue.findUnique({
      where: { id: valueId },
      include: {
        attribute: true
      }
    });
  }

  /**
   * Toggle variant availability
   */
  async toggleAvailability(id) {
    const variant = await prisma.productVariant.findUnique({
      where: { id },
      select: { availability: true }
    });

    if (!variant) return null;

    const newAvailability = variant.availability === 'AVAILABLE' ? 'NOT_AVAILABLE' : 'AVAILABLE';

    return prisma.productVariant.update({
      where: { id },
      data: { availability: newAvailability },
      select: {
        id: true,
        productId: true,
        availability: true,
        priceOverride: true,
        createdAt: true,
        updatedAt: true,
        product: {
          select: {
            id: true,
            name: true,
            price: true
          }
        },
        attributeValues: {
          select: {
            id: true,
            value: true,
            displayValue: true,
            attribute: {
              select: {
                id: true,
                name: true,
                displayName: true
              }
            }
          }
        }
      }
    });
  }
}
