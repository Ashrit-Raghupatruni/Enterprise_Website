import { AdminStatsService } from '../services/AdminStatsService.js';

export class AdminStatsController {
  constructor() {
    this.service = new AdminStatsService();
  }

  getStats = async (req, res) => {
    try {
      const stats = await this.service.aggregate();
      return res.json({
        success: true,
        data: stats
      });
    } catch (err) {
      const status = err.status || 500;
      return res.status(status).json({
        success: false,
        message: err.message
      });
    }
  };
}

export default new AdminStatsController();