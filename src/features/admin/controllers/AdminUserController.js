import { AdminUserService } from '../services/AdminUserService.js';

export class AdminUserController {
  constructor() {
    this.service = new AdminUserService();
  }

  list = async (req, res) => {
    try {
      const filters = {
        search: req.query.search,
        role: req.query.role,
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

  getDetail = async (req, res) => {
    try {
      const { id } = req.params;

      const result = await this.service.getDetail(id);
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

export default new AdminUserController();
