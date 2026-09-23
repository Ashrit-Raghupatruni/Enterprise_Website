import prisma from '../../../config/prisma.js';

export class OrderService {
  async getUserOrders(userId) {
    try {
      const orders = await prisma.order.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        include: {
          items: {
            include: {
              product: {
                include: {
                  productImages: {
                    where: { isPrimary: true }
                  }
                }
              }
            }
          }
        }
      });
      return orders;
    } catch (error) {
      console.error('Error fetching user orders:', error);
      throw new Error('Failed to fetch orders');
    }
  }
}
