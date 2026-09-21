import { AdminBannerService } from '../services/AdminBannerService.js';

export class AdminBannerController {
  constructor() {
    this.service = new AdminBannerService();
  }

  list = async (req, res) => {
    try {
      const filters = {
        status: req.query.status,
        search: req.query.search
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

  toggle = async (req, res) => {
    try {
      const { id } = req.params;
      const result = await this.service.toggle(id);
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

export default new AdminBannerController();
