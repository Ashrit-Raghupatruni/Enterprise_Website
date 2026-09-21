import prisma from '../../../config/prisma.js';

export class AdminOrderRepository {
  /**
   * Find all orders with user and item count
   */
  async findAll(where = {}, skip = 0, take = 20, orderBy = { createdAt: 'desc' }) {
    const orders = await prisma.order.findMany({
      where,
      skip,
      take,
      orderBy,
      select: {
        id: true,
        shortId: true,
        userId: true,
        status: true,
        subtotal: true,
        discountAmount: true,
        deliveryFee: true,
        totalAmount: true,
        paymentMethod: true,
        paymentStatus: true,
        deliveryDate: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            phone_number: true
          }
        },
        _count: {
          select: {
            items: true
          }
        }
      }
    });

    const total = await prisma.order.count({ where });

    return {
      orders: orders.map(o => ({
        ...o,
        itemCount: o._count.items,
        _count: undefined
      })),
      total
    };
  }

  /**
   * Find order by ID with all items and product details
   */
  async findById(id) {
    return prisma.order.findUnique({
      where: { id },
      select: {
        id: true,
        shortId: true,
        userId: true,
        status: true,
        subtotal: true,
        discountAmount: true,
        deliveryFee: true,
        totalAmount: true,
        paymentMethod: true,
        paymentStatus: true,
        shippingAddress: true,
        deliveryDate: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            phone_number: true,
            addresses: {
              select: {
                id: true,
                full_name: true,
                address_line_1: true,
                city: true,
                state: true
              }
            }
          }
        },
        items: {
          select: {
            id: true,
            productId: true,
            productName: true,
            variantDescription: true,
            unitPrice: true,
            quantity: true,
            lineTotal: true,
            product: {
              select: {
                id: true,
                name: true,
                slug: true
              }
            }
          }
        }
      }
    });
  }

  /**
   * Update order status
   */
  async update(id, data) {
    return prisma.order.update({
      where: { id },
      data,
      select: {
        id: true,
        shortId: true,
        userId: true,
        status: true,
        subtotal: true,
        discountAmount: true,
        deliveryFee: true,
        totalAmount: true,
        paymentMethod: true,
        paymentStatus: true,
        shippingAddress: true,
        deliveryDate: true,
        createdAt: true,
        updatedAt: true,
        user: {
          select: {
            id: true,
            username: true,
            email: true,
            phone_number: true
          }
        },
        _count: {
          select: {
            items: true
          }
        }
      }
    });
  }
}
