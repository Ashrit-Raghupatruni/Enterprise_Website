import prisma from '../../../config/prisma.js';

export class OrderRepository {
  /**
   * Find address by ID and ensure it belongs to the user
   */
  async findUserAddress(userId, addressId) {
    return prisma.address.findFirst({
      where: {
        id: addressId,
        user_id: userId,
      },
    });
  }

  /**
   * Find product details with primary image for order calculation and display
   */
  async findProductByIdOrSlug(productIdOrSlug) {
    return prisma.product.findFirst({
      where: {
        OR: [
          { id: productIdOrSlug },
          { slug: productIdOrSlug },
        ],
      },
      include: {
        productImages: {
          where: { isPrimary: true },
          take: 1,
        },
        variants: {
          include: {
            attributeValues: {
              include: {
                attribute: true,
              },
            },
          },
        },
      },
    });
  }

  /**
   * Create an order in a database transaction with price snapshots and OrderItems
   */
  async createOrder({ userId, shippingAddressSnapshot, orderData, orderItemsData }) {
    return prisma.$transaction(async (tx) => {
      // 1. Create the Order record
      const order = await tx.order.create({
        data: {
          shortId: orderData.shortId,
          userId,
          status: 'PROCESSING',
          subtotal: orderData.subtotal,
          discountAmount: orderData.discountAmount,
          deliveryFee: orderData.deliveryFee,
          totalAmount: orderData.totalAmount,
          paymentMethod: orderData.paymentMethod || 'COD',
          paymentStatus: orderData.paymentStatus || 'Pending',
          shippingAddress: typeof shippingAddressSnapshot === 'string'
            ? shippingAddressSnapshot
            : JSON.stringify(shippingAddressSnapshot),
          deliveryDate: orderData.deliveryDate || '3-5 Business Days',
        },
      });

      // 2. Create OrderItem records attached to this order
      const createdItems = [];
      for (const item of orderItemsData) {
        const orderItem = await tx.orderItem.create({
          data: {
            orderId: order.id,
            productId: item.productId,
            variantId: item.variantId || null,
            productName: item.productName,
            variantDescription: item.variantDescription || '',
            unitPrice: item.unitPrice,
            quantity: item.quantity,
            lineTotal: item.lineTotal,
          },
        });
        createdItems.push(orderItem);

        // 3. Record interaction for trending deals algorithm (if productId is valid)
        try {
          await tx.productInteraction.create({
            data: {
              productId: item.productId,
              userId,
              type: 'PURCHASE',
            },
          });
        } catch (_) {
          // Non-blocking interaction recording
        }
      }

      return {
        ...order,
        items: createdItems,
      };
    });
  }

  /**
   * Get all orders for a specific user
   */
  async getUserOrders(userId) {
    return prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                brand: true,
                productImages: {
                  select: {
                    imageUrl: true,
                    isPrimary: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }

  /**
   * Get single order by ID for a specific user
   */
  async getUserOrderById(userId, orderId) {
    return prisma.order.findFirst({
      where: {
        id: orderId,
        userId,
      },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                slug: true,
                brand: true,
                productImages: {
                  select: {
                    imageUrl: true,
                    isPrimary: true,
                  },
                },
              },
            },
          },
        },
      },
    });
  }
}
