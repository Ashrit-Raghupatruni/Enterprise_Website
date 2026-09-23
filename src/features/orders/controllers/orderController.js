import { OrderService } from '../services/orderService.js';

export class OrderController {
  constructor() {
    this.orderService = new OrderService();
  }

  getUserOrders = async (req, res) => {
    try {
      const userId = req.user?.userId || req.user?.id;

      if (!userId) {
        return res.status(401).json({ success: false, message: "Unauthorized: User ID not found" });
      }

      const orders = await this.orderService.getUserOrders(userId);

      res.status(200).json({
        success: true,
        data: orders
      });
    } catch (error) {
      console.error('getUserOrders error:', error);
      res.status(500).json({
        success: false,
        message: error.message || 'Internal server error'
      });
    }
  }
}
