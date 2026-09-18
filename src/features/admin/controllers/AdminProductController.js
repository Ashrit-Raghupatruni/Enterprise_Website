import { AdminProductService } from '../services/AdminProductService.js';

export class AdminProductController {
  constructor() {
    this.service = new AdminProductService();
  }

  list = async (req, res) => {
    try {
      const filters = {
        search: req.query.search,
        category: req.query.category,
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

  update = async (req, res) => {
    try {
      const { id } = req.params;
      const result = await this.service.update(id, req.body);
      return res.json(result);
    } catch (err) {
      const status = err.status || 500;
      return res.status(status).json({
        success: false,
        message: err.message
      });
    }
  };

  toggleVisibility = async (req, res) => {
    try {
      const { id } = req.params;
      const result = await this.service.toggleVisibility(id);
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

export default new AdminProductController();
