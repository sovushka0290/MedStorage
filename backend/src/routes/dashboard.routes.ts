import { Router } from 'express';
import { getDashboardMetrics } from '../services/dashboard.service';
import { authMiddleware } from '../middleware/auth.middleware';
import { roleGuard } from '../middleware/role.middleware';

const router = Router();

// Метрики доступны Руководителю (и Админу)
router.get('/metrics', authMiddleware, roleGuard(['ADMIN', 'MANAGER']), async (req, res) => {
  try {
    const metrics = await getDashboardMetrics();
    res.json(metrics);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
