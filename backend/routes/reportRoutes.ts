import { Router, Request, Response } from 'express';
import { BaoCaoController } from '../controllers/BaoCaoController';

export function createReportRoutes(controller: BaoCaoController): Router {
  const router = Router();

  // GET /reports/overdue
  router.get('/overdue', (req: Request, res: Response) => {
    try {
      const result = controller.getOverdueLoans();
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // GET /reports/inventory
  router.get('/inventory', (req: Request, res: Response) => {
    try {
      const result = controller.getInventoryStatus();
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  return router;
}
