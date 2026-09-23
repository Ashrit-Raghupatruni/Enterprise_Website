import express from 'express';
import jwtAuthenticate from '../../../middleware/jwtmiddleware.js';
import { OrderController } from '../controllers/orderController.js';

const router = express.Router();
const orderController = new OrderController();

// GET /api/orders
router.get('/orders', jwtAuthenticate, orderController.getUserOrders);

export default router;
