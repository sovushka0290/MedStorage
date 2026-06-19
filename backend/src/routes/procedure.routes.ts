import { Router } from 'express';
import { createProcedure, logProcedure, getProcedureComparison } from '../services/procedure.service';
import { authMiddleware } from '../middleware/auth.middleware';
import { roleGuard } from '../middleware/role.middleware';

const router = Router();

// Storekeeper creates procedures and norms
router.post('/', authMiddleware, roleGuard(['ADMIN', 'STOREKEEPER']), async (req, res) => {
  try {
    const procedure = await createProcedure(req.body);
    res.status(201).json(procedure);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Nurse logs a procedure execution
router.post('/log', authMiddleware, roleGuard(['ADMIN', 'NURSE']), async (req, res) => {
  try {
    const userId = (req as any).user.id;
    const log = await logProcedure({ ...req.body, userId });
    res.status(201).json(log);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Manager or Head Nurse view comparison (Fact vs Norm)
router.get('/compare', authMiddleware, roleGuard(['ADMIN', 'MANAGER', 'HEAD_NURSE']), async (req, res) => {
  try {
    const comparison = await getProcedureComparison();
    res.json(comparison);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
