import { AdminVariantService } from '../services/AdminVariantService.js';

export class AdminVariantController {
  constructor() {
    this.service = new AdminVariantService();
  }

  list = async (req, res) => {
    try {
      const filters = {
        productId: req.query.productId,
        availability: req.query.availability,
        page: req.query.page,
        limit: req.query.limit
      };

      const result = await this.service.list(filters);
      return res.json(result);
    } catch (err) {
      const status = err.status || 500;
      return res.status(status).json({
        success: false,
        message: err.message
      });
    }
  };

  create = async (req, res) => {
    try {
      const result = await this.service.create(req.body);
      return res.status(201).json(result);
    } catch (err) {
      const status = err.status || 500;
      return res.status(status).json({
        success: false,
        message: err.message
      });
    }
  };

  toggleAvailability = async (req, res) => {
    try {
      const { id } = req.params;
      const result = await this.service.toggleAvailability(id);
      return res.json(result);
    } catch (err) {
      const status = err.status || 500;
      return res.status(status).json({
        success: false,
        message: err.message
      });
    }
  };

  remove = async (req, res) => {
    try {
      const { id } = req.params;
      const result = await this.service.remove(id);
      return res.json(result);
    } catch (err) {
      const status = err.status || 500;
      return res.status(status).json({
        success: false,
        message: err.message
      });
    }
  };
}

export default new AdminVariantController();
