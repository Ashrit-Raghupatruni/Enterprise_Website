import { AdminAttributeService } from '../services/AdminAttributeService.js';

export class AdminAttributeController {
  constructor() {
    this.service = new AdminAttributeService();
  }

  list = async (req, res) => {
    try {
      const result = await this.service.list();
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

  listValues = async (req, res) => {
    try {
      const { id } = req.params;
      const result = await this.service.listValues(id);
      return res.json(result);
    } catch (err) {
      const status = err.status || 500;
      return res.status(status).json({
        success: false,
        message: err.message
      });
    }
  };

  createValue = async (req, res) => {
    try {
      const { id } = req.params;
      const result = await this.service.createValue(id, req.body);
      return res.status(201).json(result);
    } catch (err) {
      const status = err.status || 500;
      return res.status(status).json({
        success: false,
        message: err.message
      });
    }
  };
}

export default new AdminAttributeController();
